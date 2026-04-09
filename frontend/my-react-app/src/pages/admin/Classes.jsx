import React from "react";
import { PlusCircle, Search, Pencil, Trash2, Eye, UserPlus, ChevronDown } from "lucide-react";
import useClasses from "../../hooks/useClasses";
import ClassModal from "../../components/ClassModal";
import AssignStudentModal from "../../components/AssignStudentModal";

export default function Classes() {
  const {
    isLoading, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
    showModal, setShowModal, showAssignModal, setShowAssignModal,
    editingClass, selectedClass, formData, setFormData,
    filteredClasses, handleAdd, handleEdit, handleDelete, handleSubmit, 
    handleAssignStudents, handleAssignSubmit
  } = useClasses();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-[#083c96] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="font-sans space-y-6">
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-[#083c96] mb-1 tracking-tight">Quản lý Lớp học</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">Bộ lọc:</span>
          <div className="relative">
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#083c96]/20 font-bold text-[#083c96] text-sm shadow-sm"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="active">Trạng thái: Hoạt động</option>
              <option value="inactive">Trạng thái: Ngưng hoạt động</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#083c96] pointer-events-none" />
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-gray-600">Học kỳ: HK1 2023-2024</span>
          </div>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#083c96] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors shadow-md">
          <PlusCircle size={18} strokeWidth={2.5} /> Tạo lớp học mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest ">Mã môn học</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tên môn học</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nhóm/Tổ</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Số lượng SV</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-500 uppercase tracking-widest ">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5"><span className="font-bold text-[#083c96]">{cls.courseId}</span></td>
                  <td className="px-6 py-5"><span className="text-[15px] font-bold text-gray-900">{cls.courseName}</span></td>
                  <td className="px-6 py-5"><span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{cls.group}</span></td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-900">{cls.studentCount}</span>
                    <span className="text-sm font-medium text-gray-400"> / {cls.maxStudents}</span>
                  </td>
                  <td className="px-6 py-5">
                    {cls.status === "active" ? (
                      <div className="flex items-center gap-2 text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div><span className="text-xs font-bold">Hoạt động</span></div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div><span className="text-xs font-bold">Ngưng hoạt động</span></div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button onClick={() => handleAssignStudents(cls)} className="hover:text-[#083c96] transition-colors" title="Thêm sinh viên"><UserPlus size={18} strokeWidth={2} /></button>
                      <button onClick={() => handleEdit(cls)} className="hover:text-[#083c96] transition-colors" title="Sửa"><Pencil size={18} strokeWidth={2} /></button>
                      <button onClick={() => handleDelete(cls.id)} className="hover:text-red-500 transition-colors" title="Xóa"><Trash2 size={18} strokeWidth={2} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500 font-medium">Không tìm thấy lớp học nào</p></div>
        )}
      </div>

      {/* Gọi Modals */}
      <ClassModal
        showModal={showModal} setShowModal={setShowModal}
        editingClass={editingClass} formData={formData}
        setFormData={setFormData} handleSubmit={handleSubmit}
      />

      <AssignStudentModal
        showAssignModal={showAssignModal} setShowAssignModal={setShowAssignModal}
        selectedClass={selectedClass} onAssignSubmit={handleAssignSubmit}
      />
    </div>
  );
}