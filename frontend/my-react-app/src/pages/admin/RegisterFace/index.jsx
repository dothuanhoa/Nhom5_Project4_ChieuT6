import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./RegisterFace.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function RegisterFace() {
  const navigate = useNavigate();

  const [studentCode, setStudentCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // chọn ảnh kéo thả ảnh
  const processSelectedFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Vui lòng chỉ chọn tệp hình ảnh hợp lệ!");
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = (e) => {
    processSelectedFile(e.target.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    processSelectedFile(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setStudentCode("");
    setFullName("");
    setImageFile(null);
    setImagePreview(null);
  };
  //End chọn ảnh kéo thả ảnh

  //Call API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Vui lòng tải lên ảnh khuôn mặt!");
    if (!studentCode.trim() || !fullName.trim())
      return toast.error("Vui lòng nhập đủ thông tin!");

    const token = localStorage.getItem("token");
    try {
      const formImage = new FormData();
      formImage.append("image", imageFile);

      const aiFace = await fetch(`${API_BASE_URL}/ai-vision/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formImage,
      });

      if (!aiFace.ok)
        throw new Error("Nhận diện khuôn mặt thất bại trên hệ thống AI.");

      const aiData = await aiFace.json();
      const faceId = aiData.faceId || aiData.id;

      const studentData = {
        studentCode: studentCode,
        fullName: fullName,
        faceId: faceId,
      };

      const stdRes = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      if (!stdRes.ok)
        throw new Error("Lưu thông tin sinh viên vào Database thất bại.");

      toast.success("Đăng ký khuôn mặt và hồ sơ thành công!");

      setTimeout(() => {
        navigate("/admin/students");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  //End Call API

  return (
    <div className="register-face-page">
      <div className="page-header">
        <h2 className="title-page">Đăng ký khuôn mặt mới</h2>
      </div>

      <div className="registration-grid">
        <div className="form-section">
          <div className="edit-card">
            <div className="header-with-back">
              <div className="logo-box">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h3>Thông tin sinh viên</h3>
            </div>

            <form onSubmit={handleSubmit} id="face-reg-form">
              <div className="form-group">
                <label className="form-label">Mã sinh viên</label>
                <input
                  className="input-field"
                  placeholder="Ví dụ: DH52200988"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  className="input-field"
                  placeholder="Nhập tên đầy đủ của sinh viên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </form>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleReset}
              >
                Hủy
              </button>

              <button
                form="face-reg-form"
                type="submit"
                className="btn-save"
                disabled={!imageFile}
              >
                <i className="fa-solid fa-check-circle"></i> Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>

        <div className="camera-section">
          <div className="edit-card">
            <div className="header-with-back">
              <div className="logo-box">
                <i className="fa-solid fa-camera"></i>
              </div>
              <h3>Dữ liệu khuôn mặt</h3>
            </div>

            <div
              className={`camera-preview-box ${!imagePreview ? "empty" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Face Preview"
                  className="preview-image"
                />
              ) : (
                <div className="camera-preview-empty">
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <p className="upload-title">
                    Nhấn hoặc kéo thả ảnh khuôn mặt vào đây
                  </p>
                  <p className="upload-subtitle">Hỗ trợ định dạng: JPG, PNG</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="camera-button-wrapper">
              <button
                className="btn-secondary btn-rounded"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fa-solid fa-camera-rotate btn-icon-left"></i>
                {imagePreview ? "Chọn hình ảnh khác" : "Tải ảnh từ thiết bị"}
              </button>
            </div>

            <div className="info-box">
              <div className="info-box-header">
                <i className="fa-solid fa-circle-info"></i>
                <b className="info-box-title">Lưu ý lấy mẫu chuẩn</b>
              </div>
              <ul className="info-list">
                <li>
                  <i className="fa-solid fa-check"></i> Đảm bảo khuôn mặt nằm
                  trong khung tròn chỉ dẫn.
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Ánh sáng rõ nét, không
                  bị ngược sáng.
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Giữ biểu cảm tự nhiên,
                  không che khuất khuôn mặt.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
