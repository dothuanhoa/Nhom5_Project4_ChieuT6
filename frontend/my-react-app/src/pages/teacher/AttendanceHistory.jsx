import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import "../../assets/styles/TeacherStyle.css";

import SearchBar from "../../components/SearchBar";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";
const NODE_API_URL = "https://api-backend-node-nhom5-chieut6.onrender.com";
const EXPORT_API_URL = "https://nhom5-project4-chieut6-1.onrender.com";

export default function AttendanceHistory() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  //Call API classes
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      })
      .catch(() => toast.error("Lỗi tải danh sách lớp học"));
  }, []);
  //Call API classes

  // Hàm chuyển đổi chuỗi thời gian
  // const formatDateTime = (timeString) => {
  //   return dayjs(timeString).format("HH:mm:ss - DD/MM/YYYY");
  // };
  const formatDateTime = (timeString) => {
    const fixed = timeString.replace("Z", "");
    return dayjs(fixed).format("HH:mm:ss - DD/MM/YYYY");
  };
  ///Call API lấy Lịch sử điểm danh
  useEffect(() => {
    if (!selectedClassId) return;

    const token = localStorage.getItem("token");
    fetch(`${NODE_API_URL}/api/attendance/history?classId=${selectedClassId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecords(data.data))
      .catch(() => {
        toast.error("Không thể lấy lịch sử điểm danh");
        setRecords([]);
      });
  }, [selectedClassId]);
  ///End Call API lấy Lịch sử điểm danh

  //Tìm kiếm
  const danhSachDaLoc = records.filter((item) => {
    const search = searchTerm.toLowerCase();
    const tenSV = item.full_name;
    const maSV = item.student_code;
    const khopTimKiem =
      tenSV.toLowerCase().includes(search) ||
      maSV.toLowerCase().includes(search);

    let khopNgay = true;
    if (fromDate || toDate) {
      const ngayDiemDanh = new Date(item.check_in_time);
      ngayDiemDanh.setHours(0, 0, 0, 0);

      if (fromDate) {
        const mFromDate = new Date(fromDate);
        mFromDate.setHours(0, 0, 0, 0);
        if (ngayDiemDanh < mFromDate) khopNgay = false;
      }

      if (toDate) {
        const mToDate = new Date(toDate);
        mToDate.setHours(0, 0, 0, 0);
        if (ngayDiemDanh > mToDate) khopNgay = false;
      }
    }

    return khopTimKiem && khopNgay;
  });
  //End Tìm kiếm

  //Xuất file
  const handleExportExcel = () => {
    if (!selectedClassId) {
      toast.error("Vui lòng chọn lớp học để xuất báo cáo!");
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      toast.warning("Vui lòng chọn đầy đủ 'Từ ngày' và 'Đến ngày'!");
      return;
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.error("'Từ ngày' không được lớn hơn 'Đến ngày'!");
      return;
    }

    let url = `${EXPORT_API_URL}/export?courseId=${selectedClassId}`;
    if (fromDate && toDate) {
      url += `&from=${fromDate}&to=${toDate}`;
    }

    window.open(url, "_blank");

    toast.success("Hệ thống đang tải báo cáo xuống máy tính của bạn...");
  };
  //End Xuất file

  return (
    <div className="attendance-history-page">
      <h2 className="page-title">Lịch sử điểm danh</h2>

      <div className="table-card">
        <div className="history-filter-grid">
          <div className="form-group">
            <label className="form-label">Lớp học</label>
            <select
              className="input-field"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.courseCode || item.courseId} - {item.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Tìm kiếm</label>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tên hoặc mã SV..."
            />
          </div>
        </div>
        <div
          className="export-tools-row"
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            paddingTop: "15px",
            borderTop: "1px dashed #e2e8f0",
          }}
        >
          <div className="form-group">
            <label className="form-label">Từ ngày (Tùy chọn)</label>
            <input
              type="date"
              className="input-field"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Đến ngày (Tùy chọn)</label>
            <input
              type="date"
              className="input-field"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleExportExcel}
            style={{
              background: "#10b981",
              marginLeft: "auto",
              padding: "10px 20px",
            }}
          >
            <i className="fa-solid fa-file-excel"></i> Xuất Excel
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Sinh Viên</th>
                <th>Sinh viên</th>
                <th>Thời gian điểm danh</th>
                <th>Độ chính xác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span>{record.student_code}</span>
                  </td>
                  <td>
                    <span className="student-name-bold">
                      {record.full_name}
                    </span>
                  </td>
                  <td>{formatDateTime(record.check_in_time)}</td>
                  <td>{record.similarity_score} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
