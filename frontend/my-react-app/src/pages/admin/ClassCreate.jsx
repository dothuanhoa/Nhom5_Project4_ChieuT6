import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassCreate() {
  const navigate = useNavigate();
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = { courseCode, courseName, groupNumber };

    try {
      const response = await fetch(`${API_BASE_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Tạo lớp học thất bại");

      toast.success("Tạo lớp học mới thành công!");
      navigate("/admin/classes");
    } catch (error) {
      toast.error(error.message);
    }
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
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Tên môn học</label>
              <input
                className="input-field"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Nhóm / Tổ</label>
              <input
                className="input-field"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
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
