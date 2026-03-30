import { useState } from "react";
import { DataTable } from "../components/CompoundTable";
import { useGetUsers } from "../utils/ReactQuerry/Users/useGetUsers";
import { useAddUser } from "../utils/ReactQuerry/Users/useAddUser";
import { useUpdateUser } from "../utils/ReactQuerry/Users/useUpdateUser";
import { useDeleteUser } from "../utils/ReactQuerry/Users/useDeleteUser";
import UserModal from "./UserModal";
import Button from "../components/Button";

const FILTER_OPTIONS = [
  { label: "كل الحالات", value: "all" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

function UsersTableContent() {
  const { data, error, isLoading } = useGetUsers();
  const { searchQuery, filterValue } = DataTable.useContext();
  const users: any[] = Array.isArray(data) ? data : [];

  // CRUD modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);

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
  const handleAdd = () => {
    setEditUser(null);
    setModalOpen(true);
  };
  const handleEdit = (user: any) => {
    setEditUser(user);
    setModalOpen(true);
  };
  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف المستخدم؟")) {
      deleteUserMutation.mutate(id);
    }
  };
  const handleSubmit = (user: any) => {
    if (editUser) {
      updateUserMutation.mutate({ id: editUser.id, updates: user });
    } else {
      addUserMutation.mutate(user);
    }
    setModalOpen(false);
  };

  return (
    <>
      <DataTable.Header>
        <DataTable.SearchInput placeholder="بحث عن مستخدم..." />
        <DataTable.Filter label="تصفية حسب الحالة" options={FILTER_OPTIONS} />
        <Button
          adj="bg-(--primeColor) text-white px-4 py-2 rounded hover:bg-(--primeColor)/90"
          onClick={handleAdd}
        >
          إضافة مستخدم
        </Button>
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>الاسم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>
              البريد الإلكتروني
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الدور</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الحالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>تاريخ الإنشاء</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>إجراءات</DataTable.TableHeaderCell>
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
                <span className="font-bold text-lg text-(--primeColor)">
                  {user.full_name}
                </span>
              </DataTable.TableCell>
              <DataTable.TableCell>{user.email}</DataTable.TableCell>
              <DataTable.TableCell>
                <span className="rounded px-2 py-1 bg-(--fillColor)/60 text-xs font-semibold">
                  {user.role || user.app_role}
                </span>
              </DataTable.TableCell>
              <DataTable.TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-red-100 text-red-700 border border-red-400"
                  }`}
                >
                  {user.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </DataTable.TableCell>
              <DataTable.TableCell>
                {user.created_at &&
                  new Date(user.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </DataTable.TableCell>
              <DataTable.TableCell>
                <div className="flex gap-2">
                  <Button
                    adj="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(user)}
                  >
                    تعديل
                  </Button>
                  <Button
                    adj="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    حذف
                  </Button>
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
