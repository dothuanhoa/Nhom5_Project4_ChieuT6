import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Classes.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // call API classes
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const listData = data.classes || data || [];
        setClasses(listData);
      })
      .catch((err) => toast.error("Lỗi tải danh sách lớp học"))
      .finally(() => setIsLoading(false));
  }, []);
  // End call API classes

  //Tìm kiếm
  let danhSachDaLoc = classes.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.courseCode?.toLowerCase().includes(search) ||
      item.courseName?.toLowerCase().includes(search)
    );
  });
  //End Tìm kiếm

  //Call API delete
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) return;
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) toast.error("Xóa lớp học thất bại, vui lý thử lại!");
        setClasses((prev) => prev.filter((item) => item.id !== id));
        toast.success("Đã xóa lớp học");
      })
      .catch((err) => toast.error("Xóa thất bại, vui lòng thử lại"));
  };
  //End Call API delete

  const handleAssignStudents = (cls) => {
    setSelectedClass(cls);
    setShowAssignModal(true); // Bật popup lên
  };
  // --- END XỬ LÝ ---

  // --- HIỂN THỊ LOADING ---
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="classes-page">
      <div className="page-header">
        <h2 className="title-page">Quản lý lớp học</h2>
        <button className="btn-primary" onClick={() => navigate("add")}>
          <i className="fa-solid fa-plus"></i> Tạo lớp học mới
        </button>
      </div>

      <div className="table-wrapper">
        <div className="search-filter-section">
          <div className="search-grid" style={{ width: "100%" }}>
            <div className="search-input-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Tìm mã môn, tên môn..."
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
                <th>Mã môn</th>
                <th>Tên môn học</th>
                <th>Nhóm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDaLoc.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="id-badge">{item.courseCode}</span>
                  </td>
                  <td>
                    <span className="bold-text">{item.courseName}</span>
                  </td>
                  <td>
                    <span className="stat-badge neutral">
                      {item.groupNumber}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-icon"
                        title="Thêm SV"
                        onClick={() => handleAssignStudents(item)}
                      >
                        <i className="fa-solid fa-user-plus"></i>
                      </button>
                      <button
                        className="btn-icon"
                        title="Sửa"
                        onClick={() => navigate(`edit/${item.id}`)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Xóa"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {danhSachDaLoc.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#94a3b8",
                    }}
                  >
                    <p>Không tìm thấy lớp học nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Sinh Viên */}
      {/* <AssignStudentModal 
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        selectedClass={selectedClass}
        onSuccess={fetchClasses}
      /> */}
    </div>
  );
}
