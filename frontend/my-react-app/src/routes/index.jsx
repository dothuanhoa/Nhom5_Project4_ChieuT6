import AdminLayout from "../layout/AdminLayout/index";
import TeacherLayout from "../layout/TeacherLayout/index";
import PrivateRoutes from "../components/PrivateRoutes";

// ===  ADMIN ===
import Dashboard from "../pages/admin/Dashboard";
import Classes from "../pages/admin/Classes";
import RegisterFace from "../pages/admin/RegisterFace";
import Students from "../pages/admin/Students";

// === GIÁO VIÊN ===
import Attendance from "../pages/teacher/Attendance";
import History from "../pages/teacher/History";
import Verify from "../pages/teacher/Verify";

export const routes = [
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
            path: "register-face",
            element: <RegisterFace />,
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
            path: "attendance",
            element: <Attendance />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "verify",
            element: <Verify />,
          },
        ],
      },
    ],
  },
];
