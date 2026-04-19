import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { faceService, studentService } from "../../../services/api_Admin"; // Chỉnh đường dẫn nếu cần
import "./RegisterFace.css";

export default function RegisterFace() {
  // ==========================================
  // BƯỚC 1: KHAI BÁO BIẾN LƯU TRỮ (STATE & REF)
  // ==========================================
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
  });

  const [image, setImage] = useState(null); // Lưu ảnh hiển thị trên màn hình
  const [registrationStatus, setRegistrationStatus] = useState("idle"); // idle, processing, success, error
  const [progress, setProgress] = useState(0); // Từ 0 đến 100%

  // useRef dùng để móc vào thẻ <input type="file"> bị ẩn, giúp mình "bấm hộ" nó khi người dùng click vào cái khung ảnh
  const fileInputRef = useRef(null);

  // ==========================================
  // BƯỚC 2: HIỆU ỨNG THANH TIẾN TRÌNH (CHẠY ĐẾN 90%)
  // ==========================================
  useEffect(() => {
    let interval;
    // Nếu bắt đầu bấm Submit (trạng thái processing) thì cho thanh phần trăm chạy từ từ
    if (registrationStatus === "processing") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Dừng ở 90%, đợi API gọi xong mới nhảy lên 100%
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [registrationStatus]);

  // ==========================================
  // BƯỚC 3: XỬ LÝ ẢNH (BẤM CHỌN HOẶC KÉO THẢ)
  // ==========================================
  // Hàm xử lý khi bấm nút chọn file
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return toast.error("Vui lòng chỉ chọn tệp hình ảnh");
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); // Đọc file thành URL để hiển thị lên <img>
      reader.readAsDataURL(file);
    }
  };

  // 2 Hàm xử lý khi kéo thả ảnh vào khung
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

  // ==========================================
  // BƯỚC 4: XỬ LÝ NÚT BẤM (GỬI LÊN SERVER)
  // ==========================================
  const handleReset = () => {
    setFormData({ studentId: "", name: "" });
    setImage(null);
    setRegistrationStatus("idle");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rào lỗi cơ bản
    if (!image) return toast.error("Vui lòng tải lên hoặc chụp ảnh khuôn mặt");
    if (!formData.studentId.trim() || !formData.name.trim())
      return toast.error("Vui lòng nhập đầy đủ mã sinh viên và họ tên");

    setRegistrationStatus("processing"); // Bật trạng thái loading

    try {
      // 1. Gọi API gửi ảnh đi đăng ký khuôn mặt
      const response = await faceService.registerFace({
        studentId: formData.studentId,
        name: formData.name,
        status: "active",
      });

      if (!response.success) {
        throw new Error(response.message || "Đăng ký khuôn mặt thất bại");
      }

      setProgress(100); // Kéo thanh tiến trình đầy 100%
      const faceIdFromSystem = response.faceId;

      // 2. Thêm thông tin sinh viên vào cơ sở dữ liệu hệ thống
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

      // 3. Reset form sạch sẽ để đăng ký người tiếp theo
      setTimeout(() => {
        handleReset();
      }, 1500);
    } catch (error) {
      setRegistrationStatus("error");
      toast.error(error.message || "Có lỗi xảy ra trong quá trình đăng ký");
    }
  };

  // ==========================================
  // BƯỚC 5: GIAO DIỆN HIỂN THỊ (HTML)
  // ==========================================
  return (
    <div className="register-face-page">
      <div className="page-header">
        <h2 className="title-page">Đăng ký khuôn mặt mới</h2>
      </div>

      <div className="registration-grid">
        {/* Cột 1: Form Nhập Liệu */}
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
                  placeholder="Ví dụ: SV2023001"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  disabled={registrationStatus === "processing"}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  className="input-field"
                  placeholder="Nhập tên đầy đủ của sinh viên"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={registrationStatus === "processing"}
                  required
                />
              </div>
            </form>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleReset}
                disabled={registrationStatus === "processing"}
              >
                Hủy
              </button>
              <button
                form="face-reg-form"
                type="submit"
                className="btn-save"
                disabled={registrationStatus === "processing" || !image}
              >
                {registrationStatus === "processing" ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Đang xử
                    lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check-circle"></i> Xác nhận đăng
                    ký
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cột 2: Khung chứa ảnh & Upload */}
        <div className="camera-section">
          <div className="edit-card">
            <div className="header-with-back">
              <div className="logo-box">
                <i className="fa-solid fa-camera"></i>
              </div>
              <h3>Dữ liệu khuôn mặt</h3>
            </div>

            {/* Khung hiển thị ảnh/Camera */}
            <div
              className={`camera-preview-box ${!image ? "empty" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              // Bấm vào khung này là kích hoạt cái thẻ <input file> bị ẩn ở dưới
              onClick={() => !image && fileInputRef.current?.click()}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Face Preview"
                    className="preview-image"
                  />

                  {/* Thanh tiến trình màu xanh nổi lên khi đang tải */}
                  {registrationStatus === "processing" && (
                    <div className="processing-toast">
                      <div className="processing-toast-header">
                        <span>Đang phân tích đặc điểm...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
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

            {/* Input file bị ẩn đi (do xấu), dùng ref để kích hoạt */}
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
                disabled={registrationStatus === "processing"}
              >
                <i className="fa-solid fa-camera-rotate btn-icon-left"></i>
                {image ? "Chọn hình ảnh khác" : "Tải ảnh từ thiết bị"}
              </button>
            </div>

            {/* Hộp hướng dẫn */}
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
