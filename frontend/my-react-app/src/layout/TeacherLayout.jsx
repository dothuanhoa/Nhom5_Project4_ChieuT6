import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  Radar,
  Clock,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Smile,
  Search,
  Bell,
  Settings,
} from "lucide-react";

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
    { path: "/teacher", icon: Radar, label: "Điểm danh trực tiếp" },
    { path: "/teacher/attendanceHistory", icon: Clock, label: "Danh sách điểm danh" }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">
        
          <div className="px-6 mb-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#083c96] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Smile className="text-white w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-[#083c96] font-bold text-[15px] truncate">
                  FaceCheck
                </h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 truncate">
                  Giảng viên
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#f4f7fe] text-[#083c96] font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                  }`}
                >
                  <item.icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[15px]">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#083c96] rounded-l-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mb-4 space-y-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[15px]">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-[#f4f4f5] rounded-full px-4 py-2.5 w-96 transition-all focus-within:ring-2 focus-within:ring-[#083c96]/20 focus-within:bg-white border border-transparent focus-within:border-[#083c96]/30">
              <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm dữ liệu..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-[#083c96] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-[13px] font-bold text-gray-800 group-hover:text-[#083c96] transition-colors">
                  {user?.name || "Giảng viên"}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {user?.role === "teacher" ? "Giảng viên" : "Người dùng"}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || "Teacher"}&background=083c96&color=fff&bold=true`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
