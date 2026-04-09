// ================================================================
// MOCK DATABASE - Xóa file này khi có API thật
// ================================================================

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ── DATA MẪU (Sử dụng 'let' thay vì 'const' để có thể thêm/sửa/xóa) ──

let USERS = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "admin@edu.vn",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "teacher@edu.vn",
    password: "teacher123",
    role: "teacher",
  },
];

let STUDENTS = [
  {
    id: "SV2023001",
    name: "Lê Hoàng Nam",
    email: "nam@edu.vn",
    class: "CS101",
    status: "active",
    faceId: "FC_STUDENT_0001_PROX",
    avatar: "https://ui-avatars.com/api/?name=Lê+Hoàng+Nam&background=random",
  },
  {
    id: "SV2023042",
    name: "Phạm Minh Anh",
    email: "anh@edu.vn",
    class: "CS101",
    status: "active",
    faceId: "FC_STUDENT_0042_PROX",
    avatar: "https://ui-avatars.com/api/?name=Phạm+Minh+Anh&background=random",
  },
  {
    id: "SV2023115",
    name: "Trần Nhật Duy",
    email: "duy@edu.vn",
    class: "CS102",
    status: "active",
    faceId: "FC_STUDENT_0115_PROX",
    avatar: "https://ui-avatars.com/api/?name=Trần+Nhật+Duy&background=random",
  },
  {
    id: "SV2023089",
    name: "Nguyễn Thu Thủy",
    email: "thuy@edu.vn",
    class: "CS102",
    status: "inactive",
    faceId: "",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyễn+Thu+Thủy&background=random",
  },
  {
    id: "SV2023021",
    name: "Đỗ Thùy Linh",
    email: "linh@edu.vn",
    class: "CS101",
    status: "active",
    faceId: "FC_STUDENT_0021_PROX",
    avatar: "https://ui-avatars.com/api/?name=Đỗ+Thùy+Linh&background=random",
  },
];

let CLASSES = [
  {
    id: "1",
    courseId: "IT101",
    courseName: "Cơ sở dữ liệu",
    group: "N01",
    studentCount: 45,
    maxStudents: 50,
    status: "active",
  },
  {
    id: "2",
    courseId: "SE204",
    courseName: "Thiết kế phần mềm",
    group: "N03",
    studentCount: 32,
    maxStudents: 40,
    status: "active",
  },
  {
    id: "3",
    courseId: "MT302",
    courseName: "Giải tích 2",
    group: "L12",
    studentCount: 0,
    maxStudents: 60,
    status: "inactive",
  },
  {
    id: "4",
    courseId: "CS105",
    courseName: "Nhập môn Lập trình",
    group: "N05",
    studentCount: 58,
    maxStudents: 60,
    status: "active",
  },
];

let ATTENDANCE_RECORDS = [
  {
    id: "1",
    studentId: "SV2023001",
    studentName: "Lê Hoàng Nam",
    classId: "CS101",
    date: "10/27/2023",
    time: "07:32 AM",
    similarity: 98,
    status: "present",
    isVerified: true,
  },
  {
    id: "2",
    studentId: "SV2023042",
    studentName: "Phạm Minh Anh",
    classId: "CS101",
    date: "10/27/2023",
    time: "07:55 AM",
    similarity: 82,
    status: "late",
    isVerified: true,
  },
  {
    id: "3",
    studentId: "SV2023115",
    studentName: "Trần Nhật Duy",
    classId: "CS101",
    date: "10/27/2023",
    time: "08:10 AM",
    similarity: 64,
    status: "pending",
    isVerified: false,
  },
  {
    id: "4",
    studentId: "SV2023089",
    studentName: "Nguyễn Thu Thủy",
    classId: "CS101",
    date: "10/27/2023",
    time: "-- : --",
    similarity: 0,
    status: "absent",
    isVerified: true,
  },
  {
    id: "5",
    studentId: "SV2023021",
    studentName: "Đỗ Thùy Linh",
    classId: "CS101",
    date: "10/27/2023",
    time: "07:31 AM",
    similarity: 95,
    status: "present",
    isVerified: true,
  },
];

const DASHBOARD_STATS = {
  totalStudents: "2,451",
  totalClasses: "128",
  attendanceToday: "1,892",
  absentToday: "08",
};

const WEEKLY_ATTENDANCE = [
  { day: "Thứ 2", count: 820 },
  { day: "Thứ 3", count: 945 },
  { day: "Thứ 4", count: 892 },
  { day: "Thứ 5", count: 1050 },
  { day: "Thứ 6", count: 856 },
  { day: "Thứ 7", count: 420 },
  { day: "CN", count: 150 },
];

