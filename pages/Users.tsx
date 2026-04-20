import React from "react";
import UsersTable from "../ui/UsersTable";
import { Users as UsersIcon, ShieldCheck } from "lucide-react";
import { useGetUsers } from "../utils/ReactQuerry/Users/useGetUsers";

const Users: React.FC = () => {
  const { data } = useGetUsers();
  const users: any[] = Array.isArray(data) ? data : [];

  const activeCount = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter(
    (u) =>
      u.role === "super_admin" ||
      u.role === "admin" ||
      u.role === "orphans_admin" ||
      u.role === "sponsors_admin",
  ).length;

  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          إدارة المستخدمين
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          قائمة المستخدمين وصلاحياتهم في النظام
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--borderColor)] bg-gradient-to-bl from-[var(--fillColor)] to-[var(--backgroundColor)]">
          <div className="p-2.5 rounded-xl bg-[var(--primeColor)]/10">
            <UsersIcon size={22} className="text-[var(--primeColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي المستخدمين
            </span>
            <span className="text-lg font-bold text-[var(--textColor)]">
              {users.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--borderColor)] bg-gradient-to-bl from-[var(--fillColor)] to-[var(--backgroundColor)]">
          <div className="p-2.5 rounded-xl bg-[var(--successColor)]/10">
            <UsersIcon size={22} className="text-[var(--successColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">نشطون</span>
            <span className="text-lg font-bold text-[var(--successColor)]">
              {activeCount}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--borderColor)] bg-gradient-to-bl from-[var(--fillColor)] to-[var(--backgroundColor)]">
          <div className="p-2.5 rounded-xl bg-[var(--warningColor)]/10">
            <ShieldCheck size={22} className="text-[var(--warningColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              المشرفون
            </span>
            <span className="text-lg font-bold text-[var(--warningColor)]">
              {adminCount}
            </span>
          </div>
        </div>
      </div>

      <UsersTable />
    </div>
  );
};

export default Users;
