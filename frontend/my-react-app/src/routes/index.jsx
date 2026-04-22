import AdminLayout from "../layout/AdminLayout.jsx";
import TeacherLayout from "../layout/TeacherLayout.jsx";
import PrivateRoutes from "../components/PrivateRoutes";
import { Navigate } from "react-router-dom";

import Login from "../pages/auth";
// ===  ADMIN ===
import ClassEdit from "../pages/admin/ClassEdit.jsx";
import Classes from "../pages/admin/Classes.jsx";
import ClassCreate from "../pages/admin/ClassCreate.jsx";
import ClassAssign from "../pages/admin/ClassAssign.jsx";
import RegisterFace from "../pages/admin/RegisterFace.jsx";
import Students from "../pages/admin/Students.jsx";
import AdminAttendanceHistory from "../pages/admin/AttendanceHistory.jsx";
import StudentEdit from "../pages/admin/StudentEdit.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import UserRegister from "../pages/admin/UserRegister.jsx";
// === GIÁO VIÊN ===
import Attendance from "../pages/teacher/Attendance.jsx";
import TeacherAttendanceHistory from "../pages/teacher/AttendanceHistory.jsx";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  // ==========================================
  // 1. NHÓM ADMIN
  // ==========================================
  {
    path: "/admin",
    element: <PrivateRoutes />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/classes" />,
          },
          {
            path: "classes",
            element: <Classes />,
          },
          {
            path: "classes/add",
            element: <ClassCreate />,
          },
          {
            path: "classes/edit/:id",
            element: <ClassEdit />,
          },
          {
            path: "classes/assign/:id",
            element: <ClassAssign />,
          },
          {
            path: "students",
            element: <Students />,
          },
          {
            path: "students/edit/:id",
            element: <StudentEdit />,
          },
          {
            path: "register-face",
            element: <RegisterFace />,
          },
          {
            path: "attendance",
            element: <AdminAttendanceHistory />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "users/add",
            element: <UserRegister />,
          },
        ],
      },
    ],
  },

  // ==========================================
  // 2. NHÓM GIÁO VIÊN
  // ==========================================
  {
    path: "/teacher",
    element: <PrivateRoutes />,
    children: [
      {
        element: <TeacherLayout />,
        children: [
          {
            index: true,

            element: <Attendance />,
          },
          {
            path: "attendanceHistory",
            element: <TeacherAttendanceHistory />,
          },
        ],
      },
    ],
  },
];
