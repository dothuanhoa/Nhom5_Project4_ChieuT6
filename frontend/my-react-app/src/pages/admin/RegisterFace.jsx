import React from "react";
import {
  Upload,
  Camera,
  Lock,
  CheckCircle2,
  Info,
  IdCard,
  ChevronDown,
  Loader2,
} from "lucide-react";
import useFaceRegistration from "../../hooks/useFaceRegistration";

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
    <div className="font-sans space-y-6">
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#083c96] mb-1 tracking-tight">
          Đăng ký Khuôn mặt Mới
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Thông tin định danh */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} id="registration-form">
            <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <IdCard className="w-6 h-6 text-[#083c96]" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-900">
                  Thông tin định danh
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Mã sinh viên
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/50 transition-all font-medium"
                    placeholder="Ví dụ: SV123456"
                    required
                    disabled={registrationStatus === "processing"}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/50 transition-all font-medium"
                    placeholder="Nhập tên đầy đủ"
                    required
                    disabled={registrationStatus === "processing"}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Face ID Token
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.faceId}
                      className="w-full px-4 py-3.5 bg-gray-100 text-gray-500 rounded-xl outline-none font-mono text-sm tracking-wide"
                      placeholder="FC_STUDENT_8892_PROX"
                      disabled
                      readOnly
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Trạng thái
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96]/50 transition-all appearance-none font-medium"
                      disabled={registrationStatus === "processing"}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Ngưng hoạt động</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="flex gap-4">
            <button
              form="registration-form"
              type="submit"
              className="flex-1 bg-[#083c96] text-white py-3.5 rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md"
              disabled={registrationStatus === "processing" || !image}
            >
              {registrationStatus === "processing" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : null}
              Đăng ký khuôn mặt
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
              disabled={registrationStatus === "processing"}
            >
              Hủy
            </button>
          </div>
        </div>

        {/* Cột phải: Khung hiển thị máy ảnh */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-[#083c96]" strokeWidth={2.5} />
                <h3 className="text-lg font-bold text-gray-900">
                  Đăng ký khuôn mặt
                </h3>
              </div>
            </div>

            {/* Camera Preview Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !image && fileInputRef.current?.click()}
              className={`relative w-full aspect-[16/9] md:aspect-[3/2] rounded-2xl overflow-hidden bg-[#1e293b] mb-6 flex items-center justify-center ${
                !image
                  ? "cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#083c96]"
                  : ""
              }`}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Face Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[8px] border-black/40 pointer-events-none rounded-2xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[45%] h-[75%] border border-[#2563eb] rounded-[100px] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none opacity-20">
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full h-[1px] bg-white"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-20">
                    <div className="h-full w-[1px] bg-white"></div>
                    <div className="h-full w-[1px] bg-white"></div>
                  </div>

                  {registrationStatus === "processing" && (
                    <div className="absolute inset-x-8 bottom-8 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-bold">
                          Đang xử lý khuôn mặt...
                        </span>
                        <span className="text-white text-sm font-bold">
                          {progress}% hoàn tất
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center relative z-10">
                  <Camera
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                    strokeWidth={1.5}
                  />
                  <p className="text-gray-300 font-medium">
                    Nhấn hoặc kéo thả ảnh vào đây
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                disabled={registrationStatus === "processing"}
              >
                <Upload className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                Tải ảnh lên
              </button>
            </div>
          </div>

          <div className="bg-[#f0f4f8] rounded-3xl p-6 border border-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-[#083c96]" strokeWidth={2.5} />
              <h4 className="font-bold text-[#083c96]">
                Hướng dẫn lấy mẫu chuẩn
              </h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2
                  className="w-4 h-4 text-[#083c96] flex-shrink-0"
                  strokeWidth={2.5}
                />
                Đảm bảo khuôn mặt nằm trong khung tròn chỉ dẫn.
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2
                  className="w-4 h-4 text-[#083c96] flex-shrink-0"
                  strokeWidth={2.5}
                />
                Giữ biểu cảm tự nhiên, không đeo kính râm hoặc khẩu trang.
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <CheckCircle2
                  className="w-4 h-4 text-[#083c96] flex-shrink-0"
                  strokeWidth={2.5}
                />
                Môi trường có đủ ánh sáng, không có bóng đổ gắt trên mặt.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
