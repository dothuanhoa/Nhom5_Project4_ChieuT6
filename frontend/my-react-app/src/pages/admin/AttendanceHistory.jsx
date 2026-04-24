import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import "../../assets/styles/AdminStyle.css";

import SearchBar from "../../components/SearchBar";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";
const NODE_API_URL = "https://api-backend-node-nhom5-chieut6.onrender.com";

export default function AttendanceHistory() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //Call API classes
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const listClasses = data;
        setClasses(listClasses);
        if (listClasses.length > 0) setSelectedClassId(listClasses[0].id);
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
      .then((data) => {
        setRecords(data.data);
      })
      .catch(() => {
        toast.error("Không thể lấy lịch sử điểm danh");
        setRecords([]);
      });
  }, [selectedClassId]);
  ///End Call API lấy Lịch sử điểm danh

  //Tìm kiếm
  const danhSachDaLoc = records.filter((item) => {
    const khopTimKiem =
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student_code.toLowerCase().includes(searchTerm.toLowerCase());
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

          <div className="form-group no-margin">
            <label className="form-label">Tìm kiếm</label>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tên hoặc mã SV..."
            />
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
