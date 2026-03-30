import React, { useState, useEffect } from "react";
import Button from "../components/Button";

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

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">
          {initialData ? "تعديل مستخدم" : "إضافة مستخدم"}
        </h2>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="الاسم الكامل"
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="البريد الإلكتروني"
          className="border p-2 rounded"
          type="email"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="user">مستخدم</option>
          <option value="admin">مشرف</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            adj="bg-(--primeColor) text-white px-4 py-2 rounded hover:bg-(--primeColor)/90"
          >
            {initialData ? "تحديث" : "إضافة"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            adj="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}
