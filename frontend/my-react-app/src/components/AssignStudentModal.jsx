import React, { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { studentService } from "../services/api";

export default function AssignStudentModal({
  showAssignModal, setShowAssignModal, selectedClass, onAssignSubmit
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (showAssignModal) {
      const loadStudents = async () => {
        setLoading(true);
        const data = await studentService.getStudents();
        setStudents(data.students || data);
        setLoading(false);
      };
      loadStudents();
      setSelectedIds([]); // Reset lựa chọn mỗi khi mở modal
      setSearch("");
    }
  }, [showAssignModal]);

  if (!showAssignModal || !selectedClass) return null;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    onAssignSubmit(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Thêm sinh viên vào lớp</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {selectedClass.courseId} - {selectedClass.courseName} (Nhóm {selectedClass.group})
            </p>
          </div>
          <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã SV, họ tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#f4f4f5] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#083c96]/20 transition-all font-medium"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px] pr-2">
          {loading ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-[#083c96]" /></div>
          ) : (
            filteredStudents.map((student) => (
              <label key={student.id} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-5 h-5 text-[#083c96] border-gray-300 rounded focus:ring-[#083c96]" 
                  />
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{student.name}</p>
                    <p className="text-xs font-semibold text-gray-400">{student.id}</p>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
          <button onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="flex-1 px-4 py-3.5 bg-[#083c96] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            Xác nhận thêm ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}