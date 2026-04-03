import { useState } from "react";
import { updatePassword } from "../utils/Supabase/Auth/updatePassword";
import { Lock, AlertCircle } from "lucide-react";
import Button from "../components/Button";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("يرجى إدخال كلمة المرور الجديدة");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

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
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-xs text-[var(--textMuted)]">
            أدخل كلمة المرور الجديدة لتحديث حسابك
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Lock
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60"
              size={18}
            />
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              autoComplete="new-password"
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--primeColor)] opacity-60"
              size={18}
            />
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200"
              autoComplete="new-password"
            />
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
                تم تحديث كلمة المرور بنجاح
              </p>
            </div>
          )}
          <Button
            type="submit"
            adj="w-full py-2.5 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
            disabled={loading}
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </Button>
        </form>
      </div>
    </div>
  );
}
