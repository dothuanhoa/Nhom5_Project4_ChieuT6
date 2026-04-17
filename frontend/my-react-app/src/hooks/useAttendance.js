import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { attendanceService } from "../services/api_Admin";

export default function useAttendance() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await attendanceService.getRecords();
      if (res && res.records) {
        setRecords(res.records);
      } else {
        setRecords(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      toast.error("Lỗi tải lịch sử điểm danh");
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logic lọc dữ liệu
  const filteredRecords = useMemo(() => {
    const data = Array.isArray(records) ? records : [];
    return data.filter((r) => {
      const matchSearch =
        r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = selectedClass === "all" || r.classId === selectedClass;
      const matchTeacher =
        selectedTeacher === "all" || r.teacher === selectedTeacher;

      let matchDate = true;
      if (selectedDate) {
        const [y, m, d] = selectedDate.split("-");
        const formattedDate = `${m}/${d}/${y}`; // Convert YYYY-MM-DD -> MM/DD/YYYY
        matchDate = r.date === formattedDate;
      }

      return matchSearch && matchClass && matchTeacher && matchDate;
    });
  }, [records, searchTerm, selectedClass, selectedTeacher, selectedDate]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const currentRecords = useMemo(() => {
    return filteredRecords.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass, selectedTeacher, selectedDate]);

  return {
    records,
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
