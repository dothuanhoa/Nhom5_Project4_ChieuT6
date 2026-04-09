import { useState, useEffect } from "react";
import { toast } from "sonner";
// Đảm bảo đường dẫn này trỏ đúng đến file api.js của bạn
import { studentService } from "../services/api";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State điều khiển giao diện
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    major: "",
    faceRegistered: true,
    status: "active",
  });

  // 1. LẤY DANH SÁCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getStudents();
        setStudents(data.students || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. LỌC TÌM KIẾM
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.id,
      name: student.name,
      major: student.class || "",
      faceRegistered: !!student.faceId,
      status: student.status,
    });
    setShowModal(true);
  };

  // 4. XỬ LÝ CRUD
  const handleDelete = async (studentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      await studentService.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("Đã xóa sinh viên");
    } catch (err) {
      toast.error(err.message || "Xóa thất bại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingStudent) return; 

    setIsSubmitting(true);
    try {
      await studentService.updateStudent(editingStudent.id, {
        id: formData.studentId,
        name: formData.name,
        class: formData.major,
        faceId: formData.faceRegistered ? "registered" : null,
        status: formData.status,
      });

      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                id: formData.studentId,
                name: formData.name,
                class: formData.major,
                faceId: formData.faceRegistered ? "registered" : null,
                status: formData.status,
              }
            : s,
        ),
      );

      toast.success("Đã cập nhật sinh viên");
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xuất mọi thứ ra để giao diện xài
  return {
    students,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showModal,
    setShowModal,
    editingStudent,
    isSubmitting,
    formData,
    setFormData,
    filteredStudents,
    handleEdit,
    handleDelete,
    handleSubmit,
  };
}