const FACE_RECOGNITION_DB = [
  { studentId: "SV20240982", studentName: "LÊ HOÀNG NAM", shortName: "LN" },
  { studentId: "SV20241105", studentName: "TRẦN MINH TÂM", shortName: "TT" },
  { studentId: "SV20240731", studentName: "PHẠM THÙY LINH", shortName: "PL" },
  { studentId: "SV20240812", studentName: "NGUYỄN QUỐC ANH", shortName: "NA" },
];

// ── MOCK API FUNCTIONS ───────────────────────────────────────────

export const mockAPI = {
  // --- AUTH ---
  login: async (email, password) => {
    await delay(800);
    const found = USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) return null;
    const { password: _, ...userWithoutPassword } = found;
    return {
      token: `mock_jwt_token_${found.id}_${Date.now()}`,
      user: userWithoutPassword,
    };
  },

  // --- DASHBOARD ---
  getDashboard: async () => {
    await delay(500);
    return {
      stats: DASHBOARD_STATS,
      weeklyAttendance: WEEKLY_ATTENDANCE,
    };
  },

  // --- STUDENTS ---
  getStudents: async () => {
    await delay(500);
    // Trả về bản sao để tránh lỗi tham chiếu bộ nhớ
    return { students: [...STUDENTS], total: STUDENTS.length };
  },

  addStudent: async (studentData) => {
    await delay(600);
    const newStudent = { id: `SV${Date.now()}`, ...studentData };
    STUDENTS.push(newStudent);
    return { success: true, student: newStudent };
  },

  updateStudent: async (studentId, studentData) => {
    await delay(500);
    STUDENTS = STUDENTS.map((s) =>
      s.id === studentId ? { ...s, ...studentData } : s,
    );
    return { success: true };
  },

  deleteStudent: async (studentId) => {
    await delay(400);
    STUDENTS = STUDENTS.filter((s) => s.id !== studentId);
    return { success: true };
  },

  // --- CLASSES ---
  getClasses: async () => {
    await delay(500);
    return { classes: [...CLASSES], total: CLASSES.length };
  },

  addClass: async (classData) => {
    await delay(600);
    const newClass = {
      id: Date.now().toString(),
      studentCount: 0,
      ...classData,
    };
    CLASSES.push(newClass);
    return { success: true, class: newClass };
  },

  updateClass: async (classId, classData) => {
    await delay(500);
    CLASSES = CLASSES.map((c) =>
      c.id === classId ? { ...c, ...classData } : c,
    );
    return { success: true };
  },

  deleteClass: async (classId) => {
    await delay(400);
    CLASSES = CLASSES.filter((c) => c.id !== classId);
    return { success: true };
  },

  // Giả lập tính năng thêm sinh viên vào lớp
  assignStudentsToClass: async (classId, studentIdsArray) => {
    await delay(800);
    // Tìm lớp học và tăng số lượng sinh viên lên
    CLASSES = CLASSES.map((c) => {
      if (c.id === classId) {
        return { ...c, studentCount: c.studentCount + studentIdsArray.length };
      }
      return c;
    });
    return { success: true };
  },

  // --- ATTENDANCE ---
  getAttendanceRecords: async (classId, date) => {
    await delay(500);
    const filtered = ATTENDANCE_RECORDS.filter(
      (r) => (!classId || r.classId === classId) && (!date || r.date === date),
    );
    return { records: filtered, total: filtered.length };
  },

  verifyAttendance: async (recordId) => {
    await delay(400);
    ATTENDANCE_RECORDS = ATTENDANCE_RECORDS.map((r) =>
      r.id === recordId ? { ...r, status: "present", isVerified: true } : r,
    );
    return { success: true };
  },

  // --- FACE RECOGNITION ---
  recognizeFace: async (imageBase64) => {
    await delay(1500);
    const random =
      FACE_RECOGNITION_DB[
        Math.floor(Math.random() * FACE_RECOGNITION_DB.length)
      ];
    return {
      success: true,
      data: {
        ...random,
        similarity: (Math.random() * (99.9 - 95.0) + 95.0).toFixed(1),
      },
    };
  },

  registerFace: async (studentData, imageBase64) => {
    await delay(2000);
    const success = Math.random() > 0.1;
    if (!success)
      return { success: false, message: "Không tìm thấy khuôn mặt" };
    return {
      success: true,
      faceId: `FC_STUDENT_${Math.floor(Math.random() * 9000 + 1000)}_PROX`,
    };
  },
};
