import React from "react";
import { useNavigate } from "react-router-dom";
import useClasses from "../../hooks/useClasses";
import AssignStudentModal from "../../components/AssignStudentModal";
import "../../assets/styles/admin.style.css";

export default function Classes() {
  const navigate = useNavigate();
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredClasses,
    handleDelete,
    handleAssignStudents,
    showAssignModal,
    setShowAssignModal,
    selectedClass,
    fetchClasses,
  } = useClasses();

  if (isLoading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="classes-page">
      <div className="page-header">
        <h2 className="dashboard-title">Quản lý lớp học</h2>
        <button className="btn-primary" onClick={() => navigate("add")}>
          <i className="fa-solid fa-plus"></i> Tạo lớp học mới
        </button>
      </div>

      <div className="table-wrapper">
        <div className="search-filter-section">
          <div className="header-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Tìm mã môn, tên môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-select-box">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn học</th>
                <th>Nhóm</th>
                <th>Sĩ số</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td>
                    <span className="id-badge">{cls.courseId}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{cls.courseName}</span>
                  </td>
                  <td>
                    <span className="stat-badge neutral">{cls.group}</span>
                  </td>
                  <td>
                    <b>{cls.studentCount}</b>{" "}
                    <span style={{ color: "#94a3b8" }}>
                      / {cls.maxStudents}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`stat-badge ${cls.status === "active" ? "success" : "neutral"}`}
                    >
                      {cls.status === "active" ? "Hoạt động" : "Ngưng"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        title="Thêm SV"
                        onClick={() => handleAssignStudents(cls)}
                      >
                        <i className="fa-solid fa-user-plus"></i>
                      </button>
                      <button
                        className="btn-icon"
                        title="Sửa"
                        onClick={() => navigate(`edit/${cls.id}`)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Xóa"
                        onClick={() => handleDelete(cls.id)}
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

      <AssignStudentModal
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        selectedClass={selectedClass}
        onSuccess={fetchClasses}
      />
    </div>
  );
}
