import React, { useState, useEffect } from "react";
import { attendanceService } from "../../../services/api_Admin";
import "./AttendanceHistory.css";

export default function AttendanceHistory() {
  // --- STATE ---
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  // --- END STATE ---

  // --- FETCH API ---
  useEffect(() => {
    const fetchData = async () => {
      const res = await attendanceService.getRecords();
      if (res && res.records) {
        setRecords(res.records);
      }
    };
    fetchData();
  }, []);
  // --- END FETCH API ---

  // --- FILTER DATA ---
  let danhSachDaLoc = records.filter((item) => {
    const dungTen = item.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dungLop = selectedClass === "all" || item.classId === selectedClass;

    return dungTen && dungLop;
  });
  // --- END FILTER DATA ---

  // --- RENDER UI ---
  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2 className="title-page">Lịch sử điểm danh</h2>
      </div>

      <div className="table-wrapper filters">
        <div className="form-grid filters">
          <div className="form-group no-margin">
            <label className="form-label">Lớp học</label>
            <select
              className="input-field"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Tất cả lớp học</option>
              <option value="CS101">Cơ sở dữ liệu - CS101</option>
              <option value="SE204">Thiết kế phần mềm - SE204</option>
            </select>
          </div>

          <div className="form-group no-margin">
            <label className="form-label">Tìm kiếm</label>
            <div className="search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder="Gõ tên sinh viên vào đây..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Mã SV / Lớp</th>
                <th>Độ khớp</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="student-info-cell">
                      <b>{record.studentName}</b>
                    </div>
                  </td>
                  <td>
                    <span className="bold-text">{record.studentId}</span>
                    <div className="small-muted">{record.classId}</div>
                  </td>
                  <td>
                    <span className="similarity-score">
                      {record.similarity}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
