import React from "react";
import Button from "../components/Button";
import "../src/index.css";

import { UserPlus, Mail, Lock } from "lucide-react";

import { useState } from "react";
import { signUp } from "../utils/Supabase/auth/signup";
import { Eye, EyeOff } from "lucide-react";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await signUp({ email, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-(--primeColor)/10 via-(--fillColor)/60 to-(--backgroundColor)">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 dark:bg-(--backgroundColor)/90 rounded-3xl shadow-2xl border border-(--borderColor) backdrop-blur-lg">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-(--primeColor)/80 to-(--fillColor)/80 shadow-lg mb-2">
            <UserPlus size={32} className="text-white drop-shadow" />
          </span>
          <h2 className="text-3xl font-extrabold text-center text-(--primeColor) tracking-tight">
            إنشاء حساب جديد
          </h2>
          <p className="text-sm text-center text-(--textMuted)">
            ابدأ رحلتك معنا! الرجاء تعبئة البيانات لإنشاء حسابك.
          </p>
        </div>
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          <div className="relative">
            <UserPlus
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--primeColor) opacity-70"
              size={20}
            />
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-(--borderColor) bg-(--fillColor) text-(--textColor) focus:outline-none focus:ring-2 focus:ring-(--primeColor) shadow-sm transition"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
              autoComplete="new-password"
              style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600">
              تم إرسال رابط التحقق إلى بريدك الإلكتروني
            </p>
          )}
          <Button
            type="submit"
            adj="w-full py-3 rounded-xl bg-gradient-to-tr from-[var(--primeColor)] to-emerald-400 text-white font-bold text-lg shadow-lg hover:brightness-110 transition-all"
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </Button>
        </form>
        <div className="text-center pt-2">
          <span className="text-sm text-(--textMuted)">
            لديك حساب بالفعل؟{" "}
            <Button
              type="button"
              adj="text-(--primeColor) font-semibold hover:underline bg-transparent p-0 m-0 shadow-none"
              onClick={() => (window.location.href = "/signin")}
            >
              تسجيل الدخول
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
