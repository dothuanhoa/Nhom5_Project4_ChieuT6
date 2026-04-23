import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

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
    fetch(`${API_BASE_URL}/students/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          studentCode: data.studentCode,
          fullName: data.fullName,
          faceId: data.faceId,
        });
      })
      .catch(() => toast.error("Không thể tải thông tin sinh viên"));
  }, [id, navigate]);
  // End Call API lấy sinh viên

  // Cập nhật sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();
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
        toast.success("Cập nhật thành công!");
        navigate("/admin/students");
      })
      .catch(() => toast.error("Cập nhật thất bại, vui lòng thử lại!"));
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

            <button type="submit" className="btn-save"></button>
          </div>
        </form>
      </div>
    </div>
  );
}
