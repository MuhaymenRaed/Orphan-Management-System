import React, { useState, useEffect } from "react";
import { X, UserPlus, UserPen } from "lucide-react";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: any) => void;
  initialData?: any;
}

export default function UserModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: UserModalProps) {
  const [form, setForm] = useState({
    full_name: initialData?.full_name || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
    status: initialData?.status || "active",
  });

  useEffect(() => {
    setForm({
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      role: initialData?.role || "user",
      status: initialData?.status || "active",
    });
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  const Icon = initialData ? UserPen : UserPlus;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ backgroundColor: "rgba(22, 31, 44, 0.5)" }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        className="rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp border"
        style={{
          backgroundColor: "var(--fillColor)",
          borderColor: "var(--borderColor)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between border-b"
          style={{ borderColor: "var(--borderColor)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "var(--primeColor)", color: "white" }}
            >
              <Icon size={20} />
            </div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--textColor)" }}
            >
              {initialData ? "تعديل مستخدم" : "إضافة مستخدم"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="transition-all hover:opacity-60"
            style={{ color: "var(--textMuted2)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--textMuted2)" }}
            >
              الاسم الكامل
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="الاسم الكامل"
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30"
              style={{
                backgroundColor: "var(--bgColor)",
                borderColor: "var(--borderColor)",
                color: "var(--textColor)",
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--textMuted2)" }}
            >
              البريد الإلكتروني
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="البريد الإلكتروني"
              type="email"
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30"
              style={{
                backgroundColor: "var(--bgColor)",
                borderColor: "var(--borderColor)",
                color: "var(--textColor)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                style={{ color: "var(--textMuted2)" }}
              >
                الدور
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30"
                style={{
                  backgroundColor: "var(--bgColor)",
                  borderColor: "var(--borderColor)",
                  color: "var(--textColor)",
                }}
              >
                <option value="user">مستخدم</option>
                <option value="admin">مشرف</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                style={{ color: "var(--textMuted2)" }}
              >
                الحالة
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30"
                style={{
                  backgroundColor: "var(--bgColor)",
                  borderColor: "var(--borderColor)",
                  color: "var(--textColor)",
                }}
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex gap-3 border-t"
          style={{ borderColor: "var(--borderColor)" }}
        >
          <button
            type="submit"
            className="flex-1 font-semibold py-2.5 px-6 rounded-xl text-white text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "var(--primeColor)" }}
          >
            {initialData ? "تحديث" : "إضافة"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 font-semibold py-2.5 px-6 rounded-xl border-2 text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: "var(--borderColor)",
              color: "var(--textColor)",
            }}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
