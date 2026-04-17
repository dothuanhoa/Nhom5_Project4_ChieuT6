import { useState, useRef, useEffect } from "react";
import { teacherService } from "../services/api_Teacher";
import { toast } from "sonner";

export default function useAttendanceRecognition() {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  
  // Quản lý lớp học
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // Lấy danh sách lớp khi vừa vào trang
  useEffect(() => {
    const loadClasses = async () => {
      const data = await teacherService.getTeacherClasses();
      setClasses(data.classes || []);
      if (data.classes?.length > 0) {
        setSelectedClassId(data.classes[0].id); // Mặc định chọn lớp đầu tiên
      }
    };
    loadClasses();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
      return true;
    } catch (err) {
      toast.error("Vui lòng cấp quyền Camera.");
      return false;
    }
  };

  const handleCapture = async () => {
    if (!isCameraActive) {
      const ok = await startCamera();
      if (!ok) return;
    }
    setIsScanning(true);
    setCurrentResult(null);
    try {
      const res = await teacherService.recognizeFace("image_base64");
      if (res.success) setCurrentResult(res.data);
    } catch {
      toast.error("Lỗi nhận diện.");
    } finally {
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Tìm thông tin chi tiết của lớp đang chọn để hiển thị ra UI
  const currentClassInfo = classes.find(c => c.id === selectedClassId);

  return {
    videoRef, isScanning, isCameraActive, currentResult,
    classes, selectedClassId, setSelectedClassId, currentClassInfo,
    handleCapture, setCurrentResult, stopCamera
  };
}