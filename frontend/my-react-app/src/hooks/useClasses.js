import { useState, useEffect } from "react";
import { toast } from "sonner";
import { classService } from "../services/api_Admin";

export default function useClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classService.getClasses();
      setClasses(data?.classes || data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter((cls) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      cls.courseId?.toLowerCase().includes(search) ||
      cls.courseName?.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) return;
    try {
      await classService.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Đã xóa lớp học");
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  const handleAssignStudents = (cls) => {
    setSelectedClass(cls);
    setShowAssignModal(true);
  };

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredClasses,
    handleDelete,
    handleAssignStudents,
    showAssignModal,
    setShowAssignModal,
    selectedClass,
    fetchClasses,
  };
}
