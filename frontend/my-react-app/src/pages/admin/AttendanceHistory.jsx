import React from "react";
import useAttendance from "../../hooks/useAttendance";
import { toast } from "sonner";
import "../../assets/styles/admin.style.css";

export default function AttendanceHistory() {
  const {
    records,
    currentRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    selectedTeacher,
    setSelectedTeacher,
    selectedDate,
    setSelectedDate,
    refresh,
  } = useAttendance();

  // Lấy danh sách duy nhất cho bộ lọc
  const uniqueClasses = [
    ...new Set((records || []).map((r) => r.classId).filter(Boolean)),
  ];
  const uniqueTeachers = [
    ...new Set((records || []).map((r) => r.teacher).filter(Boolean)),
  ];

  const getStatusBadge = (status) => {
    const config = {
      present: { label: "Có mặt", icon: "fa-circle-check", class: "success" },
      late: { label: "Muộn", icon: "fa-clock", class: "neutral" },
      absent: { label: "Vắng mặt", icon: "fa-circle-xmark", class: "danger" },
    };
    const item = config[status] || config.absent;
    return (
      <span className={`stat-badge ${item.class}`}>
        <i className={`fa-solid ${item.icon}`}></i> {item.label}
      </span>
    );
  };

  return (
    <div className="attendance-page">
      {/* HEADER */}
      <div className="page-header">
        <h2 className="dashboard-title">Lịch sử điểm danh</h2>
        <button className="btn-primary">
          <i className="fa-solid fa-file-export"></i> Xuất báo cáo
        </button>
      </div>

      {/* FILTER SECTION */}
      <div
        className="table-wrapper"
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <div
          className="form-grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Giảng viên</label>
            <select
              className="input-field"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="all">Tất cả giảng viên</option>
              {uniqueTeachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Lớp học</label>
            <select
              className="input-field"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Tất cả lớp học</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Ngày</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                refresh();
                toast.success("Đã cập nhật dữ liệu");
              }}
              className="btn-secondary"
              style={{ width: "100%", height: "48px" }}
            >
              <i className="fa-solid fa-rotate"></i> Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="table-wrapper">
        <div className="search-filter-section">
          <h3 style={{ fontWeight: 800 }}>Chi tiết bản ghi</h3>
          <div className="search-input-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              placeholder="Tìm tên, mã sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Mã SV / Lớp</th>
                <th>Thời gian</th>
                <th style={{ textAlign: "center" }}>Độ khớp (Face)</th>
                <th style={{ textAlign: "center" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="student-info-cell">
                      <div className="student-avatar-circle">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <b style={{ textTransform: "uppercase" }}>
                        {record.studentName}
                      </b>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{record.studentId}</span>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {record.classId}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{record.time}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {record.date}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        color: "var(--admin-blue)",
                      }}
                    >
                      {record.similarity ?? 0}%
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className="table-footer"
          style={{
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8" }}>
            TRANG {currentPage} / {totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn-secondary"
              style={{ padding: "8px 16px" }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <button
              className="btn-primary"
              style={{ padding: "8px 16px" }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
