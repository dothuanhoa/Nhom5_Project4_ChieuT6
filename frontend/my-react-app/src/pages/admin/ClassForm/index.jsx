import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { classService } from "../../../services/api_Admin";
import "./ClassForm.css";

export default function ClassForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    group: "",
    maxStudents: 50,
    status: "active",
  });

  useEffect(() => {
    if (id) {
      const loadClass = async () => {
        try {
          const data = await classService.getClasses();
          const cls = data.find((c) => c.id === id);
          if (cls) setFormData(cls);
        } catch {
          toast.error("Lỗi tải dữ liệu");
        }
      };
      loadClass();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (id) {
        await classService.updateClass(id, formData);
        toast.success("Đã cập nhật lớp học");
      } else {
        await classService.addClass(formData);
        toast.success("Đã tạo lớp học mới");
      }
      navigate("/admin/classes");
    } catch {
      toast.error("Thao tác thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-container">
      <div className="header-with-back">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">
          {id ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
        </h2>
      </div>

      <div className="edit-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Mã môn học</label>
              <input
                className="input-field"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nhóm / Tổ</label>
              <input
                className="input-field"
                value={formData.group}
                onChange={(e) =>
                  setFormData({ ...formData, group: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tên môn học</label>
            <input
              className="input-field"
              value={formData.courseName}
              onChange={(e) =>
                setFormData({ ...formData, courseName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sĩ số tối đa</label>
              <input
                type="number"
                className="input-field"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({ ...formData, maxStudents: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>

          <div className="edit-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}