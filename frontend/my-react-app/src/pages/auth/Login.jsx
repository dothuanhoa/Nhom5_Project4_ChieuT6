import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

// Import CSS thuần cho Login
import "../../assets/styles/auth.style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Đăng nhập thành công!");
        const userData = JSON.parse(localStorage.getItem("user"));
        navigate(userData?.role === "admin" ? "/admin" : "/teacher");
      } else {
        setError("Email hoặc mật khẩu không chính xác");
        toast.error("Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Hệ thống đang bận. Vui lòng thử lại sau");
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <div className="logo-wrapper">
            <i className="fa-solid fa-face-smile" style={{ fontSize: '32px' }}></i>
          </div>
          <h1 className="login-title">Ứng Dụng Điểm Danh</h1>
          <p className="login-subtitle">Chào mừng bạn quay trở lại</p>
        </header>

        {error && (
          <div className="error-alert">
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <i className="fa-solid fa-at input-icon-left"></i>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="nguyenvan@facecheck.vn"
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
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
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
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập</span>
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
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