import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Classes.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [students, setStudents] = useState([]);

  //Call API lớp và sinh viên theo hoc
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const resClass = await fetch(`${API_BASE_URL}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataClass = await resClass.json();
        const listClasses = dataClass.classes || dataClass || [];
        const currentClass = listClasses.find((c) => c.id.toString() === id);

        if (currentClass) {
          setCourseCode(currentClass.courseCode || "");
          setCourseName(currentClass.courseName || "");
          setGroupNumber(currentClass.groupNumber || "");
        }

        //Lấy danh sách sinh viên theo lớp
        const resStudents = await fetch(
          `${API_BASE_URL}/classes/${id}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (resStudents.ok) {
          const dataStudents = await resStudents.json();
          setStudents(dataStudents);
        }
      } catch (error) {
        toast.error("Lỗi tải dữ liệu");
      }
    };
    fetchData();
  }, [id]);
  //End Call API lớp và sinh viên theo hoc

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { courseCode, courseName, groupNumber };

    try {
      const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Cập nhật thất bại");
      toast.success("Cập nhật lớp học thành công!");
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
