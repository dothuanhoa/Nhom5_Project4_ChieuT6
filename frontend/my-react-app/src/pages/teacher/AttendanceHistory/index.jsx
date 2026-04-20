import React, { useState, useEffect } from "react";
// import { teacherService } from "../../../services/api_Teacher";
import { toast } from "sonner";
import "./AttendanceHistory.css";

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("CS101");
  const [loading, setLoading] = useState(false);

  // --- CALL API: Lấy lịch sử điểm danh ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await teacherService.getClassHistory(
        selectedClass,
        "2023-10-27",
      );
      setRecords(res.records || []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  // --- END CALL API ---

  useEffect(() => {
    fetchHistory();
  }, [selectedClass]);

  const danhSachDaLoc = records.filter((r) => {
    const daXacMinh = r.status !== "pending";
    const khopTimKiem =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return daXacMinh && khopTimKiem;
  });

  const getStatusBadge = (status) => {
    if (status === "present")
      return <span className="stat-badge success">Có mặt</span>;
    if (status === "late")
      return <span className="stat-badge warning">Đi muộn</span>;
    return <span className="stat-badge danger">Vắng mặt</span>;
  };

  return (
    <div className="attendance-history-page">
      <h2 className="page-title">Lịch sử điểm danh</h2>

      <div className="table-card">
        <div className="history-filter-grid">
          <div className="form-group">
            <label className="form-label">Lớp học</label>
            <select
              className="input-field"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="CS101">Cơ sở dữ liệu - CS101</option>
              <option value="SE204">Thiết kế phần mềm - SE204</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Tìm kiếm</label>
            <input
              className="input-field"
              placeholder="Tên hoặc mã SV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sinh viên</th>
              <th>Mã SV</th>
              <th>Giờ đến</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {danhSachDaLoc.map((record) => (
              <tr key={record.id}>
                <td>
                  <b>{record.studentName}</b>
                </td>
                <td>
                  <span className="id-badge-text">{record.studentId}</span>
                </td>
                <td>{record.time}</td>
                <td>{getStatusBadge(record.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
