import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import "../assets/styles/Auth.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));

        toast.success("Đăng nhập thành công!");

        // Điều hướng dựa vào Role
        const userRole = data.role?.toLowerCase();
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/teacher");
        }
      })
      .catch((err) => {
        toast.error("Đăng nhập thất bại");
      });
  };

  return (
    <div className="login-container">
      <Toaster position="top-right" />

      <div className="login-card">
        <header className="login-header">
          <div className="logo-wrapper">
            <i className="fa-solid fa-face-smile login-logo-icon"></i>
          </div>
          <h1 className="login-title">Ứng Dụng Điểm Danh</h1>
          <p className="login-subtitle">Chào mừng bạn quay trở lại</p>
        </header>

        {error && (
          <div className="error-alert">
            <i className="fa-solid fa-circle-exclamation error-icon"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-user input-icon-left"></i>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="login-input"
                placeholder="Ví dụ: admin"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-lock input-icon-left"></i>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="login-input"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="submit-btn">
            <span>Đăng nhập</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div className="support-section">
          <div className="support-divider">
            <span className="divider-text">Hỗ trợ</span>
          </div>
          <p className="footer-text">
            Gặp sự cố khi đăng nhập? <a href="#">Liên hệ hỗ trợ</a>
          </p>
        </div>
      </div>
    </div>
  );
}
