import React, { useState, useEffect } from "react";
import { studentService, classService } from "../services/api_Admin";
import { toast } from "sonner";
import "../assets/styles/admin.style.css"; // Hãy kiểm tra lại đường dẫn này

export default function AssignStudentModal({
  showAssignModal,
  setShowAssignModal,
  selectedClass,
  onSuccess,
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (showAssignModal) {
      const loadStudents = async () => {
        setLoading(true);
        try {
          const data = await studentService.getStudents();
          setStudents(data.students || data);
        } catch {
          toast.error("Không thể tải danh sách sinh viên");
        } finally {
          setLoading(false);
        }
      };
      loadStudents();
      setSelectedIds([]);
      setSearch("");
    }
  }, [showAssignModal]);

  if (!showAssignModal || !selectedClass) return null;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = async () => {
    try {
      await classService.assignStudents(selectedClass.id, selectedIds);
      toast.success("Đã thêm sinh viên vào lớp");
      onSuccess(); // Tải lại danh sách ở trang Classes
      setShowAssignModal(false); // Đóng modal
    } catch {
      toast.error("Có lỗi xảy ra khi thêm");
    }
  };

  return (
    /* Click vào nền mờ sẽ đóng modal */
    <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
      {/* Click vào bên trong container thì KHÔNG đóng modal */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Thêm sinh viên vào lớp</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              {selectedClass.courseName} - Nhóm {selectedClass.group}
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setShowAssignModal(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ padding: "20px 32px 10px" }}>
          <div className="search-input-box" style={{ width: "100%" }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              placeholder="Tìm mã SV, tên sinh viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{ maxHeight: "350px", overflowY: "auto", padding: "0 32px" }}
        >
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
          ) : (
            filtered.map((s) => (
              <label
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "12px 0",
                  borderBottom: "1px solid #f8fafc",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "var(--admin-blue)",
                  }}
                  checked={selectedIds.includes(s.id)}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(s.id)
                        ? prev.filter((id) => id !== s.id)
                        : [...prev, s.id],
                    )
                  }
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1e293b",
                    }}
                  >
                    {s.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {s.id}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={() => setShowAssignModal(false)}
          >
            Hủy
          </button>
          <button
            className="btn-save"
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
          >
            Xác nhận thêm ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
