import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import CSS thuần cho Teacher
import "../assets/styles/teacher.style.css";

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/teacher", icon: "fa-solid fa-tower-broadcast", label: "Điểm danh trực tiếp" },
    { path: "/teacher/attendanceHistory", icon: "fa-solid fa-clock-rotate-left", label: "Danh sách điểm danh" }
  ];

  return (
    <div className="teacher-layout-container">
      {/* Lớp phủ mobile */}
      {sidebarOpen && <div className="teacher-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`teacher-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="teacher-sidebar-header">
          <div className="teacher-logo-box">
            <i className="fa-solid fa-face-smile" style={{ fontSize: '24px' }}></i>
          </div>
          <div>
            <h2 className="teacher-brand-name">FaceCheck</h2>
            <p className="teacher-brand-sub">Giảng viên</p>
          </div>
        </div>

        <nav className="teacher-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`teacher-nav-item ${isActive ? "active" : ""}`}
              >
                <i className={`${item.icon}`} style={{ width: '20px', textAlign: 'center' }}></i>
                <span>{item.label}</span>
                {isActive && <div className="teacher-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="teacher-sidebar-footer">
          <button onClick={handleLogout} className="teacher-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="teacher-main-wrapper">
        <header className="teacher-header">
          <div className="teacher-header-left">
            <button className="teacher-menu-mobile-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="teacher-search-bar">
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
              <input type="text" placeholder="Tìm kiếm dữ liệu..." />
            </div>
          </div>

          <div className="teacher-header-right">
            <div className="teacher-notification">
              <i className="fa-solid fa-bell"></i>
              <span className="teacher-notif-dot"></span>
            </div>

            <div className="teacher-divider"></div>

            <div className="teacher-user-block">
              <div className="teacher-user-info">
                <span className="teacher-user-name">{user?.name || "Giảng viên"}</span>
                <span className="teacher-user-role">
                  {user?.role === "teacher" ? "Giảng viên" : "Người dùng"}
                </span>
              </div>
              <div className="teacher-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || "Teacher"}&background=083c96&color=fff&bold=true`}
                  alt="Avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="teacher-content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}