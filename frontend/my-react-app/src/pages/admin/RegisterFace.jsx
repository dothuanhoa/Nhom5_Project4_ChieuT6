import React from "react";
import useFaceRegistration from "../../hooks/useFaceRegistration";
import "../../assets/styles/admin.style.css";

export default function RegisterFace() {
  const {
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
  } = useFaceRegistration();

  return (
    <div className="register-face-page">
      {/* Tiêu đề trang */}
      <div className="page-header">
        <h2 className="dashboard-title">Đăng ký khuôn mặt mới</h2>
      </div>

      <div className="registration-grid">
        {/* CỘT TRÁI (5 PHẦN): THÔNG TIN ĐỊNH DANH */}
        <div className="form-section">
          <div className="edit-card" style={{ marginTop: 0 }}>
            <div className="header-with-back" style={{ marginBottom: "24px" }}>
              <div
                className="logo-box"
                style={{ width: "36px", height: "36px", borderRadius: "10px" }}
              >
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                }}
              >
                Thông tin sinh viên
              </h3>
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

            {/* HAI NÚT BẤM CHUNG DÒNG (Tỷ lệ 1:2) */}
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
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check-circle"></i>
                    Xác nhận đăng ký
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (7 PHẦN): CAMERA & DỮ LIỆU HÌNH ẢNH */}
        <div className="camera-section">
          <div className="edit-card" style={{ marginTop: 0 }}>
            <div className="header-with-back" style={{ marginBottom: "24px" }}>
              <div
                className="logo-box"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                <i className="fa-solid fa-camera"></i>
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-main)",
                }}
              >
                Dữ liệu khuôn mặt
              </h3>
            </div>

            {/* Khung hiển thị ảnh/Camera */}
            <div
              className={`camera-preview-box ${!image ? "empty" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !image && fileInputRef.current?.click()}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Face Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Thanh tiến trình khi đang đăng ký */}
                  {registrationStatus === "processing" && (
                    <div className="processing-toast">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
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
                <div style={{ textAlign: "center", color: "#94a3b8" }}>
                  <i
                    className="fa-solid fa-cloud-arrow-up"
                    style={{
                      fontSize: "48px",
                      marginBottom: "16px",
                      color: "var(--admin-blue)",
                      opacity: 0.5,
                    }}
                  ></i>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#64748b",
                    }}
                  >
                    Nhấn hoặc kéo thả ảnh khuôn mặt vào đây
                  </p>
                  <p style={{ fontSize: "13px", marginTop: "8px" }}>
                    Hỗ trợ định dạng: JPG, PNG
                  </p>
                </div>
              )}
            </div>

            {/* Input file bị ẩn */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Nút điều khiển ảnh */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                className="btn-secondary"
                style={{ borderRadius: "12px" }}
                onClick={() => fileInputRef.current?.click()}
                disabled={registrationStatus === "processing"}
              >
                <i
                  className="fa-solid fa-camera-rotate"
                  style={{ marginRight: "10px" }}
                ></i>
                {image ? "Chọn hình ảnh khác" : "Tải ảnh từ thiết bị"}
              </button>
            </div>

            {/* Hộp hướng dẫn */}
            <div className="info-box">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "var(--admin-blue)",
                }}
              >
                <i className="fa-solid fa-circle-info"></i>
                <b style={{ fontSize: "14px", textTransform: "uppercase" }}>
                  Lưu ý lấy mẫu chuẩn
                </b>
              </div>
              <ul className="info-list">
                <li>
                  <i className="fa-solid fa-check"></i> Đảm bảo khuôn mặt nằm
                  trong khung tròn chỉ dẫn.
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Ánh sáng rõ nét, không
                  bị ngược sáng hoặc quá tối.
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
