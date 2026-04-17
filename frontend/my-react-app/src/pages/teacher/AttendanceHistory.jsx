import React from "react";
import useTeacherAttendanceHistory from "../../hooks/useTeacherAttendanceHistory";
import "../../assets/styles/teacher.style.css";

export default function AttendanceHistory() {
  const {
    filteredRecords,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    handleVerify,
    loading,
  } = useTeacherAttendanceHistory();

  const getStatusBadge = (status) => {
    const config = {
      present: { label: "CÓ MẶT", class: "success" },
      late: { label: "MUỘN", class: "neutral" },
      absent: { label: "VẮNG", class: "danger" },
      pending: { label: "CHỜ XÁC MINH", class: "warning" },
    };
    const item = config[status] || config.absent;
    return <span className={`stat-badge ${item.class}`}>{item.label}</span>;
  };

  return (
    <div className="attendance-history-page">
      <div className="page-header">
        <h2 className="dashboard-title">Lịch sử điểm danh</h2>
      </div>

      {/* KHU VỰC BỘ LỌC */}
      <div
        className="table-wrapper"
        style={{ marginBottom: "24px", padding: "24px" }}
      >
        <div className="history-filter-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Chọn lớp học</label>
            <div className="select-wrapper">
              <select
                className="input-field"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="CS101">Cơ sở dữ liệu - CS101</option>
                <option value="SE204">Thiết kế phần mềm - SE204</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Ngày học</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">Tìm kiếm</label>
            <div className="search-input-box" style={{ width: "100%" }}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                placeholder="Tên hoặc mã SV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG LỊCH SỬ */}
      <div className="table-wrapper">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Mã sinh viên</th>
                <th>Giờ điểm danh</th>
                <th style={{ textAlign: "center" }}>Độ khớp AI</th>
                <th style={{ textAlign: "center" }}>Trạng thái</th>
                <th style={{ textAlign: "center" }}>Xác minh</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="student-info-cell">
                      <img
                        src={record.avatar}
                        className="student-avatar-img"
                        alt="avatar"
                      />
                      <b style={{ fontSize: "14px" }}>{record.studentName}</b>
                    </div>
                  </td>
                  <td>
                    <span className="id-badge-text">{record.studentId}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{record.time}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="accuracy-container">
                      <div className="accuracy-bar-bg">
                        <div
                          className={`accuracy-bar-fill ${record.similarity >= 90 ? "high" : record.similarity >= 70 ? "mid" : "low"}`}
                          style={{ width: `${record.similarity}%` }}
                        ></div>
                      </div>
                      <span className="accuracy-text">
                        {record.similarity}%
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {getStatusBadge(record.status)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {record.status === "pending" ? (
                      <button
                        className="btn-verify-action"
                        onClick={() => handleVerify(record.id)}
                      >
                        Xác minh
                      </button>
                    ) : record.isVerified ? (
                      <i
                        className="fa-solid fa-circle-check"
                        style={{ color: "var(--success)", fontSize: "18px" }}
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-circle-minus"
                        style={{ color: "#cbd5e1", fontSize: "18px" }}
                      ></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
        <div className="table-footer">
          <div className="pagination-info">
            Hiển thị {filteredRecords.length} kết quả
          </div>
          <div className="pagination-btns">
            <button className="p-btn">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="p-btn active">1</button>
            <button className="p-btn">2</button>
            <button className="p-btn">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
