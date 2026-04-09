import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { faceService, studentService } from "../services/api";

export default function useFaceRegistration() {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    faceId: "",
    status: "active",
  });

  const [image, setImage] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Giả lập tiến trình khi đang xử lý
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Vui lòng tải lên ảnh khuôn mặt");
      return;
    }

    if (!formData.studentId || !formData.name) {
      alert("Vui lòng nhập đầy đủ mã sinh viên và họ tên");
      return;
    }

    setRegistrationStatus("processing");

    try {
      const response = await faceService.registerFace({
        studentId: formData.studentId,
        name: formData.name,
        status: formData.status,
      });

      setProgress(100);

      if (!response.success) {
        throw new Error(response.message || "Đăng ký thất bại");
      }

      const faceId = response.faceId;

      const newStudent = {
        id: formData.studentId,
        name: formData.name,
        class: "Chưa có lớp",
        faceId: faceId,
        status: formData.status,
      };

      await studentService.addStudent(newStudent);

      setFormData((prev) => ({ ...prev, faceId }));
      setRegistrationStatus("success");

      alert("Đăng ký khuôn mặt & thêm sinh viên thành công!");

      handleReset();
    } catch (error) {
      setRegistrationStatus("error");

      alert(error.message || "Có lỗi xảy ra khi đăng ký");
    }
  };

  const handleReset = () => {
    setFormData({ studentId: "", name: "", faceId: "", status: "active" });
    setImage(null);
    setRegistrationStatus("idle");
    setProgress(0);
  };

  return {
    formData,
    setFormData,
    image,
    setImage,
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
