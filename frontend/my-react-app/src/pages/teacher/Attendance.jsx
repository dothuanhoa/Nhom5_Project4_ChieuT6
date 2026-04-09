import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// =======================================================================
// HÀM GIẢ LẬP GỌI API (MOCK API)
// =======================================================================
const recognizeFaceAPI = async (imageBase64) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockDatabase = [
    { studentId: "SV20240982", studentName: "LÊ HOÀNG NAM", shortName: "LN" },
    { studentId: "SV20241105", studentName: "TRẦN MINH TÂM", shortName: "TT" },
    { studentId: "SV20240731", studentName: "PHẠM THÙY LINH", shortName: "PL" },
    {
      studentId: "SV20240812",
      studentName: "NGUYỄN QUỐC ANH",
      shortName: "NA",
    },
  ];

  const randomStudent =
    mockDatabase[Math.floor(Math.random() * mockDatabase.length)];

  return {
    success: true,
    data: {
      studentId: randomStudent.studentId,
      studentName: randomStudent.studentName,
      shortName: randomStudent.shortName,
      similarity: (Math.random() * (99.9 - 95.0) + 95.0).toFixed(1),
    },
  };
};

export default function Attendance() {
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  const videoRef = useRef(null);

  // Khởi động Camera khi vào trang
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Không thể truy cập Camera. Vui lòng kiểm tra quyền.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Logic khi bấm "NHẬN DIỆN"
  const handleCaptureAndAttend = async () => {
    if (!stream) {
      toast.error("Camera chưa sẵn sàng!");
      return;
    }

    setIsScanning(true);
    setCurrentResult(null);

    try {
      const base64Image = "base64_string_cua_anh..."; // Fake data
      const response = await recognizeFaceAPI(base64Image);

      if (response.success) {
        setCurrentResult(response.data);
      } else {
        toast.error("Không nhận diện được khuôn mặt.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến máy chủ AI.");
    } finally {
      setIsScanning(false);
    }
  };

  const confirmAttendance = () => {
    if (!currentResult) return;
    toast.success(`Điểm danh thành công: ${currentResult.studentName}`);
    setCurrentResult(null);
  };

  // THÊM HÀM NÀY VÀO
  const handleRescan = () => {
    setCurrentResult(null);
  };

  return (
    <div className="font-sans flex flex-col h-full bg-[#f8fafc]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
        <div className="relative group cursor-pointer flex items-center gap-2">
          <h1 className="text-[28px] font-bold text-[#083c96] tracking-tight">
            CS101 - Cơ sở dữ liệu
          </h1>
          <ChevronDown className="w-6 h-6 text-[#083c96]" />
        </div>

        <div className="text-left md:text-right mt-2 md:mt-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            THÔNG TIN BUỔI HỌC
          </p>
          <p className="text-sm font-bold text-gray-800">
            Ca 2 (09:00 - 11:30) • Phòng A2-302
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left: Camera Container */}
        <div className="lg:col-span-7 flex flex-col relative bg-black rounded-3xl overflow-hidden shadow-md">
          {/* Badge Trạng thái Camera */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full z-10">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span className="text-white text-[11px] font-bold tracking-widest">
              LIVE HD
            </span>
          </div>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Vùng Focus Nhận Diện */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-80 flex flex-col items-center justify-center">
              {/* Khung Viền Focus */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl"></div>

              {/* Các góc trang trí */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>

              {/* Icon / Trạng thái bên trong */}
              <div className="text-center bg-black/40 p-4 rounded-full backdrop-blur-sm">
                {isScanning ? (
                  <Loader2 size={48} className="text-blue-400 animate-spin" />
                ) : (
                  <Camera
                    size={48}
                    className="text-blue-400 opacity-80"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <p className="text-gray-400 mt-4 text-xl font-medium tracking-wider opacity-60">
                Please run iVCam
              </p>
            </div>
          </div>

          {/* Nút Nhận Diện (Dưới cùng Camera) */}
          <div className="absolute bottom-8 w-full flex justify-center z-10">
            <button
              onClick={handleCaptureAndAttend}
              disabled={isScanning}
              className="flex flex-col items-center justify-center w-40 h-16 bg-[#083c96] hover:bg-blue-800 text-white rounded-xl shadow-lg transition-all disabled:opacity-70"
            >
              <Camera size={20} className="mb-1" />
              <span className="text-[12px] font-black uppercase tracking-widest">
                {isScanning ? "ĐANG XỬ LÝ" : "NHẬN DIỆN"}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Kết quả Nhận diện */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col relative">
          <h3 className="text-lg font-black text-gray-950 flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-[#083c96] rounded-full"></div>
            KẾT QUẢ
          </h3>

          {/* Trạng thái chờ / Đang quét */}
          {!currentResult && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              {isScanning ? (
                <>
                  <Loader2
                    size={64}
                    className="animate-spin text-blue-500 mb-4"
                  />
                  <p className="font-semibold tracking-wide text-gray-500 uppercase">
                    Đang đối chiếu dữ liệu...
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle
                    size={64}
                    strokeWidth={1}
                    className="mb-4 opacity-50"
                  />
                  <p className="font-medium text-center text-gray-400">
                    Hướng mặt vào khung hình và bấm <br />
                    <b>NHẬN DIỆN</b> để điểm danh
                  </p>
                </>
              )}
            </div>
          )}

          {/* Hiển thị kết quả */}
          {currentResult && !isScanning && (
            <div className="flex-1 flex flex-col w-full animate-in fade-in zoom-in duration-300">
              {/* Box Ảnh */}
              <div className="flex justify-center gap-6 mb-8 w-full">
                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    DỮ LIỆU GỐC
                  </p>
                  <div className="w-28 h-28 rounded-2xl bg-[#d93800] text-white flex items-center justify-center text-4xl font-black shadow-lg">
                    {currentResult.shortName}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    ẢNH QUÉT ĐƯỢC
                  </p>
                  <div className="w-28 h-28 rounded-2xl border-[3px] border-[#2563eb] bg-blue-50 flex items-center justify-center shadow-lg">
                    <UserCheck
                      size={48}
                      className="text-[#2563eb] opacity-40"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </div>

              {/* Tên sinh viên */}
              <div className="text-center mb-6 w-full">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  SINH VIÊN
                </p>
                <h2 className="text-[28px] font-black text-gray-950 uppercase tracking-tight">
                  {currentResult.studentName}
                </h2>
              </div>

              {/* Thông số (Mã + Độ chính xác) */}
              <div className="flex justify-center w-full bg-gray-50/50 py-4 rounded-2xl border border-gray-100 mb-auto">
                <div className="flex-1 text-center border-r border-gray-200">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    MÃ SỐ
                  </p>
                  <p className="text-lg font-black text-gray-900">
                    {currentResult.studentId}
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    ĐỘ CHÍNH XÁC
                  </p>
                  <p className="text-xl font-black text-[#083c96]">
                    {currentResult.similarity}%
                  </p>
                </div>
              </div>

              {/* Buttons Actions */}
              <div className="w-full flex gap-4 mt-8">
                <button
                  onClick={handleRescan}
                  className="flex items-center justify-center w-16 h-14 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
                >
                  <RotateCw size={22} strokeWidth={2.5} />
                </button>
                <button
                  onClick={confirmAttendance}
                  className="flex-1 h-14 bg-[#083c96] hover:bg-blue-900 text-white rounded-xl font-black uppercase tracking-widest shadow-md transition-all text-[13px] flex justify-center items-center gap-2"
                >
                  XÁC NHẬN <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
