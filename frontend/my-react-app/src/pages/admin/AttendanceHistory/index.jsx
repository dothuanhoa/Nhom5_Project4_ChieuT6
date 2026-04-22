import React, { useState, useEffect } from "react";
import "./AttendanceHistory.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function AttendanceHistory() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  //Call API classes
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const listClasses = data.classes || data || [];
        setClasses(listClasses);
        if (listClasses.length > 0) setSelectedClassId(listClasses[0].id);
      })
      .catch(() => toast.error("Lỗi tải danh sách lớp học"));
  }, []);
  //Call API classes

  //Tìm kiếm
  const danhSachDaLoc = records.filter((r) => {
    const khopTimKiem =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return khopTimKiem;
  });
  //End Tìm kiếm

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
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.courseCode || item.courseId} - {item.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group no-margin">
            <label className="form-label">Tìm kiếm</label>
            <div className="search-input-box">
              <input
                placeholder="Tên hoặc mã SV..."
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
                <th>Mã Sinh Viên</th>
                <th>Sinh viên</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="id-badge-text">{record.studentId}</span>
                  </td>
                  <td>
                    <span className="student-name-bold">
                      {record.studentName}
                    </span>
                  </td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
