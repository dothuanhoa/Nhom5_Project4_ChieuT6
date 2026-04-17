import React from "react";
import { useNavigate } from "react-router-dom";
import useStudents from "../../hooks/useStudents";
import "../../assets/styles/admin.style.css";

export default function Students() {
  const navigate = useNavigate();
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredStudents,
    students,
    handleDelete,
  } = useStudents();

  if (isLoading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p style={{ marginTop: "15px", fontWeight: "600" }}>
          Đang tải dữ liệu...
        </p>
      </div>
    );

  return (
    <div className="students-page">
      {/* HEADER */}
      <div className="page-header">
        <h2 className="dashboard-title">Quản lý sinh viên</h2>
        <button className="btn-add-student" onClick={() => navigate("add")}>
          <i className="fa-solid fa-plus"></i>
          <span>Thêm sinh viên mới</span>
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="table-wrapper">
        <div className="search-filter-section">
          <div className="search-grid">
            <div className="search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm theo mã SV hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <div className="filter-select-box">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ và tên</th>
                <th>Face ID</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className="id-badge">{student.id}</span>
                  </td>
                  <td>
                    <div className="student-info-cell">
                      <div className="student-avatar-circle">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div>
                        <div className="student-name">{student.name}</div>
                        <div className="student-class">{student.class}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {student.faceId ? (
                      <span className="status-label success">
                        <i className="fa-solid fa-circle-check"></i> Đã có
                      </span>
                    ) : (
                      <span className="status-label warning">
                        <i className="fa-solid fa-circle-minus"></i> Chưa có
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`stat-badge ${student.status === "active" ? "success" : "neutral"}`}
                    >
                      {student.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`edit/${student.id}`)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(student.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
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
