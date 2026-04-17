import { mockAPI } from "../mock/mockDatabase";

// ============================================================================
// TEACHER SERVICE - DÀNH RIÊNG CHO CÁC CHỨC NĂNG CỦA GIẢNG VIÊN
// Hiện tại đang dùng 100% Mock Data. Khi có Backend, chỉ cần hoán đổi code.
// ============================================================================

const API_BASE_URL = "http://localhost:3000/api/teacher"; // URL Backend thực tế

export const teacherService = {
  // 1. Nhận diện khuôn mặt (Gửi ảnh từ camera lên AI Server)
  recognizeFace: async (imageBase64) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.recognizeFace(imageBase64);

    /* --- KHI CÓ API THẬT, DÙNG ĐOẠN NÀY ---
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/recognize`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!res.ok) throw new Error('Không thể kết nối với Server AI');
    return await res.json();
    ----------------------------------------- */
  },

  // 2. Xác nhận điểm danh (Lưu vào Database sau khi quét thành công)
  submitAttendance: async (attendanceData) => {
    // --- ĐANG DÙNG MOCK DATA ---
    // Giả lập lưu thành công
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 800),
    );

    /* --- KHI CÓ API THẬT, DÙNG ĐOẠN NÀY ---
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/attendance/confirm`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(attendanceData),
    });
    if (!res.ok) throw new Error('Lưu điểm danh thất bại');
    return await res.json();
    ----------------------------------------- */
  },

  // 3. Lấy danh sách lớp học của giảng viên này
  getTeacherClasses: async () => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getClasses();

    /* --- KHI CÓ API THẬT, DÙNG ĐOẠN NÀY ---
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/my-classes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể tải danh sách lớp học');
    return await res.json();
    ----------------------------------------- */
  },

  // 4. Lấy lịch sử điểm danh của một lớp cụ thể
  getClassHistory: async (classId) => {
    // --- ĐANG DÙNG MOCK DATA ---
    return await mockAPI.getAttendanceRecords(classId);

    /* --- KHI CÓ API THẬT, DÙNG ĐOẠN NÀY ---
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/attendance-history/${classId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể tải lịch sử lớp học');
    return await res.json();
    ----------------------------------------- */
  },
};
