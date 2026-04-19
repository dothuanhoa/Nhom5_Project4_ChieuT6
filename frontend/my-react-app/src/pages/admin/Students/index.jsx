import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { studentService } from "../../../services/api_Admin";
import "./Students.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // call API
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => toast.error("Lỗi tải dữ liệu sinh viên"))
      .finally(() => setIsLoading(false));
  }, []);
  //End call API

  // Tìm kiếm
  let danhSachDaLoc = students.filter((sv) => {
    const search = searchTerm.toLowerCase();
    return (
      sv.fullName?.toLowerCase().includes(search) ||
      sv.studentCode?.toLowerCase().includes(search)
    );
  });
  // End Tìm kiếm

  // call API delete
  const handleDelete = async (studentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) 
      return;
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setStudents((prev) => prev.filter((sv) => sv.id !== studentId));
        toast.success("Đã xóa sinh viên thành công");
      })
      .catch((err) => toast.error("Xóa thất bại, vui lòng thử lại"));
  };
  //End call API delete

  // loading
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p
          className="loading-text"
          style={{ marginTop: "16px", color: "#64748b", fontWeight: "500" }}
        >
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="students-page">
      <div className="page-header">
        <h2 className="title-page">Quản lý sinh viên</h2>
        <button className="btn-add-student" onClick={() => navigate("/admin/register-face")}>
          <i className="fa-solid fa-plus"></i>
          <span>Thêm sinh viên mới</span>
        </button>
      </div>

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
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ và tên</th>
                <th>Face ID</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="id-badge">{item.studentCode}</span>
                  </td>

                  <td>
                    <div className="student-info-cell">
                      <div className="student-avatar-circle">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div>
                        <div className="student-name">{item.fullName}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {item.faceId ? (
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
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`edit/${item.id}`)}
                        title="Sửa"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(item.id)}
                        title="Xóa"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Xử lý khi gõ tìm kiếm mà không ra ai */}
              {danhSachDaLoc.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#94a3b8",
                    }}
                  >
                    <i
                      className="fa-solid fa-folder-open"
                      style={{
                        fontSize: "24px",
                        marginBottom: "8px",
                        opacity: 0.5,
                      }}
                    ></i>
                    <p>Không tìm thấy sinh viên nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
