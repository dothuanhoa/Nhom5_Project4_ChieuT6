import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import "../assets/styles/Auth.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //call API login
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Tài khoản không chính xác");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token || data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      toast.success("Đăng nhập thành công!");

      const userRole = (data.user?.role || data.role)?.toLowerCase();

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/teacher");
      }
    } catch (err) {
      setError("Hệ thống đang bận. Vui lòng thử lại sau");
      toast.error("Đã xảy ra lỗi kết nối mạng");
    }
    //End call API login
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
