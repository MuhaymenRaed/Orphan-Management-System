import React, { useState, useEffect } from "react";
import { X, UserPlus, UserPen, ShieldCheck } from "lucide-react";

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
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn"
      style={{ backgroundColor: "rgba(22, 31, 44, 0.5)" }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        className="rounded-t-2xl md:rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto flex flex-col animate-slideUp border"
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
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30 focus:border-[var(--primeColor)]"
              style={{
                backgroundColor: "var(--backgroundColor)",
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
              placeholder="example@mail.com"
              type="email"
              required
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30 focus:border-[var(--primeColor)]"
              style={{
                backgroundColor: "var(--backgroundColor)",
                borderColor: "var(--borderColor)",
                color: "var(--textColor)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: "var(--textMuted2)" }}
              >
                <ShieldCheck size={12} />
                الدور
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30 focus:border-[var(--primeColor)]"
                style={{
                  backgroundColor: "var(--backgroundColor)",
                  borderColor: "var(--borderColor)",
                  color: "var(--textColor)",
                }}
              >
                <option value="user">مستخدم</option>
                <option value="admin">مشرف</option>
                <option value="super_admin">مدير عام</option>
                <option value="orphans_admin">مسؤول الأيتام</option>
                <option value="sponsors_admin">مسؤول الكفلاء</option>
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
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2 focus:ring-[var(--primeColor)]/30 focus:border-[var(--primeColor)]"
                style={{
                  backgroundColor: "var(--backgroundColor)",
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
          className="px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 border-t mt-auto"
          style={{ borderColor: "var(--borderColor)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 font-semibold py-2.5 px-6 rounded-xl border text-sm transition-all"
            style={{
              borderColor: "var(--borderColor)",
              color: "var(--textColor)",
              backgroundColor: "var(--backgroundColor)",
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 font-semibold py-2.5 px-6 rounded-xl text-white text-sm transition-all hover:brightness-105"
            style={{ backgroundColor: "var(--primeColor)" }}
          >
            {initialData ? "تحديث" : "إضافة"}
          </button>
        </div>
      </form>
    </div>
  );
}
