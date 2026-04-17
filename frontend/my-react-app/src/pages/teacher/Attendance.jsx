import React, { useEffect } from "react";
import useAttendanceRecognition from "../../hooks/useAttendanceRecognition";
import "../../assets/styles/teacher.style.css";

export default function Attendance() {
  const {
    videoRef, isScanning, isCameraActive, currentResult,
    classes, selectedClassId, setSelectedClassId, currentClassInfo,
    handleCapture, setCurrentResult, stopCamera
  } = useAttendanceRecognition();

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="attendance-container">
      {/* HEADER: CHỌN LỚP HỌC */}
      <div className="attendance-header">
        <div className="class-info-main">
          <div className="select-class-wrapper">
            <select 
              className="class-select-input"
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setCurrentResult(null); // Reset kết quả khi đổi lớp
              }}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.courseId} - {cls.courseName}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down select-icon"></i>
          </div>
        </div>

        <div className="class-info-sub">
          <p className="label">CA HỌC & PHÒNG</p>
          <p className="value">
            {currentClassInfo ? (
              <>Nhóm {currentClassInfo.group} • {currentClassInfo.studentCount}/{currentClassInfo.maxStudents} SV</>
            ) : "Đang tải..."}
          </p>
        </div>
      </div>

      <div className="attendance-grid">
        {/* CỘT TRÁI: CAMERA MINIMALIST */}
        <div className="camera-section-wrapper">
          {!isCameraActive ? (
            <div className="camera-placeholder">
              <i className="fa-solid fa-video-slash"></i>
              <p>Chọn lớp và bấm bắt đầu nhận diện</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="camera-video-stream" />
              {isScanning && <div className="scanning-line"></div>}
            </>
          )}

          <div className="camera-actions">
            <button className="btn-capture-minimal" onClick={handleCapture} disabled={isScanning}>
              <i className={`fa-solid ${isScanning ? 'fa-circle-notch fa-spin' : 'fa-expand'}`}></i>
              <span>{isScanning ? "ĐANG QUÉT..." : "BẮT ĐẦU NHẬN DIỆN"}</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: KẾT QUẢ */}
        <div className="result-section-card">
          <h3 className="section-title"><div className="indicator"></div> THÔNG TIN NHẬN DIỆN</h3>
          {!currentResult ? (
            <div className="empty-result-state">
              <i className="fa-solid fa-user-shield"></i>
              <p>Hệ thống sẵn sàng</p>
            </div>
          ) : (
            <div className="result-content-view">
              <div className="photo-comparison">
                <div className="avatar-placeholder legacy">{currentResult.shortName}</div>
                <div className="avatar-placeholder scanned"><i className="fa-solid fa-user-check"></i></div>
              </div>
              
              <div className="student-detail-info">
                <h2 className="name">{currentResult.studentName}</h2>
                <p className="id-text">MSSV: {currentResult.studentId}</p>
              </div>

              <div className="similarity-badge">
                <span>Độ chính xác:</span>
                <strong>{currentResult.similarity}%</strong>
              </div>

              <div className="result-actions">
                <button className="btn-rescan" onClick={() => setCurrentResult(null)}>
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button className="btn-confirm" onClick={() => setCurrentResult(null)}>XÁC NHẬN</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}