import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { teacherService } from "../../../services/api_Teacher";
import "./Attendance.css";

export default function Attendance() {
  // --- STATE & REFS ---
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const currentClassInfo = classes.find((c) => c.id === selectedClassId);
  // --- END STATE ---

  // --- FETCH API ---
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await teacherService.getTeacherClasses();
        setClasses(data.classes || []);
        if (data.classes?.length > 0) {
          setSelectedClassId(data.classes[0].id);
        }
      } catch (err) {
        toast.error("Lỗi tải danh sách lớp học");
      }
    };

    loadClasses();

    // Tự động tắt camera khi người dùng chuyển sang trang khác
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);
  // --- END FETCH API ---

  // --- CAMERA CONTROL ---
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
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
      if (res.success) {
        setCurrentResult(res.data);
        toast.success("Nhận diện thành công!");
      }
    } catch {
      toast.error("Lỗi nhận diện. Không tìm thấy khuôn mặt.");
    } finally {
      setIsScanning(false);
    }
  };
  // --- END CAMERA CONTROL ---

  // --- RENDER UI ---
  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="class-info-main">
          <div className="select-class-wrapper">
            <select
              className="class-select-input"
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setCurrentResult(null);
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
              <>
                Nhóm {currentClassInfo.group} • {currentClassInfo.studentCount}/
                {currentClassInfo.maxStudents} SV
              </>
            ) : (
              "Đang tải..."
            )}
          </p>
        </div>
      </div>

      <div className="attendance-grid">
        <div className="camera-section-wrapper">
          {!isCameraActive ? (
            <div className="camera-placeholder">
              <i className="fa-solid fa-video-slash"></i>
              <p>Bấm nút bên dưới để mở Camera</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-stream"
              />
              {isScanning && <div className="scanning-line"></div>}
            </>
          )}

          <div className="camera-actions">
            <button
              className="btn-capture-minimal"
              onClick={handleCapture}
              disabled={isScanning}
            >
              <i
                className={`fa-solid ${isScanning ? "fa-circle-notch fa-spin" : "fa-expand"}`}
              ></i>
              <span>
                {isScanning ? "Đang quét AI..." : "Bắt đầu nhận diện"}
              </span>
            </button>
          </div>
        </div>

        <div className="result-section-card">
          <h3 className="section-title">
            <div className="indicator"></div> THÔNG TIN NHẬN DIỆN
          </h3>

          {!currentResult ? (
            <div className="empty-result-state">
              <i className="fa-solid fa-user-shield"></i>
              <p>Hệ thống sẵn sàng</p>
            </div>
          ) : (
            <div className="result-content-view">
              <div className="photo-comparison">
                <div className="avatar-placeholder legacy">
                  {currentResult.shortName || "SV"}
                </div>
                <div className="avatar-placeholder scanned">
                  <i className="fa-solid fa-user-check"></i>
                </div>
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
                <button
                  className="btn-rescan"
                  onClick={() => setCurrentResult(null)}
                  title="Quét lại"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button
                  className="btn-confirm"
                  onClick={() => {
                    toast.success("Đã ghi nhận điểm danh!");
                    setCurrentResult(null);
                  }}
                >
                  XÁC NHẬN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
