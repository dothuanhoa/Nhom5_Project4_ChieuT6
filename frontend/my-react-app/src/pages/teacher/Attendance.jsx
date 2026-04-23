import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import "../../assets/styles/TeacherStyle.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";
const NODE_API_URL = "https://api-backend-node-nhom5-chieut6.onrender.com";

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [allStudents, setAllStudents] = useState([]);

  const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResults, setCurrentResults] = useState([]);

  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const currentClassInfo = classes.find(
    (c) => c.id.toString() === selectedClassId.toString(),
  );

  // Call API classes & all students
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      })
      .catch(() => toast.error("Lỗi tải danh sách lớp học"));

    fetch(`${API_BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAllStudents(data))
      .catch(() => console.log("Lỗi tải danh sách sinh viên"));

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Call API nlấy sinh viên thuộc lớp đag chọn
  useEffect(() => {
    if (!selectedClassId) return;

    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/classes/${selectedClassId}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEnrolledStudentIds(data.map((sv) => sv.id)))
      .catch(() => console.log("Lỗi tải danh sách sinh viên của lớp"));
  }, [selectedClassId]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        }, 100);
      })
      .catch(() => toast.error("Vui lòng cấp quyền Camera."));
  };

  const handleTakePhoto = () => {
    if (!isCameraActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return toast.error("Lỗi khi chụp ảnh!");
        setCapturedBlob(blob);
        setCapturedUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.8,
    );
  };

  const handleRetake = () => {
    setCapturedBlob(null);
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
    setCurrentResults([]);
  };

  const handleSendToAI = () => {
    if (!capturedBlob) return;

    setIsScanning(true);
    setCurrentResults([]);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", capturedBlob, "diemdanh.jpg");

    fetch(`${API_BASE_URL}/ai-vision/identify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          toast.error("AI không tìm thấy khuôn mặt nào.");
          return;
        }

        const mappedResults = [];

        faceArray.forEach((aiFace) => {
          const aiFaceId = aiFace.faceId || aiFace.id;
          const realStudent = allStudents.find((sv) => sv.faceId === aiFaceId);

          if (realStudent) {
            const isDuplicate = mappedResults.some(
              (item) => item.studentId === realStudent.studentCode,
            );

            if (!isDuplicate) {
              const isEnrolled = enrolledStudentIds.includes(realStudent.id);

              mappedResults.push({
                dbId: realStudent.id,
                studentName: realStudent.fullName,
                studentId: realStudent.studentCode,
                similarity: Math.round(aiFace.similarity),
                isEnrolled: isEnrolled,
              });
            }
          }
        });

        if (mappedResults.length > 0) {
          setCurrentResults(mappedResults);
          toast.success(`Nhận diện được ${mappedResults.length} sinh viên!`);
        } else {
          toast.error("Khuôn mặt chưa được đăng ký trong hệ thống!");
        }
      })
      .catch(() => toast.error("Lỗi mạng hoặc AI đang tắt."))
      .finally(() => setIsScanning(false));
  };

  const handleCancelSingle = (studentId) => {
    setCurrentResults((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  //Xử lý Call API lưu Điểm danh
  const handleConfirmSingle = (student) => {
    const token = localStorage.getItem("token");
    const checkInTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const payload = {
      studentId: student.dbId,
      classId: selectedClassId,
      similarityScore: student.similarity,
      status: "Present",
      checkInTime: checkInTime,
    };

    fetch(`${NODE_API_URL}/api/attendance/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => toast.success(`Đã điểm danh: ${student.studentName}`))
      .catch(() =>
        toast.success(`Đã xác nhận UI: ${student.studentName} (Chờ API)`),
      )
      .finally(() => {
        setCurrentResults((prev) => {
          const remainingStudents = prev.filter(
            (s) => s.studentId !== student.studentId,
          );

          if (remainingStudents.length === 0) {
            handleRetake();
          }

          return remainingStudents;
        });
      });
  };
  //End Xử lý Call API lưu Điểm danh

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
                setCurrentResults([]);
                handleRetake();
              }}
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.courseCode || item.courseId} - {item.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="class-info-sub">
          <p className="value">
            Nhóm:{" "}
            {currentClassInfo
              ? `${currentClassInfo.group || currentClassInfo.groupNumber}`
              : " "}
          </p>
        </div>
      </div>

      <div className="attendance-grid">
        <div className="camera-section-wrapper">
          {!isCameraActive ? (
            <div
              className="camera-placeholder"
              onClick={startCamera}
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-video"></i>
              <p>Bấm vào đây để mở Camera</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-stream"
                style={{ display: capturedUrl ? "none" : "block" }}
              />
              {capturedUrl && (
                <img
                  src={capturedUrl}
                  alt="Captured"
                  className="captured-image-preview"
                />
              )}
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </>
          )}

          {isCameraActive && (
            <div className="camera-actions">
              {!capturedUrl ? (
                <button
                  className="btn-capture-minimal"
                  onClick={handleTakePhoto}
                >
                  <i className="fa-solid fa-camera"></i>
                  <span>Chụp ảnh</span>
                </button>
              ) : (
                <div className="camera-actions-group">
                  <button
                    className="btn-retake"
                    onClick={handleRetake}
                    disabled={isScanning}
                  >
                    <i className="fa-solid fa-rotate-right"></i> Chụp lại
                  </button>
                  <button
                    className="btn-send"
                    onClick={handleSendToAI}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>{" "}
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i> Gửi nhận
                        diện
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="result-section-card">
          <h3 className="section-title">
            <div className="indicator"></div> Thông tin nhận diện
          </h3>

          {currentResults.length === 0 ? (
            <div className="empty-result-state">
              <i className="fa-solid fa-users-viewfinder"></i>
              <p>Hệ thống sẵn sàng</p>
            </div>
          ) : (
            <div className="students-list-scroller">
              {currentResults.map((student) => (
                <div
                  className="student-result-item"
                  key={student.studentId}
                  style={{
                    border: student.isEnrolled
                      ? "1px solid #e2e8f0"
                      : "1px solid #fca5a5",
                  }}
                >
                  <div className="info-row" style={{ marginBottom: "12px" }}>
                    <div className="info-left">
                      <p className="id-text">
                        MSSV: <strong>{student.studentId}</strong>
                      </p>
                      <h2 className="name">{student.studentName}</h2>
                      <div style={{ marginTop: "10px" }}>
                        {student.isEnrolled ? (
                          <span
                            style={{
                              color: "#059669",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#d1fae5",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              display: "inline-block",
                            }}
                          >
                            <i className="fa-solid fa-circle-check"></i> Đang
                            theo học lớp này
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "#ef4444",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#fee2e2",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              display: "inline-block",
                            }}
                          >
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            Không có trong danh sách
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="info-right">
                      <div className="similarity-box">
                        <span className="sim-label">Độ chính xác</span>
                        <strong className="sim-value">
                          {student.similarity}%
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="action-row">
                    <button
                      className="btn-cancel-scan"
                      onClick={() => handleCancelSingle(student.studentId)}
                    >
                      HỦY
                    </button>
                    <button
                      className="btn-confirm-scan"
                      onClick={() => handleConfirmSingle(student)}
                    >
                      XÁC NHẬN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
