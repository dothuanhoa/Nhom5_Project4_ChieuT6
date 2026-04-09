import { useState, useEffect } from "react";
import { toast } from "sonner";
import { classService } from "../services/api";

export default function useClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    group: "",
    maxStudents: 50,
    status: "active",
  });

  // 1. Fetch Dữ Liệu
  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classService.getClasses();
      // Đảm bảo lấy đúng mảng classes từ object { classes: [], total: x }
      const classesData = data?.classes || data || [];
      setClasses(classesData);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // 2. Lọc tìm kiếm (Đã sửa lại để an toàn hơn)
  const filteredClasses = classes.filter((cls) => {
    // Chuyển tất cả về chuỗi trống nếu bị null/undefined để tránh lỗi toLowerCase
    const courseId = cls.courseId ? String(cls.courseId).toLowerCase() : "";
    const courseName = cls.courseName ? String(cls.courseName).toLowerCase() : "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = courseId.includes(search) || courseName.includes(search);
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 3. Xử lý UI Modal
  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      courseId: "",
      courseName: "",
      group: "",
      maxStudents: 50,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      courseId: cls.courseId || "",
      courseName: cls.courseName || "",
      group: cls.group || "",
      maxStudents: cls.maxStudents || 50,
      status: cls.status || "active",
    });
    setShowModal(true);
  };

  const handleAssignStudents = (cls) => {
    setSelectedClass(cls);
    setShowAssignModal(true);
  };

  // 4. Xử lý Gửi Dữ liệu (Thêm, Sửa, Xóa)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await classService.updateClass(editingClass.id, formData);
        setClasses((prev) =>
          prev.map((c) =>
            c.id === editingClass.id ? { ...c, ...formData } : c
          )
        );
        toast.success("Đã cập nhật lớp học");
      } else {
        const response = await classService.addClass(formData);
        const newClass = response.class || response;
        setClasses((prev) => [...prev, newClass]);
        toast.success("Đã tạo lớp học mới");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Thao tác thất bại");
    }
  };

  const handleAssignSubmit = async (studentIds) => {
    try {
      await classService.assignStudents(selectedClass.id, studentIds);
      toast.success("Đã thêm sinh viên vào lớp");
      setShowAssignModal(false);
      await fetchClasses(); // Tải lại để cập nhật studentCount mới từ mockDatabase
    } catch (err) {
      toast.error("Không thể thêm sinh viên");
    }
  };

  return {
    classes,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showModal,
    setShowModal,
    showAssignModal,
    setShowAssignModal,
    editingClass,
    selectedClass,
    formData,
    setFormData,
    filteredClasses,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleAssignStudents,
    handleAssignSubmit,
  };
}