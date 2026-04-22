import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./StudentEdit.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentCode: "",
    fullName: "",
    faceId: null,
  });

  // Call API lấy sinh viên
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/students`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const danhSach = data;
        const sinhVien = danhSach.find((sv) => sv.id.toString() === id);
        if (sinhVien) {
          setFormData({
            studentCode: sinhVien.studentCode,
            fullName: sinhVien.fullName,
            faceId: sinhVien.faceId,
          });
        } else {
          toast.error("Không tìm thấy sinh viên!");
          navigate("/admin/students");
        }
      })
      .catch(() => toast.error("Không thể tải thông tin sinh viên"));
    // ❌ đã xóa finally setIsLoading
  }, [id, navigate]);
  // End Call API lấy sinh viên

  // Cập nhật sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) toast.error("Cập nhật thông tin thất bại!");
        toast.success("Cập nhật thông tin thành công!");
        navigate("/admin/students");
      })
      .catch(() => toast.error("Cập nhật thất bại, vui lòng thử lại!"))
      .finally(() => setIsSubmitting(false));
  };
  // end Cập nhật sinh viên

  return (
    <div className="edit-container">
      <div className="header-with-back">
        <button
          className="btn-back"
          onClick={() => navigate("/admin/students")}
          title="Quay lại"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">Chỉnh sửa hồ sơ sinh viên</h2>
      </div>

      <div className="edit-card edit-form-students">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mã sinh viên (Không thể sửa)</label>
            <input
              className="input-field disabled"
              value={formData.studentCode}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Họ và tên</label>
            <input
              className="input-field"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              placeholder="Nhập họ và tên..."
            />
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
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
