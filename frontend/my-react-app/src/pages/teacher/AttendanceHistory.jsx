import React, { useState } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";

export default function TeacherAttendanceHistory() {
  // Mock Database
  const [records] = useState([
    {
      id: "1",
      studentId: "SV2023001",
      studentName: "Lê Hoàng Nam",
      date: "10/27/2023",
      time: "07:32 AM",
      similarity: 98,
      status: "present",
      isVerified: true,
      avatar: "https://ui-avatars.com/api/?name=Lê+Hoàng+Nam&background=random",
    },
    {
      id: "2",
      studentId: "SV2023042",
      studentName: "Phạm Minh Anh",
      date: "10/27/2023",
      time: "07:55 AM",
      similarity: 82,
      status: "late",
      isVerified: true,
      avatar:
        "https://ui-avatars.com/api/?name=Phạm+Minh+Anh&background=random",
    },
    {
      id: "3",
      studentId: "SV2023115",
      studentName: "Trần Nhật Duy",
      date: "10/27/2023",
      time: "08:10 AM",
      similarity: 64,
      status: "pending",
      isVerified: false,
      avatar:
        "https://ui-avatars.com/api/?name=Trần+Nhật+Duy&background=random",
    },
    {
      id: "4",
      studentId: "SV2023089",
      studentName: "Nguyễn Thu Thủy",
      date: "10/27/2023",
      time: "-- : --",
      similarity: 0,
      status: "absent",
      isVerified: true,
      avatar:
        "https://ui-avatars.com/api/?name=Nguyễn+Thu+Thủy&background=random",
    },
    {
      id: "5",
      studentId: "SV2023021",
      studentName: "Đỗ Thùy Linh",
      date: "10/27/2023",
      time: "07:31 AM",
      similarity: 95,
      status: "present",
      isVerified: true,
      avatar: "https://ui-avatars.com/api/?name=Đỗ+Thùy+Linh&background=random",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2023-10-27");
  const [selectedClass, setSelectedClass] = useState(
    "Công nghệ Phần mềm - K15",
  );

  // Lọc dữ liệu
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // UI Helpers (Đã làm mượt màu sắc và bo góc)
  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex px-3.5 py-1.5 bg-[#e6f7ec] text-[#16a34a] text-[10px] font-black rounded-full uppercase tracking-wider">
            PRESENT
          </span>
        );
      case "late":
        return (
          <span className="inline-flex px-3.5 py-1.5 bg-[#fff3e0] text-[#ea580c] text-[10px] font-black rounded-full uppercase tracking-wider">
            LATE
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex px-3.5 py-1.5 bg-[#ffebee] text-[#dc2626] text-[10px] font-black rounded-full uppercase tracking-wider">
            ABSENT
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex px-3.5 py-1.5 bg-[#ffedd5] text-[#d97706] text-[10px] font-black rounded-full uppercase tracking-wider">
            CHỜ XÁC MINH
          </span>
        );
      default:
        return null;
    }
  };

  const getVerificationBadge = (isVerified, status) => {
    if (status === "absent") {
      return (
        <MinusCircle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
      );
    }
    if (status === "pending") {
      return (
        <button className="inline-flex px-4 py-2 bg-[#eff6ff] hover:bg-blue-100 text-[#2563eb] text-[10px] font-black rounded-xl uppercase tracking-wider transition-colors">
          XÁC MINH
        </button>
      );
    }
    if (isVerified) {
      return (
        <div className="w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      );
    }
    return null;
  };

  const getAccuracyVisuals = (val) => {
    if (val === 0) return { bar: "bg-gray-200", text: "text-gray-300" };
    if (val >= 90) return { bar: "bg-[#22c55e]", text: "text-[#16a34a]" };
    if (val >= 80) return { bar: "bg-[#f59e0b]", text: "text-[#d97706]" };
    return { bar: "bg-[#f97316]", text: "text-[#ea580c]" };
  };

  return (
    <div className="font-sans h-full flex flex-col bg-transparent">
      {/* Top Filter Bar */}
      <div className="flex flex-col xl:flex-row items-end gap-6 mb-8 w-full">
        {/* Chọn Lớp */}
        <div className="w-full xl:w-auto min-w-[280px]">
          <h2 className="text-[28px] font-bold text-[#083c96] mb-5 tracking-tight">
            Lịch sử điểm danh
          </h2>
          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            LỚP HỌC
          </label>
          <div className="relative group">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/20 font-bold text-gray-800 text-[15px] cursor-pointer shadow-sm transition-all"
            >
              <option value="Công nghệ Phần mềm - K15">
                Công nghệ Phần mềm - K15
              </option>
              <option value="Cơ sở dữ liệu - CS101">
                Cơ sở dữ liệu - CS101
              </option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-[#083c96] transition-colors" />
          </div>
        </div>

        {/* Chọn Ngày */}
        <div className="w-full xl:w-auto min-w-[200px]">
          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            NGÀY HỌC
          </label>
          <div className="relative group">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/20 font-bold text-gray-800 text-[15px] cursor-pointer shadow-sm transition-all"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none bg-white pl-1" />
          </div>
        </div>

        {/* Tìm Kiếm */}
        <div className="flex-1 w-full relative">
          <label className="block mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            TÌM KIẾM SINH VIÊN
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên hoặc MSSV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/20 font-medium text-gray-800 text-[15px] shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Table View */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[800px]">
            <thead className="bg-white">
              <tr>
                <th className="px-8 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  HỌ VÀ TÊN
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  MÃ SINH VIÊN
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  GIỜ ĐIỂM DANH
                </th>
                <th className="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest w-40 border-b border-gray-100">
                  ĐỘ CHÍNH XÁC
                </th>
                <th className="px-6 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest w-32 border-b border-gray-100">
                  TRẠNG THÁI
                </th>
                <th className="px-8 py-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest w-28 border-b border-gray-100">
                  XÁC MINH
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-8 py-12 text-center text-gray-400 font-medium"
                  >
                    Không tìm thấy dữ liệu điểm danh phù hợp
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const visuals = getAccuracyVisuals(record.similarity);
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                            {record.similarity === 0 ? (
                              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  ></path>
                                </svg>
                              </div>
                            ) : (
                              <img
                                src={record.avatar}
                                alt={record.studentName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-[15px] font-bold text-gray-900">
                            {record.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-semibold text-gray-600">
                          {record.studentId}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-semibold text-gray-600">
                          {record.time}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            {record.similarity > 0 && (
                              <div
                                className={`h-full rounded-full ${visuals.bar}`}
                                style={{ width: `${record.similarity}%` }}
                              ></div>
                            )}
                          </div>
                          <span
                            className={`text-[13px] font-black w-8 text-left ${visuals.text}`}
                          >
                            {record.similarity > 0 ? `${record.similarity}%` : "0%"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          {getVerificationBadge(record.isVerified, record.status)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Đã sửa lại thành hình tròn) */}
        <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-b-[32px] gap-4">
          <div className="text-[13px] text-gray-500 font-medium">
            Hiển thị 1 - 5 trong tổng số 42 sinh viên
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#083c96] transition-colors"
              disabled
            >
              &lt;
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#083c96] text-white font-black text-[13px] shadow-md">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">
              ...
            </span>
            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-bold text-[13px] transition-colors">
              9
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#083c96] transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}