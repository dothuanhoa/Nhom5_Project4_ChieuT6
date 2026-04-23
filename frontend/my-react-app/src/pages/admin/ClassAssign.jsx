import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../assets/styles/AdminStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassAssign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);

  //Call API lấy all sinh viên và sinh viên trong lớp
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/students`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((dataAll) => setAllStudents(dataAll))
      .catch(() => toast.error("Không thể tải danh sách sinh viên tổng."));

    //Lấy sinh viên ĐÃ CÓ TRONG LỚP
    fetch(`${API_BASE_URL}/classes/${id}/students`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((dataEnrolled) => {
        const listEnrolled = dataEnrolled;
        const enrolledIds = listEnrolled.map((sv) => sv.id);
        setEnrolledStudentIds(enrolledIds);
      })
      .catch(() =>
        toast.error("Không thể tải danh sách sinh viên hiện tại của lớp."),
      );
  }, [id]);
  //End Call API lấy all sinh viên và sinh viên trong lớp

  //Call API thêm sinh viên vào lớp
  const handleAddStudent = (student) => {
    const token = localStorage.getItem("token");

    const payload = {
      studentId: student.id,
      classId: id,
    };
    fetch(`${API_BASE_URL}/enrollment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        toast.success(`Đã thêm ${student.fullName} vào lớp!`);
        setEnrolledStudentIds((prev) => [...prev, student.id]);
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra khi thêm sinh viên này.");
      });
  };
  //End Call API thêm sinh viên vào lớp

  const filteredStudents = allStudents.filter((sv) => {
    const search = searchTerm.toLowerCase();
    return (
      sv.studentCode?.toLowerCase().includes(search) ||
      sv.fullName?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="classes-page">
      <div className="header-with-back">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h2 className="dashboard-title">Thêm sinh viên vào lớp</h2>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="search-filter-section">
          <div className="search-grid">
            <div className="search-input-box">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Họ và tên</th>
                <th>Trạng thái FaceID</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((sv) => {
                const isAlreadyInClass = enrolledStudentIds.includes(sv.id);

                return (
                  <tr key={sv.id}>
                    <td>
                      <span className="id-badge">{sv.studentCode}</span>
                    </td>
                    <td>
                      <span className="bold-text">{sv.fullName}</span>
                    </td>
                    <td>
                      {sv.faceId ? <span>Đã có</span> : <span>Chưa có</span>}
                    </td>
                    <td>
                      {isAlreadyInClass ? (
                        <span className="stat-badge success">
                          Đã có trong lớp
                        </span>
                      ) : (
                        <button
                          className="btn-add-student-action"
                          onClick={() => handleAddStudent(sv)}
                        >
                          <i className="fa-solid fa-plus"></i> Thêm
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
