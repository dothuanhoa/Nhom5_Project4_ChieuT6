import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ArrowRight,
  Smile,
  AtSign,
} from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Đăng nhập thành công!");
        const userData = JSON.parse(localStorage.getItem("user"));
        navigate(userData?.role === "admin" ? "/admin" : "/teacher");
      } else {
        setError("Email hoặc mật khẩu không đúng");
        toast.error("Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại");
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 2xl:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-[#083c96] rounded-2xl flex items-center justify-center mb-4">
              <Smile className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#083c96] mb-2 tracking-tight">
              Ứng Dựng Điểm Danh
            </h1>
            <p className="text-[15px] text-gray-500">
              Chào mừng bạn quay trở lại ứng dụng
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide"
              >
                Email
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all"
                  placeholder="nguyenvan@facecheck.vn"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wide"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#f4f4f5] text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#083c96] transition-all"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#083c96] border-gray-300 rounded focus:ring-[#083c96]"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>

              <a
                href="#"
                className="text-sm text-[#083c96] font-semibold hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#083c96] text-white py-3.5 rounded-xl font-semibold hover:bg-blue-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Hỗ trợ
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Gặp sự cố khi đăng nhập?{" "}
              <a
                href="#"
                className="text-[#083c96] font-semibold hover:underline"
              >
                Liên hệ hỗ trợ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
