import React, { useState } from "react";
import Button from "../components/Button";
import "../src/index.css";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/Supabase/auth/signin";
import { resetPassword } from "../utils/Supabase/auth/resetpassword";
import { useAuthUser } from "../utils/Supabase/Auth/useAuthUser";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthUser();

  // Email and password validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!isEmailValid) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    if (!isPasswordValid) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      setSuccess(true);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");
    setResetSent(false);
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-xl text-(--primeColor)">جاري التحميل...</span>
      </div>
    );
  }
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/90 dark:bg-(--backgroundColor)/90 rounded-3xl shadow-2xl border border-(--borderColor) backdrop-blur-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            أنت بالفعل مسجل الدخول
          </h2>
          <p className="mb-4">
            يرجى تسجيل الخروج أولاً إذا كنت تريد استخدام حساب آخر.
          </p>
          <Button
            adj="w-full py-3 rounded-xl bg-gradient-to-tr from-[var(--primeColor)] to-emerald-400 text-white font-bold text-lg shadow-lg hover:brightness-110 transition-all"
            onClick={() => (window.location.href = "/")}
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-(--primeColor)/10 via-(--fillColor)/60 to-(--backgroundColor)"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 dark:bg-(--backgroundColor)/90 rounded-3xl shadow-2xl border border-(--borderColor) backdrop-blur-lg">
        <div className="flex flex-col items-center gap-2" dir="rtl">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-(--primeColor)/80 to-(--fillColor)/80 shadow-lg mb-2">
            <Lock size={32} className="text-white drop-shadow" />
          </span>
          <h2
            className="text-3xl font-extrabold text-center text-(--primeColor) tracking-tight"
            dir="rtl"
          >
            تسجيل الدخول
          </h2>
          <p className="text-sm text-center text-(--textMuted)" dir="rtl">
            مرحبًا بعودتك! الرجاء تسجيل الدخول للمتابعة.
          </p>
        </div>
        <form className="space-y-6 mt-4" onSubmit={handleSubmit} dir="rtl">
          <div className="relative">
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--primeColor) opacity-70"
              size={20}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-(--borderColor) bg-(--fillColor) text-(--textColor) focus:outline-none focus:ring-2 focus:ring-(--primeColor) shadow-sm transition"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              dir="rtl"
            />
          </div>
          <div className="relative flex items-center">
            <Lock
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--primeColor) opacity-70 pointer-events-none"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-(--borderColor) bg-(--fillColor) text-(--textColor) focus:outline-none focus:ring-2 focus:ring-(--primeColor) shadow-sm transition password-input-with-icon"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
              dir="rtl"
            />
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--primeColor) opacity-70 hover:opacity-100 transition focus:outline-none"
              tabIndex={0}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm" dir="rtl">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600" dir="rtl">
              تم تسجيل الدخول بنجاح
            </p>
          )}
          {resetSent && (
            <p className="text-green-600" dir="rtl">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            </p>
          )}
          <Button
            type="submit"
            adj="w-full py-3 rounded-xl bg-gradient-to-tr from-[var(--primeColor)] to-emerald-400 text-white font-bold text-lg shadow-lg hover:brightness-110 transition-all"
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        <div className="text-center pt-2 flex flex-col gap-2" dir="rtl">
          <span className="text-sm text-(--textMuted)">
            ليس لديك حساب؟{" "}
            <a
              href="/signup"
              className="text-(--primeColor) font-semibold hover:underline bg-transparent border-0 p-0 m-0"
            >
              إنشاء حساب جديد
            </a>
          </span>
          <button
            type="button"
            className="text-xs  text-(--primeColor) hover:underline mt-2"
            onClick={handleReset}
            disabled={loading || !email}
          >
            نسيت كلمة المرور؟
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
