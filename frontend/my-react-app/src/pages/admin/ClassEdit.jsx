import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    groupNumber: "",
  });
  const [students, setStudents] = useState([]);

  //Call API lớp và sinh viên theo hoc
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          courseCode: data.courseCode || "",
          courseName: data.courseName || "",
          groupNumber: data.groupNumber || "",
        });
      })
      .catch(() => toast.error("Không thể tải thông tin môn học"));

    //Lấy danh sách Sinh viên theo lớp
    fetch(`${API_BASE_URL}/classes/${id}/students`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((dataStudents) => setStudents(dataStudents))
      .catch(() =>
        toast.error("Không thể tải danh sách sinh viên đang theo học"),
      );
  }, [id]);
  //End Call API lớp và sinh viên theo hoc

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        toast.success("Cập nhật lớp học thành công!");
        navigate("/admin/classes");
      })
      .catch(() => toast.error("Cập nhật thất bại, vui lòng thử lại!"));
  };

  return (
    <div className="edit-container">
      <div className="header-with-back">
        <button className="btn-back" onClick={() => navigate("/admin/classes")}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">Chỉnh sửa lớp học</h2>
      </div>

      <div className="two-columns-layout">
        <div className="edit-card left-col">
          <div
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px" }}>Thông tin môn học</h3>
          </div>

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
              <label style={{ fontWeight: "bold" }}>Nhóm / Tổ</label>
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
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin/classes")}
              >
                Hủy bỏ
              </button>

              <button type="submit" className="btn-save">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>

        <div className="edit-card right-col">
          <div
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px" }}>
              Sinh viên đang theo học ({students.length})
            </h3>
          </div>

          <div
            className="student-list-container"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {students.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ padding: "10px" }}>STT</th>
                    <th style={{ padding: "10px" }}>Mã SV</th>
                    <th style={{ padding: "10px" }}>Họ và tên</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((sv, index) => (
                    <tr key={sv.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>{index + 1}</td>
                      <td style={{ padding: "10px" }}>{sv.studentCode}</td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {sv.fullName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#888",
                }}
              >
                <p>Lớp học này chưa có sinh viên nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
