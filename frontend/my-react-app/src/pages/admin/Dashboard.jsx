import React from "react";
import { User, DoorOpen, CheckCheck, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Nhúng Custom Hook vào đây
import useDashboard from "../../hooks/useDashboard";

const STAT_CONFIG = [
  {
    key: "totalStudents",
    label: "TỔNG SINH VIÊN",
    icon: User,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "+12%",
    badgeColor: "bg-green-100 text-green-600",
  },
  {
    key: "totalClasses",
    label: "TỔNG LỚP HỌC",
    icon: DoorOpen,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    badge: "Ổn định",
    badgeColor: "bg-gray-100 text-gray-500",
  },
  {
    key: "attendanceToday",
    label: "LƯỢT ĐIỂM DANH HÔM NAY",
    icon: CheckCheck,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "+850",
    badgeColor: "bg-green-100 text-green-600",
  },
  {
    key: "absentToday",
    label: "VẮNG MẶT",
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    badge: "Hôm nay",
    badgeColor: "bg-red-100 text-red-600",
  },
];

export default function AdminDashboard() {
  // Lấy dữ liệu từ Hook
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#083c96] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <h2 className="text-[28px] font-bold text-[#083c96] tracking-tight">
          Tổng quan hệ thống
        </h2>
      </div>

      {/* ── THẺ THỐNG KÊ (Stats Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {STAT_CONFIG.map((stat) => (
          <div
            key={stat.key}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50"
          >
            <div className="flex items-start justify-between mb-8">
              <div
                className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 ${stat.iconColor}`}
                  strokeWidth={2.5}
                />
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${stat.badgeColor}`}
              >
                {stat.badge}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-[32px] font-black text-gray-900 leading-none tracking-tight">
              {dashboardData.stats[stat.key]}
            </p>
          </div>
        ))}
      </div>

      {/* ── BIỂU ĐỒ (Chart) ── */}
      <div className="w-full bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">
            Thống kê điểm danh trong tuần
          </h3>
          <div className="flex bg-gray-50 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-bold bg-white text-gray-800 rounded-md shadow-sm">
              Tuần này
            </button>
            <button className="px-4 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700">
              Tuần trước
            </button>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dashboardData.weeklyAttendance}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontWeight: 600,
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
