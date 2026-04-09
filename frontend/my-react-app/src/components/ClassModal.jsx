import React from "react";
import { X, Loader2 } from "lucide-react";

export default function ClassModal({
  showModal,
  setShowModal,
  editingClass,
  formData,
  setFormData,
  handleSubmit,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">
            {editingClass ? "Cập nhật lớp học" : "Tạo lớp học mới"}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
              Mã môn học
            </label>
            <input
              type="text"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all font-semibold"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
              Tên môn học
            </label>
            <input
              type="text"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all font-semibold"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                Nhóm / Tổ
              </label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all font-semibold"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                Sĩ số tối đa
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all font-semibold"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all appearance-none font-semibold"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3.5 bg-[#083c96] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors"
            >
              {editingClass ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}