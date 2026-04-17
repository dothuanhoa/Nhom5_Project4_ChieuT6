import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import useDashboard from "../../hooks/useDashboard";

// Import file style (Đã đảm bảo đường dẫn đúng)
import "../../assets/styles/admin.style.css";

const STAT_CONFIG = [
  {
    key: "totalStudents",
    label: "TỔNG SINH VIÊN",
    icon: "fa-solid fa-user", // Font Awesome
    colorClass: "blue",
    badge: "+12%",
    badgeClass: "success",
  },
  {
    key: "totalClasses",
    label: "TỔNG LỚP HỌC",
    icon: "fa-solid fa-door-open", // Font Awesome
    colorClass: "indigo",
    badge: "Ổn định",
    badgeClass: "neutral",
  },
  {
    key: "attendanceToday",
    label: "ĐIỂM DANH HÔM NAY",
    icon: "fa-solid fa-check-double", // Font Awesome
    colorClass: "orange",
    badge: "+850",
    badgeClass: "success",
  },
  {
    key: "absentToday",
    label: "VẮNG MẶT",
    icon: "fa-solid fa-triangle-exclamation", // Font Awesome
    colorClass: "red",
    badge: "Hôm nay",
    badgeClass: "danger",
  },
];

export default function AdminDashboard() {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Đang tải dữ liệu...</p>
      </div>
    );

  if (error)
    return (
      <div className="loader-container">
        <i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--error)', fontSize: '32px' }}></i>
        <p style={{ color: 'var(--error)', fontWeight: 'bold', marginTop: '10px' }}>{error}</p>
      </div>
    );

  return (
    <div className="dashboard-content">
      <header>
        <h2 className="dashboard-title">Tổng quan hệ thống</h2>
      </header>

      {/* THẺ THỐNG KÊ */}
      <div className="stats-grid">
        {STAT_CONFIG.map((stat) => (
          <div key={stat.key} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-icon-box ${stat.colorClass}`}>
                {/* Sử dụng thẻ i cho Font Awesome */}
                <i className={stat.icon} style={{ fontSize: '20px' }}></i>
              </div>
              <span className={`stat-badge ${stat.badgeClass}`}>
                {stat.badge}
              </span>
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">
              {dashboardData.stats[stat.key]?.toLocaleString() || 0}
            </p>
          </div>
        ))}
      </div>

      {/* BIỂU ĐỒ */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Thống kê điểm danh trong tuần</h3>
          <div className="chart-toggle-group">
            <button className="toggle-btn active">Tuần này</button>
            <button className="toggle-btn">Tuần trước</button>
          </div>
        </div>
        
        <div className="chart-viz-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dashboardData.weeklyAttendance}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontWeight: 600,
                  fontFamily: 'Inter'
                }}
              />
              <Bar
                dataKey="count"
                fill="#083c96"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}