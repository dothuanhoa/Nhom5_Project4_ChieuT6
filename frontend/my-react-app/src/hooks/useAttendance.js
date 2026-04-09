import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { attendanceService } from "../services/api";

export default function useAttendance() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // LOAD DATA
  const fetchData = async () => {
    try {
      const res = await attendanceService.getRecords();
      
      // SỬA LỖI TẠI ĐÂY: 
      // Vì Mock Database trả về { records: [...], total: 5 }
      // Ta phải bóc tách lấy mảng 'records' ra
      if (res && res.records) {
        setRecords(res.records);
      } else {
        setRecords(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
      toast.error("Lỗi tải dữ liệu");
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FILTER LOGIC
  const filteredRecords = useMemo(() => {
    // Đảm bảo records luôn là mảng để không bị lỗi .filter
    const data = Array.isArray(records) ? records : [];
    
    return data.filter((r) => {
      // 1. Tìm kiếm theo tên hoặc mã sinh viên
      const matchSearch =
        (r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId?.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Lọc theo lớp học
      const matchClass = selectedClass === "all" || r.classId === selectedClass;

      // 3. Lọc theo giảng viên (nếu trong records có trường teacher)
      const matchTeacher = selectedTeacher === "all" || r.teacher === selectedTeacher;

      // 4. Lọc theo ngày (Chuyển YYYY-MM-DD từ input sang MM/DD/YYYY khớp với Mock)
      let matchDate = true;
      if (selectedDate) {
        const [y, m, d] = selectedDate.split("-");
        const formattedDate = `${m}/${d}/${y}`; // Mock dùng định dạng Tháng/Ngày/Năm
        matchDate = r.date === formattedDate;
      }

      return matchSearch && matchClass && matchTeacher && matchDate;
    });
  }, [records, searchTerm, selectedClass, selectedTeacher, selectedDate]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  
  const currentRecords = useMemo(() => {
    return filteredRecords.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredRecords, currentPage]);

  // Reset về trang 1 khi người dùng thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedTeacher, selectedDate]);

  return {
    records, // Dùng để lấy danh sách unique cho select box
    currentRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    selectedTeacher,
    setSelectedTeacher,
    selectedDate,
    setSelectedDate,
    refresh: fetchData,
  };
}