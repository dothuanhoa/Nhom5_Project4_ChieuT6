import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="dashboard-layout admin-theme">
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
                to="/admin"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-border-all icon"></i>
                Tổng Quan
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/students"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-user-plus icon"></i>
                Đăng ký Sinh viên
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/classes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-graduation-cap icon"></i>
                Quản Lý Môn Học
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/register-face"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-clipboard-user icon"></i>
                Nhật ký Điểm danh
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
            <input type="text" placeholder="Tìm kiếm dữ liệu..." />
          </div>

          <div className="user-profile">
            <i className="fa-regular fa-bell notification-icon"></i>
            <div className="avatar-info">
              <div className="text">
                <strong>Admin</strong>
              </div>
              <div className="avatar-img">
                <i className="fa-solid fa-user-tie"></i>
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

export default AdminLayout;
