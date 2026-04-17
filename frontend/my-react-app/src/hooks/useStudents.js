import { useState, useEffect } from "react";
import { toast } from "sonner";
import { studentService } from "../services/api_Admin";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // LẤY DANH SÁCH SINH VIÊN
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

  // LOGIC LỌC DỮ LIỆU
  const filteredStudents = students.filter((s) => {
    const nameMatch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = s.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || s.status === statusFilter;
    return (nameMatch || idMatch) && statusMatch;
  });

  // LOGIC XÓA
  const handleDelete = async (studentId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sinh viên mã ${studentId}?`))
      return;
    try {
      await studentService.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("Đã xóa sinh viên thành công");
    } catch (err) {
      toast.error("Xóa thất bại, vui lòng thử lại");
    }
  };

  return {
    students,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredStudents,
    handleDelete,
  };
}
