import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./TeacherLayout.css";

function TeacherLayout() {
  return (
    <div className="dashboard-layout teacher-theme">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="/path-to-your-logo.png"
            alt="Logo Hệ thống"
            className="logo-image"
          />
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li>
              <NavLink
                to="/teacher/attendance"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-calendar-check icon"></i>
                Điểm Danh
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teacher/history"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-clock-rotate-left icon"></i>
                Lịch Sử
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teacher/verify"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-user-check icon"></i>
                Xác Thực Sinh Viên
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">
            <i className="fa-solid fa-right-from-bracket icon"></i>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" placeholder="Tìm kiếm lớp học, sinh viên..." />
          </div>

          <div className="user-profile">
            <i className="fa-regular fa-bell notification-icon"></i>
            <div className="avatar-info">
              <div className="text">
                <strong>Teacher</strong>
                <span>Giảng viên</span>
              </div>
              <div className="avatar-img">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;