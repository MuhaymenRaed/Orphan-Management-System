import { useState } from "react";
import { updatePassword } from "../utils/Supabase/Auth/updatePassword";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">إعادة تعيين كلمة المرور</h2>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600">تم تحديث كلمة المرور بنجاح</p>
        )}
        <button
          type="submit"
          className="bg-[var(--primeColor)] text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>
      </form>
    </div>
  );
}
