import { useState } from "react";
import { DataTable } from "../components/CompoundTable";
import { useGetUsers } from "../utils/ReactQuerry/Users/useGetUsers";
import { useAddUser } from "../utils/ReactQuerry/Users/useAddUser";
import { useUpdateUser } from "../utils/ReactQuerry/Users/useUpdateUser";
import { useDeleteUser } from "../utils/ReactQuerry/Users/useDeleteUser";
import UserModal from "./UserModal";
import CheckPopup from "./checkPopup";
import { SquarePen, Trash2, Mail, UserCheck, ShieldCheck } from "lucide-react";

const FILTER_OPTIONS = [
  { label: "كل الحالات", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "مدير عام",
  orphans_admin: "مسؤول الأيتام",
  sponsors_admin: "مسؤول الكفلاء",
  admin: "مشرف",
  user: "مستخدم",
};

const ROLE_STYLES: Record<string, string> = {
  super_admin:
    "bg-[var(--warningColor)]/10 text-[var(--warningColor)] border-[var(--warningColor)]/30",
  orphans_admin:
    "bg-[var(--primeColor)]/10 text-[var(--primeColor)] border-[var(--primeColor)]/30",
  sponsors_admin:
    "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]/30",
  admin: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  user: "bg-[var(--fillColor)] text-[var(--textMuted2)] border-[var(--borderColor)]",
};

function UsersTableContent() {
  const { data, error, isLoading } = useGetUsers();
  const { searchQuery, filterValue } = DataTable.useContext();
  const users: any[] = Array.isArray(data) ? data : [];

  // CRUD modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Filter and search logic
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterValue === "all" || user.status === filterValue;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error message="حدث خطأ عند تحميل المستخدمين" />;

  // Handlers

  const handleEdit = (user: any) => {
    setEditUser(user);
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => setDeleteConfirm(null),
      onError: () => setDeleteConfirm(null),
    });
  };
  const handleSubmit = (user: any) => {
    if (editUser) {
      updateUserMutation.mutate({ id: editUser.id, updates: user });
    } else {
      addUserMutation.mutate(user);
    }
    setModalOpen(false);
  };

  const getRoleKey = (user: any) => user.role || user.app_role || "user";

  return (
    <>
      {deleteConfirm !== null && (
        <CheckPopup
          onClick={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن مستخدم..." />
        <DataTable.Filter label="تصفية حسب الحالة" options={FILTER_OPTIONS} />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>المستخدم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              البريد الإلكتروني
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الدور</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              تاريخ الإنشاء
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الإجراءات
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>
        <DataTable.TableBody
          data={filteredUsers}
          emptyMessage={
            filterValue !== "all"
              ? "لا يوجد مستخدمون لهذا الفلتر"
              : "لا يوجد مستخدمون"
          }
          renderRow={(user: any) => (
            <DataTable.TableRow key={user.id}>
              <DataTable.TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primeColor)]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[var(--primeColor)]">
                      {user.full_name?.charAt(0) || "؟"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-[var(--textColor)]">
                      {user.full_name}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--textMuted)] md:hidden">
                      <Mail size={10} />
                      <span className="truncate max-w-[140px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </DataTable.TableCell>
              <DataTable.TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2 text-xs text-[var(--textColor)]/80">
                  <Mail size={12} className="text-[var(--primeColor)]" />
                  <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
              </DataTable.TableCell>
              <DataTable.TableCell>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${ROLE_STYLES[getRoleKey(user)] || ROLE_STYLES.user}`}
                >
                  <ShieldCheck size={11} />
                  {ROLE_LABELS[getRoleKey(user)] || getRoleKey(user)}
                </span>
              </DataTable.TableCell>
              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      user.status === "active"
                        ? "bg-[var(--fillColor)] text-[var(--primeColor)] border-[var(--primeColor)]"
                        : "bg-[var(--fillColor)] text-[var(--errorColor)] border-[var(--errorColor)]"
                    }`}
                  >
                    <UserCheck
                      size={10}
                      className={user.status === "active" ? "block" : "hidden"}
                    />
                    {user.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </DataTable.TableCell>
              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)] text-xs">
                {user.created_at &&
                  new Date(user.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </DataTable.TableCell>
              <DataTable.TableCell>
                <div className="flex justify-center items-center gap-2 md:gap-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--borderColor)] rounded-lg transition-colors"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user.id)}
                    className="p-2 text-[var(--errorColor)] hover:bg-[var(--borderColor)] rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        count={filteredUsers.length}
        total={users.length}
      />

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editUser}
      />
    </>
  );
}

export default function UsersTable() {
  return (
    <DataTable.Root>
      <UsersTableContent />
    </DataTable.Root>
  );
}
