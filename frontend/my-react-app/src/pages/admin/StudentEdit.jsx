import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { studentService } from "../../services/api_Admin";
import "../../assets/styles/admin.style.css";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    major: "",
    status: "active",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudents();
        const student = data.find((s) => s.id === id);
        if (student) {
          setFormData({
            studentId: student.id,
            name: student.name,
            major: student.class || "",
            status: student.status,
          });
        }
      } catch (err) {
        toast.error("Không thể tải thông tin sinh viên");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await studentService.updateStudent(id, formData);
      toast.success("Cập nhật thông tin thành công");
      navigate("/admin/students");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="edit-container">
      <div className="page-header">
        <div className="header-with-back">
          <button
            className="btn-back"
            onClick={() => navigate("/admin/students")}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="dashboard-title">Chỉnh sửa hồ sơ sinh viên</h2>
        </div>
      </div>

      <div className="edit-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-two">
            <div className="form-group">
              <label className="form-label">Mã sinh viên (Không thể sửa)</label>
              <input
                className="input-field disabled"
                value={formData.studentId}
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lớp / Chuyên ngành</label>
            <input
              className="input-field"
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group" style={{ maxWidth: "300px" }}>
            <label className="form-label">Trạng thái sinh viên</label>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Đang học (Hoạt động)</option>
              <option value="inactive">Đã nghỉ (Ngưng hoạt động)</option>
            </select>
          </div>

          <div className="edit-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/students")}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
