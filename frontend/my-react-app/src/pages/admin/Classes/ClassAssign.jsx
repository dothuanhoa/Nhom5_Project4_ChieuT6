import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Classes.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function ClassAssign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const resAll = await fetch(`${API_BASE_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAll = await resAll.json();
        const listAll = Array.isArray(dataAll)
          ? dataAll
          : dataAll.students || dataAll.data || [];
        setAllStudents(listAll);

        const resEnrolled = await fetch(
          `${API_BASE_URL}/classes/${id}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (resEnrolled.ok) {
          const dataEnrolled = await resEnrolled.json();
          const listEnrolled = dataEnrolled.students || dataEnrolled || [];
          const enrolledIds = listEnrolled.map((sv) => sv.id);
          setEnrolledStudentIds(enrolledIds);
        }
      } catch (error) {
        toast.error("Lỗi tải dữ liệu. Vui lòng kiểm tra mạng.");
      }
    };

    fetchData();
  }, [id]);

  const handleAddStudent = async (student) => {
    const token = localStorage.getItem("token");
    setAddingId(student.id);

    const payload = {
      studentId: student.id.toString(),
      classId: id.toString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enrollment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Thêm thất bại");

      toast.success(`Đã thêm ${student.fullName} vào lớp!`);
      setEnrolledStudentIds((prev) => [...prev, student.id]);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm sinh viên này.");
    } finally {
      setAddingId(null);
    }
  };

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
              <i className="fa-solid fa-magnifying-glass"></i>
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
                      {sv.faceId ? (
                        <span className="stat-badge success">
                          <i className="fa-solid fa-check"></i> Đã có
                        </span>
                      ) : (
                        <span className="stat-badge neutral">Chưa có</span>
                      )}
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
                          disabled={addingId === sv.id}
                        >
                          {addingId === sv.id ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fa-solid fa-plus"></i> Thêm
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <p style={{ textAlign: "center" }}>
                      Không tìm thấy sinh viên nào phù hợp.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
