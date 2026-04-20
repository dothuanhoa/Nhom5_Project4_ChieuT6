package com.export;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class ExportHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        try {
            System.out.println("=== EXPORT EXCEL ===");

            // ===== CORS =====
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // ===== GET PARAM =====
            String query = exchange.getRequestURI().getQuery();

            if (query == null) {
                sendError(exchange, "Missing params");
                return;
            }

            Map<String, String> params = new HashMap<>();
            for (String p : query.split("&")) {
                String[] pair = p.split("=");
                if (pair.length == 2) {
                    params.put(pair[0], pair[1]);
                }
            }

            String courseId = params.get("courseId");
            String fromDate = params.get("from");
            String toDate = params.get("to");

            if (courseId == null) {
                sendError(exchange, "Missing courseId");
                return;
            }

            // ===== CONNECT DB =====
            Connection conn = DriverManager.getConnection(
                "jdbc:postgresql://dpg-d7gdfom7r5hc73d5n0v0-a.singapore-postgres.render.com:5432/nhom5_thu6_xcbm",
                "nhom5_thu6_xcbm_user",
                "wHkaImVopwIIQ35sDwo5Cn0vTj4JozAp"
            );

            // ===== SQL (ĐÃ FIX) =====
            String sql =
                "SELECT s.student_code, s.full_name, a.attendance_date, a.status " +
                "FROM students s " +
                "JOIN enrollments e ON s.id = e.student_id " +
                "LEFT JOIN attendance_logs a " +
                "ON s.id = a.student_id AND e.course_section_id = a.course_section_id " +
                "WHERE e.course_section_id = ? ";

            if (fromDate != null && toDate != null) {
                sql += "AND a.attendance_date BETWEEN ? AND ? ";
            }

            sql += "ORDER BY s.student_code, a.attendance_date";

            PreparedStatement ps = conn.prepareStatement(sql);

            int idx = 1;
            ps.setInt(idx++, Integer.parseInt(courseId));

            if (fromDate != null && toDate != null) {
                ps.setDate(idx++, java.sql.Date.valueOf(fromDate));
                ps.setDate(idx++, java.sql.Date.valueOf(toDate));
            }

            ResultSet rs = ps.executeQuery();

            // ===== DATA =====
            Map<String, Map<String, String>> data = new LinkedHashMap<>();
            Set<String> dates = new TreeSet<>();

            while (rs.next()) {
                String code = rs.getString("student_code");
                String name = rs.getString("full_name");

                java.sql.Date dateObj = rs.getDate("attendance_date");
                String date = (dateObj != null) ? dateObj.toString() : null;

                String status = rs.getString("status");

                String key = code + "|" + name;

                if (date != null) dates.add(date);

                data.putIfAbsent(key, new HashMap<>());
                if (date != null) {
                    data.get(key).put(date, status);
                }
            }

            // ===== CREATE EXCEL =====
            Workbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Attendance");

            // HEADER STYLE
            CellStyle headerStyle = wb.createCellStyle();
            Font bold = wb.createFont();
            bold.setBold(true);
            headerStyle.setFont(bold);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // CELL STYLE
            CellStyle cellStyle = wb.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.CENTER);

            // PRESENT STYLE
            CellStyle presentStyle = wb.createCellStyle();
            presentStyle.cloneStyleFrom(cellStyle);
            presentStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            presentStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // HEADER
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("MSSV");
            header.createCell(1).setCellValue("Tên");

            int col = 2;
            for (String d : dates) {
                Cell c = header.createCell(col++);
                c.setCellValue(d);
                c.setCellStyle(headerStyle);
            }

            header.createCell(col).setCellValue("Tổng");

            // DATA
            int rowIdx = 1;

            for (String key : data.keySet()) {

                String[] parts = key.split("\\|");

                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(parts[0]);
                row.createCell(1).setCellValue(parts[1]);

                int total = 0;
                col = 2;

                for (String d : dates) {
                    String status = data.get(key).getOrDefault(d, "");

                    Cell c = row.createCell(col);

                    if ("present".equalsIgnoreCase(status)) {
                        c.setCellValue("x");
                        c.setCellStyle(presentStyle);
                        total++;
                    } else {
                        c.setCellStyle(cellStyle);
                    }
                    col++;
                }

                row.createCell(col).setCellValue(total);
            }

            // AUTO SIZE
            for (int i = 0; i <= col; i++) {
                sheet.autoSizeColumn(i);
            }

            // ===== RESPONSE =====
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);

            byte[] bytes = out.toByteArray();

            exchange.getResponseHeaders().add("Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            exchange.getResponseHeaders().add("Content-Disposition",
                "attachment; filename=attendance.xlsx");

            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();

            rs.close();
            ps.close();
            conn.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendError(HttpExchange exchange, String msg) throws IOException {
        exchange.sendResponseHeaders(400, msg.length());
        exchange.getResponseBody().write(msg.getBytes());
        exchange.getResponseBody().close();
    }
}