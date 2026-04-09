import React from "react";
import { Download, ChevronDown, RefreshCw, Search } from "lucide-react";
import useAttendance from "../../hooks/useAttendance";
import { toast } from "sonner";

export default function AttendanceHistory() {
  const {
    records,
    currentRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    selectedTeacher,
    setSelectedTeacher,
    selectedDate,
    setSelectedDate,
    refresh,
  } = useAttendance();

  // Sửa lỗi Key và lọc giá trị null
  const uniqueClasses = [...new Set((records || []).map((r) => r.classId).filter(Boolean))];
  const uniqueTeachers = [...new Set((records || []).map((r) => r.teacher).filter(Boolean))];

  const getStatusBadge = (status) => {
    const config = {
      present: { label: "Có mặt", class: "bg-green-50 text-green-600 border-green-100" },
      late: { label: "Muộn", class: "bg-orange-50 text-orange-500 border-orange-100" },
      absent: { label: "Vắng mặt", class: "bg-red-50 text-red-500 border-red-100" },
    };
    const item = config[status] || config.absent;
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.class}`}>
        {item.label}
      </span>
    );
  };

  return (
    <div className="font-sans space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[28px] font-bold text-[#083c96]">Lịch sử điểm danh</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#083c96] text-white font-bold rounded-xl shadow-md">
          <Download size={18} /> Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {["Giảng viên", "Lớp học", "Ngày"].map((label, idx) => (
            <div key={idx}>
              <label className="text-[11px] font-bold text-gray-400 uppercase mb-2 block">{label}</label>
              {label === "Ngày" ? (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                />
              ) : (
                <div className="relative">
                  <select
                    value={label === "Giảng viên" ? selectedTeacher : selectedClass}
                    onChange={(e) => label === "Giảng viên" ? setSelectedTeacher(e.target.value) : setSelectedClass(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-2xl border-none text-sm font-bold appearance-none"
                  >
                    <option value="all">Tất cả {label.toLowerCase()}</option>
                    {(label === "Giảng viên" ? uniqueTeachers : uniqueClasses).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => { refresh(); toast.success("Đã làm mới dữ liệu"); }}
            className="bg-[#f0f4ff] text-[#083c96] p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#083c96] hover:text-white transition-all"
          >
            <RefreshCw size={18} /> Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Chi tiết điểm danh</h3>
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Sinh viên</th>
                <th className="px-6 py-5">Mã SV / Lớp</th>
                <th className="px-6 py-5">Giảng viên</th>
                <th className="px-6 py-5">Thời gian</th>
                <th className="px-6 py-5 text-center">Độ chính xác</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-900 uppercase text-sm">
                    {record.studentName}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">
                    {record.studentId}
                    <br />
                    <span className="text-[11px] text-gray-400">{record.classId}</span>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500 uppercase italic">
                    {/* Hiển thị 'ThS. Lê Hoàng Long' nếu dữ liệu trống */}
                    {record.teacher || "ThS. Lê Hoàng Long"}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">
                    {record.time}
                    <br />
                    <span className="text-[11px] text-gray-400">{record.date}</span>
                  </td>
                  <td className="px-6 py-5 text-center font-mono font-black text-[#083c96]">
                    {/* SỬA TỪ accuracy THÀNH similarity ĐỂ KHỚP MOCK DATABASE */}
                    {record.similarity ?? 0}%
                  </td>
                  <td className="px-8 py-5 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
          <span className="text-[11px] font-black text-gray-400 uppercase">
            Trang {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-white border rounded-xl text-xs font-bold disabled:opacity-30"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-[#083c96] text-white rounded-xl text-xs font-bold disabled:opacity-30"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}