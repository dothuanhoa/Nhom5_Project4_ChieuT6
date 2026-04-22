import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import "./TeacherLayout.css";

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Danh mục
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
  //End  Danh mục

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="teacher-layout-container">
      {sidebarOpen && (
        <div
          className="teacher-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
                  {user?.fullName || "Giảng viên"}
                </span>
                <span className="teacher-user-role">Giảng viên</span>
              </div>
              <div className="teacher-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || "Teacher"}&background=083c96&color=fff&bold=true`}
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
