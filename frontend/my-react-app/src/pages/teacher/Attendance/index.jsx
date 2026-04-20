import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./Attendance.css";

const API_BASE_URL = "https://api-backend-spring-nhom5-chieut6.onrender.com";

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [allStudents, setAllStudents] = useState([]);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResults, setCurrentResults] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const currentClassInfo = classes.find(
    (c) => c.id.toString() === selectedClassId.toString(),
  );

  //Call API classes
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const listClasses = data.classes || data || [];
        setClasses(listClasses);
        if (listClasses.length > 0) setSelectedClassId(listClasses[0].id);
      })
      .catch(() => toast.error("Lỗi tải danh sách lớp học"));

    fetch(`${API_BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // API trả về: [{ faceId, fullName, id, studentCode }, ...]
        const list = Array.isArray(data)
          ? data
          : data.students || data.data || [];
        setAllStudents(list);
      })
      .catch(() => console.log("Lỗi tải danh sách sinh viên"));
    
    //Tắt cam khi chuyển tab
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
    //End Tắt cam khi chuyển tab

  }, []);

  //End Call API classes 

  //open Camera
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" } })
      .then((mediaStream) => {
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        }, 100);
      })
      .catch(() => toast.error("Vui lòng cấp quyền Camera."));
  };
  //End open Camera

  //Chụp ảnh và nhận diện
  const handleCapture = () => {
    if (!isCameraActive) {
      startCamera();
      return;
    }

    setIsScanning(true);
    setCurrentResults([]);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setIsScanning(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((imageBlob) => {
      if (!imageBlob) {
        toast.error("Lỗi khi chụp ảnh!");
        setIsScanning(false);
        return;
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", imageBlob, "diemdanh.jpg");

      fetch(`${API_BASE_URL}/ai-vision/identify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Nhận diện lỗi");
          return res.json();
        })
        .then((data) => {
          console.log("AI trả về:", data);

          const faceArray = Array.isArray(data) ? data : data.data || [];

          if (faceArray.length === 0) {
            toast.error(
              "AI không tìm thấy khuôn mặt nào. Hãy nhìn thẳng vào camera.",
            );
            return;
          }

          const mappedResults = [];

          faceArray.forEach((aiFace) => {
            // AI trả về faceId → tra ngược vào allStudents để lấy thông tin
            const aiFaceId = aiFace.faceId || aiFace.id;

            const realStudent = allStudents.find(
              (sv) => sv.faceId === aiFaceId,
            );

            if (realStudent) {
              // Tránh thêm trùng sinh viên nếu AI trả về nhiều kết quả
              const isDuplicate = mappedResults.some(
                (r) => r.studentId === realStudent.studentCode,
              );
              if (!isDuplicate) {
                mappedResults.push({
                  studentName: realStudent.fullName,
                  studentId: realStudent.studentCode,
                  similarity: Math.round(aiFace.similarity || 99),
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
        .catch((err) => {
          console.error("Lỗi:", err);
          toast.error("Lỗi nhận diện. Vui lòng thử lại.");
        })
        .finally(() => setIsScanning(false));
    }, "image/jpeg");
  };
  //End Chụp ảnh và nhận diện


  const handleCancelSingle = (studentId) => {
    setCurrentResults((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  //Xác nhận Điểm danh và lưu dB
  const handleConfirmSingle = (student) => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/attendances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentCode: student.studentId,
        classId: selectedClassId,
        status: "Present",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi");
        toast.success(`Đã điểm danh: ${student.studentName}`);
      })
      .catch(() => {
        toast.success(`Đã xác nhận UI: ${student.studentName} (Chờ API)`);
      })
      .finally(() => {
        setCurrentResults((prev) =>
          prev.filter((s) => s.studentId !== student.studentId),
        );
      });
  };
  //End Xác nhận Điểm danh và lưu dB

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
              }}
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.courseCode || item.courseId} - {item.courseName}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down select-icon"></i>
          </div>
        </div>
        <div className="class-info-sub">
          <p className="label">Ca học và nhóm</p>
          <p className="value">
            {currentClassInfo
              ? `Nhóm ${currentClassInfo.group || currentClassInfo.groupNumber}`
              : "Đang tải..."}
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
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
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
            <div className="indicator"></div> Thông tin nhận diện
          </h3>
          {currentResults.length === 0 ? (
            <div className="empty-result-state">
              <i className="fa-solid fa-users-viewfinder"></i>
              <p>Hệ thống sẵn sàng</p>
            </div>
          ) : (
            <div className="students-list-scroller">
              {currentResults.map((student, index) => (
                <div
                  className="student-result-item"
                  key={student.studentId || index}
                >
                  <div className="info-row">
                    <div className="info-left">
                      <p className="id-text">
                        MSSV: <strong>{student.studentId}</strong>
                      </p>
                      <h2 className="name">{student.studentName}</h2>
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
