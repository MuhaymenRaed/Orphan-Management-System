import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import "../src/index.css";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/Supabase/Auth/signin";
import { resetPassword } from "../utils/Supabase/Auth/resetPassword";
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

  // Redirect to home once the AuthProvider confirms the user is logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    if (!isEmailValid) {
      setError("يرجى إدخال بريد إلكتروني صحيح (مثال: name@email.com)");
      return;
    }
    if (!password) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }
    if (!isPasswordValid) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      setSuccess(true);
      // AuthProvider's onAuthStateChange will update user state,
      // and App.tsx will redirect authenticated users automatically.
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");
    setResetSent(false);
    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني أولاً لإعادة تعيين كلمة المرور");
      return;
    }
    if (!isEmailValid) {
      setError("يرجى إدخال بريد إلكتروني صحيح لإرسال رابط إعادة التعيين");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ في إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primeColor)] border-t-transparent" />
      </div>
    );
  }
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="w-full max-w-md p-8 space-y-6 bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] text-center animate-fadeIn"
          dir="rtl"
        >
          <h2 className="text-xl font-bold text-[var(--primeColor)]">
            أنت بالفعل مسجل الدخول
          </h2>
          <p className="text-sm text-[var(--textMuted)]">
            يرجى تسجيل الخروج أولاً إذا كنت تريد استخدام حساب آخر.
          </p>
          <Button
            adj="w-full py-2.5 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:brightness-105 transition-all"
            onClick={() => navigate("/")}
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
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--primeColor)]/5 via-[var(--fillColor)]/40 to-[var(--backgroundColor)]"
    >
      <div className="w-full max-w-md p-7 md:p-8 space-y-6 bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] animate-fadeIn">
        <div className="flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primeColor)]/10 mb-1">
            <Lock size={28} className="text-[var(--primeColor)]" />
          </span>
          <h2 className="text-2xl font-bold text-[var(--textColor)]">
            تسجيل الدخول
          </h2>
          <p className="text-xs text-[var(--textMuted)]">
            مرحبًا بعودتك! الرجاء تسجيل الدخول للمتابعة.
          </p>
        </div>
        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60"
              size={18}
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="relative flex items-center">
            <Lock
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60 pointer-events-none"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full px-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--textMuted)] hover:text-[var(--primeColor)] transition-colors"
              tabIndex={-1}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--errorColor)]/10 border border-[var(--errorColor)]/20">
              <AlertCircle
                size={16}
                className="text-[var(--errorColor)] shrink-0"
              />
              <p className="text-[var(--errorColor)] text-xs">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-[var(--successColor)]/10 border border-[var(--successColor)]/20">
              <p className="text-[var(--successColor)] text-xs">
                تم تسجيل الدخول بنجاح
              </p>
            </div>
          )}
          {resetSent && (
            <div className="p-3 rounded-xl bg-[var(--successColor)]/10 border border-[var(--successColor)]/20">
              <p className="text-[var(--successColor)] text-xs">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
              </p>
            </div>
          )}
          <Button
            type="submit"
            adj="w-full py-2.5 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
        <div className="text-center flex flex-col gap-1.5">
          <span className="text-xs text-[var(--textMuted)]">
            ليس لديك حساب؟{" "}
            <a
              href="/signup"
              className="text-[var(--primeColor)] font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </a>
          </span>
          <button
            type="button"
            className="text-xs text-[var(--primeColor)] hover:underline disabled:opacity-50 disabled:no-underline"
            onClick={handleReset}
            disabled={loading}
          >
            نسيت كلمة المرور؟
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
