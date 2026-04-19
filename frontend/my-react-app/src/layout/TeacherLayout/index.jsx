import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./TeacherLayout.css";

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Danh sách các mục menu cho giảng viên
  const menuItems = [
    {
      path: "/teacher",
      icon: "fa-solid fa-tower-broadcast",
      label: "Điểm danh trực tiếp",
    },
    {
      path: "/teacher/attendanceHistory",
      icon: "fa-solid fa-clock-rotate-left",
      label: "Danh sách điểm danh",
    },
  ];

  // --- GỬI API: Đăng xuất khỏi hệ thống ---
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // --- END GỬI API ---

  return (
    <div className="teacher-layout-container">
      {/* Lớp phủ cho thiết bị di động */}
      {sidebarOpen && (
        <div
          className="teacher-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- CỘT MENU BÊN TRÁI (SIDEBAR) --- */}
      <aside className={`teacher-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="teacher-sidebar-header">
          <div className="teacher-logo-box">
            <i className="fa-solid fa-face-smile"></i>
          </div>
          <div>
            <h2 className="teacher-brand-name">FaceCheck</h2>
            <p className="teacher-brand-sub">Hệ thống điểm danh</p>
          </div>
        </div>

        <nav className="teacher-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`teacher-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <div className="teacher-active-indicator" />
              )}
            </Link>
          ))}
        </nav>

        <div className="teacher-sidebar-footer">
          <button onClick={handleLogout} className="teacher-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- KHU VỰC NỘI DUNG CHÍNH --- */}
      <div className="teacher-main-wrapper">
        <header className="teacher-header">
          <div className="teacher-header-left">
            <button
              className="teacher-menu-mobile-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="teacher-search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Tìm kiếm dữ liệu..." />
            </div>
          </div>

          <div className="teacher-header-right">
            <div className="teacher-user-block">
              <div className="teacher-user-info">
                <span className="teacher-user-name">
                  {user?.name || "Giảng viên"}
                </span>
                <span className="teacher-user-role">Giảng viên</span>
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

        {/* Nơi chứa nội dung của từng trang con */}
        <main className="teacher-content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
