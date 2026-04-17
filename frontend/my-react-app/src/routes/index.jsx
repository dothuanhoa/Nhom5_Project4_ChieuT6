import AdminLayout from "../layout/AdminLayout";
import TeacherLayout from "../layout/TeacherLayout";
import PrivateRoutes from "../components/PrivateRoutes";
import { Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

// ===  ADMIN ===
import Dashboard from "../pages/admin/Dashboard";
import Classes from "../pages/admin/Classes";
import ClassForm from "../pages/admin/ClassForm";
import RegisterFace from "../pages/admin/RegisterFace";
import Students from "../pages/admin/Students";
import AdminAttendanceHistory from "../pages/admin/AttendanceHistory";
import StudentEdit from "../pages/admin/StudentEdit";


// === GIÁO VIÊN ===
import Attendance from "../pages/teacher/Attendance";
import TeacherAttendanceHistory from "../pages/teacher/AttendanceHistory";

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
            element: <Dashboard />,
          },
          {
            path: "classes",
            element: <Classes />,
          },
          {
            path: "students",
            element: <Students />,
          },
          {
            path: "classes/add",
            element: <ClassForm />,
          },
          {
            path: "classes/edit/:id",
            element: <ClassForm />,
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
