import React from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  CheckCircle2,
  MoreHorizontal,
  ChevronDown,
  ListFilter,
} from "lucide-react";

// Nhúng Hook Logic và Component Modal vào đây
import useStudents from "../../hooks/useStudents";
import StudentModal from "../../components/StudentModal";

export default function Students() {
  // Lấy tất cả "hàng hóa" từ Hook ra dùng
  const {
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showModal,
    setShowModal,
    editingStudent,
    isSubmitting,
    formData,
    setFormData,
    filteredStudents,
    students,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = useStudents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#083c96] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="font-sans space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-[28px] font-bold text-[#083c96] tracking-tight">
          Danh sách sinh viên
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
            <button className="px-4 py-1.5 text-sm font-bold bg-white text-gray-800 rounded-md shadow-sm">
              Tất cả
            </button>
            <button className="px-4 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700">
              Chưa ĐK
            </button>
          </div>
          
        </div>
      </div>

      {/* ── BODY (TÌM KIẾM & BẢNG) ── */}
      <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 overflow-hidden">
        {/* TÌM KIẾM */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo mã SV, họ tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#083c96]/20 transition-all text-[15px]"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none font-semibold text-gray-700 text-sm w-48"
                >
                  <option value="all">Trạng thái: Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl font-semibold text-gray-700 text-sm w-36">
                  <option value="2024">Khóa: 2024</option>
                  <option value="2023">Khóa: 2023</option>
                </select>
                <ListFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest ">
                  Mã SV
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Họ và tên
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Face ID
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 bg-blue-50 text-[#083c96] text-xs font-bold rounded-md">
                      {student.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          {student.class}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.faceId ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Đã đăng ký
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-orange-500">
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Chưa đăng ký
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                        student.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {student.status === "active"
                        ? "Hoạt động"
                        : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => handleEdit(student)}
                        className="hover:text-[#083c96] transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">
              Không tìm thấy sinh viên nào
            </p>
          </div>
        )}

        {/* PHÂN TRANG */}
        <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-gray-900">
              {filteredStudents.length > 0 ? 1 : 0} - {filteredStudents.length}
            </span>{" "}
            của{" "}
            <span className="font-bold text-gray-900">{students.length}</span>{" "}
            sinh viên
          </div>
          <div className="flex items-center gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-400 disabled:opacity-50"
              disabled
            >
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#083c96] text-white font-bold text-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* ── HIỂN THỊ MODAL BẰNG COMPONENT ── */}
      <StudentModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingStudent={editingStudent}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
