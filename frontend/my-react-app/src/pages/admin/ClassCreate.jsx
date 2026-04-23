import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    groupNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        toast.success("Tạo lớp học mới thành công!");
        navigate("/admin/classes");
      })
      .catch((error) => toast.error("Đã xảy ra lỗi khi tạo lớp học."));
  };

  return (
    <div className="edit-container">
      <div className="header-with-back">
        <button className="btn-back" onClick={() => navigate("/admin/classes")}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">Tạo lớp học mới</h2>
      </div>

      <div className="single-column-layout">
        <div className="edit-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Mã môn học</label>
              <input
                className="input-field"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData({ ...formData, courseCode: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Tên môn học</label>
              <input
                className="input-field"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData({ ...formData, courseName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Nhóm</label>
              <input
                className="input-field"
                value={formData.groupNumber}
                onChange={(e) =>
                  setFormData({ ...formData, groupNumber: e.target.value })
                }
                required
              />
            </div>

            <div
              className="edit-actions"
              style={{ marginTop: "20px", display: "flex", gap: "10px" }}
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin/classes")}
              >
                Hủy bỏ
              </button>

              <button type="submit" className="btn-save">
                Xác nhận tạo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
