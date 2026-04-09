import { mockAPI } from "../mock/mockDatabase";

// ============================================================================
// FILE NÀY HIỆN TẠI ĐANG SỬ DỤNG 100% DỮ LIỆU GIẢ LẬP (MOCK DATA).
// Khi nào bạn có Backend (API thật), hãy xóa code gọi mock đi và
// bỏ comment (/* */) ở các đoạn code fetch bên dưới để sử dụng.
// ============================================================================

export const studentService = {
  // 1. Lấy danh sách
  getStudents: async (classId = null) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getStudents();

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api'; // Đổi thành link backend thực tế
    const token = localStorage.getItem('token');
    const url = classId ? `${API_BASE_URL}/students?classId=${classId}` : `${API_BASE_URL}/students`;
    
    const res = await fetch(url, { 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) throw new Error('Lỗi tải danh sách sinh viên');
    return await res.json(); 
    ------------------------------------------------------- */
  },

  // 2. Thêm mới
  addStudent: async (studentData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.addStudent(studentData);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) throw new Error('Thêm sinh viên thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },

  // 3. Cập nhật
  updateStudent: async (studentId, studentData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    // (Vì mock chưa có hàm update, ta giả lập thành công sau 0.5 giây)
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500),
    );

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) throw new Error('Cập nhật thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },

  // 4. Xóa
  deleteStudent: async (studentId) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.deleteStudent(studentId);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Xóa thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },
};

export const dashboardService = {
  getDashboard: async () => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getDashboard();

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể tải dữ liệu tổng quan');
    return await res.json();
    ------------------------------------------------------- */
  }
};

export const classService = {
  // 1. Lấy danh sách lớp
  getClasses: async () => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getClasses();

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/classes`, { 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } 
    });
    if (!res.ok) throw new Error('Lỗi tải danh sách lớp học');
    return await res.json(); 
    ------------------------------------------------------- */
  },

  // 2. Thêm lớp mới
  addClass: async (classData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.addClass(classData);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(classData),
    });
    if (!res.ok) throw new Error('Thêm lớp học thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },

  // 3. Cập nhật lớp
  updateClass: async (classId, classData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.updateClass(classId, classData);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(classData),
    });
    if (!res.ok) throw new Error('Cập nhật lớp thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },

  // 4. Xóa lớp
  deleteClass: async (classId) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.deleteClass(classId);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/classes/${classId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Xóa lớp thất bại');
    return await res.json();
    ------------------------------------------------------- */
  },

  // 5. Gán sinh viên vào lớp
  assignStudents: async (classId, studentIds) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.assignStudentsToClass(classId, studentIds);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/classes/${classId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ studentIds }),
    });
    if (!res.ok) throw new Error('Gán sinh viên thất bại');
    return await res.json();
    ------------------------------------------------------- */
  }
};

export const faceService = {
  // Đăng ký khuôn mặt mới
  registerFace: async (faceData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.registerFace(faceData);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/face/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(faceData),
    });

    if (!res.ok) throw new Error('Đăng ký khuôn mặt không thành công');
    return await res.json(); 
    ------------------------------------------------------- */
  },

  // Kiểm tra trạng thái Face ID của sinh viên
  checkFaceStatus: async (studentId) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getFaceStatus(studentId);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/face/status/${studentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể kiểm tra trạng thái khuôn mặt');
    return await res.json();
    ------------------------------------------------------- */
  }
};

export const attendanceService = {
  getRecords: async (classId = null, date = null) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getAttendanceRecords(classId, date);

    /* --- KHI CÓ API THẬT, BỎ COMMENT ĐOẠN NÀY ĐỂ DÙNG ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    
    let url = `${API_BASE_URL}/attendance/history`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Lỗi tải lịch sử điểm danh');
    return await res.json(); 
    ------------------------------------------------------- */
  }
};