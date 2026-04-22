import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import "../../assets/styles/AdminStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const listData = Array.isArray(data) ? data : [];
        setUsers(listData);
      })
      .catch((err) => toast.error("Lỗi tải danh sách tài khoản"))
      .finally(() => setIsLoading(false));
  }, []);

  let danhSachDaLoc = users.filter((item) => {
    const search = searchTerm.toLowerCase();
    return item.fullName?.toLowerCase().includes(search) || false;
  });

  const handleDelete = (id) => {
    if (!id) {
      toast.error("Không thể xóa: Backend chưa cung cấp ID cho tài khoản này!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Xóa thất bại");
        setUsers((prev) => prev.filter((item) => item.id !== id));
        toast.success("Đã xóa tài khoản");
      })
      .catch((err) => toast.error("Hệ thống đang bảo trì chức năng xóa!"));
  };

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h2 className="title-page">Quản lý tài khoản</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/users/add")}
        >
          <i className="fa-solid fa-user-plus"></i> Tạo tài khoản mới
        </button>
      </div>

      <div className="table-wrapper">
        <div className="search-filter-section">
          <div className="search-grid">
            <div className="search-input-box">
              <input
                type="text"
                placeholder="Tìm theo họ và tên..."
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
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{index + 1}</strong>
                  </td>
                  <td>
                    <span className="bold-text">
                      {item.fullName || "Chưa cập nhật"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`stat-badge ${
                        item.role === "ADMIN" ? "neutral" : "success"
                      }`}
                    >
                      {item.role === "ADMIN" ? "Quản trị viên" : "Giảng viên"}
                    </span>
                  </td>
                  <td>
                    <div>
                      <button
                        className="btn-icon delete"
                        title="Xóa"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {danhSachDaLoc.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">
                    <p>Không tìm thấy tài khoản nào.</p>
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
