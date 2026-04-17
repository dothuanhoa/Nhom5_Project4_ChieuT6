import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { faceService, studentService } from "../services/api_Admin";

export default function useFaceRegistration() {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    faceId: "",
    status: "active", // Luôn mặc định là đang hoạt động
  });

  const [image, setImage] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Giả lập tiến trình chạy thanh progress khi đang xử lý
  useEffect(() => {
    let interval;
    if (registrationStatus === "processing") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [registrationStatus]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return toast.error("Vui lòng chỉ chọn tệp hình ảnh");
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Vui lòng kéo thả tệp hình ảnh");
    }
  };

  const handleReset = () => {
    setFormData({ studentId: "", name: "", faceId: "", status: "active" });
    setImage(null);
    setRegistrationStatus("idle");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Vui lòng tải lên hoặc chụp ảnh khuôn mặt");
    }

    if (!formData.studentId.trim() || !formData.name.trim()) {
      return toast.error("Vui lòng nhập đầy đủ mã sinh viên và họ tên");
    }

    setRegistrationStatus("processing");

    try {
      // 1. Gọi API đăng ký khuôn mặt để lấy FaceID từ AWS/Server
      const response = await faceService.registerFace({
        studentId: formData.studentId,
        name: formData.name,
        status: "active",
      });

      if (!response.success) {
        throw new Error(response.message || "Đăng ký khuôn mặt thất bại");
      }

      setProgress(100);
      const faceIdFromSystem = response.faceId;

      // 2. Thêm thông tin sinh viên vào cơ sở dữ liệu
      const newStudent = {
        id: formData.studentId,
        name: formData.name,
        class: "Chưa phân lớp",
        faceId: faceIdFromSystem,
        status: "active",
      };

      await studentService.addStudent(newStudent);

      setRegistrationStatus("success");
      toast.success("Đăng ký khuôn mặt và hồ sơ sinh viên thành công!");

      // Reset form sau khi thành công
      handleReset();
    } catch (error) {
      setRegistrationStatus("error");
      toast.error(error.message || "Có lỗi xảy ra trong quá trình đăng ký");
    }
  };

  return {
    formData,
    setFormData,
    image,
    registrationStatus,
    progress,
    fileInputRef,
    handleImageUpload,
    handleDragOver,
    handleDrop,
    handleSubmit,
    handleReset,
  };
}
