import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import "../../assets/styles/AdminStyle.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const resultText = await res.text();

      if (!res.ok || resultText.startsWith("Lỗi")) {
        toast.error(
          resultText || "Tên đăng nhập đã tồn tại hoặc có lỗi xảy ra!",
        );
        return;
      }

      toast.success("Tạo tài khoản thành công!");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1000);
    } catch (err) {
      toast.error("Hệ thống đang bận, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="user-management-page">
      <div className="page-header header-with-back">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="title-page">Thêm tài khoản mới</h2>
      </div>

      <div className="table-wrapper register-card">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="bold-text">
              Họ và tên <span className="required-star">*</span>
            </label>
            <div className="search-input-box input-full-width">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên..."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="bold-text">
              Tên đăng nhập <span className="required-star">*</span>
            </label>
            <div className="search-input-box input-full-width">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập (VD: gv_nguyenvana)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="bold-text">
              Mật khẩu <span className="required-star">*</span>
            </label>
            <div className="search-input-box input-full-width">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="bold-text">
              Vai trò phân quyền <span className="required-star">*</span>
            </label>
            <div className="search-input-box input-full-width">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="USER">Giảng viên (USER)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
              <i className="fa-solid fa-chevron-down select-icon"></i>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary btn-submit">
              <i className="fa-solid fa-floppy-disk"></i> Lưu tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
