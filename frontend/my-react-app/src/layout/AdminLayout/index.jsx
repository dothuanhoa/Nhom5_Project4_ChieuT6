import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      path: "/admin/students",
      icon: "fa-solid fa-users",
      label: "Danh Sách Sinh Viên",
    },
    {
      path: "/admin/classes",
      icon: "fa-solid fa-graduation-cap",
      label: "Danh Sách Lớp Học",
    },
    {
      path: "/admin/register-face",
      icon: "fa-solid fa-user-plus",
      label: "Đăng Ký Khuôn Mặt",
    },
    {
      path: "/admin/attendance",
      icon: "fa-solid fa-clock-rotate-left",
      label: "Lịch sử Điểm Danh",
    },
  ];

  // --- API CALL: Xử lý Đăng xuất ---
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // --- END API CALL ---

  return (
    <div className="admin-layout-container">
      {/* Lớp phủ màn hình khi mở menu trên mobile */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- SIDEBAR BÊN TRÁI --- */}
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-logo-section">
          <div className="logo-box">
            <i className="fa-solid fa-face-smile"></i>
          </div>
          <div className="logo-text">
            <h2 className="brand-name">FaceCheck</h2>
            <p className="brand-sub">Hệ thống điểm danh</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={`${item.icon} nav-icon`}></i>
              <span className="nav-label">{item.label}</span>
              {location.pathname === item.path && (
                <div className="active-indicator" />
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- PHẦN NỘI DUNG BÊN PHẢI --- */}
      <div className="admin-main-wrapper">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="header-search">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" placeholder="Tìm kiếm dữ liệu..." />
            </div>
          </div>

          <div className="header-right">
            <div className="notification-bell">
              <i className="fa-solid fa-bell"></i>
              <span className="dot"></span>
            </div>

            <div className="vertical-divider"></div>

            <div className="user-profile-block">
              <div className="user-info">
                <span className="user-name">
                  {user?.name || "Quản trị viên"}
                </span>
                <span className="user-role">Quản trị viên</span>
              </div>
              <div className="user-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=083c96&color=fff&bold=true`}
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        {/* --- NỘI DUNG TRANG (Thay đổi tùy theo Route) --- */}
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
