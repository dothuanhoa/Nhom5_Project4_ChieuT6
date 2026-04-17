import { useState, useEffect, useMemo } from "react";
import { teacherService } from "../services/api_Teacher";
import { toast } from "sonner";

export default function useTeacherAttendanceHistory() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2023-10-27");
  const [selectedClass, setSelectedClass] = useState("CS101");
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await teacherService.getClassHistory(selectedClass, selectedDate);
      setRecords(res.records || []);
    } catch (error) {
      toast.error("Không thể tải lịch sử điểm danh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedClass, selectedDate]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  const handleVerify = async (recordId) => {
    try {
      await teacherService.verifyAttendance(recordId);
      toast.success("Xác minh thành công");
      fetchHistory(); // Reload lại dữ liệu
    } catch {
      toast.error("Lỗi xác minh");
    }
  };

  return {
    filteredRecords,
    searchTerm, setSearchTerm,
    selectedDate, setSelectedDate,
    selectedClass, setSelectedClass,
    handleVerify, loading
  };
}