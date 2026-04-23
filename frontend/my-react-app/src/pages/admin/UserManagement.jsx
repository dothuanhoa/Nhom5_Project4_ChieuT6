import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

import SearchBar from "../../components/SearchBar";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Lỗi tải danh sách tài khoản"));
  }, []);

  let danhSachDaLoc = users.filter((item) => {
    const search = searchTerm.toLowerCase();
    return item.fullName?.toLowerCase().includes(search) || false;
  });

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUsers((prev) => prev.filter((item) => item.id !== id));
        toast.success("Đã xóa tài khoản");
      })
      .catch((err) => toast.error("Xóa thất bại, vui lòng thử lại"));
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
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm theo họ và tên..."
            />
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
