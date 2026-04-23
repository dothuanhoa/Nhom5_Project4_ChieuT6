import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

import HeaderWithBack from "../../components/HeaderWithBack";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        return res.text().then((text) => {
          if (!res.ok || text.startsWith("Lỗi")) {
            throw new Error(
              text || "Tên đăng nhậpđã tồn tại hoặc có lỗi xảy ra!",
            );
          }
          return text;
        });
      })
      .then(() => {
        toast.success("Tạo tài khoản thành công!");
        navigate("/admin/users");
      })
      .catch((err) => toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!"));
  };

  return (
    <div className="user-management-page">
      <HeaderWithBack title="Tạo tài khoản" />

      <div className="single-column-layout">
        <div className="edit-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>
                Họ và tên <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="input-field"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên..."
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>
                Tên đăng nhập <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="input-field"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập (VD: gv_nguyenvana)"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>
                Mật khẩu <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="input-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>
                Vai trò phân quyền <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="input-field"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="USER">Giảng viên (USER)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
            </div>

            <div
              className="edit-actions"
              style={{ marginTop: "20px", display: "flex", gap: "10px" }}
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
              >
                Hủy bỏ
              </button>
              <button type="submit" className="btn-save">
                <i
                  className="fa-solid fa-floppy-disk"
                  style={{ marginRight: "8px" }}
                ></i>
                Lưu tài khoản
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
