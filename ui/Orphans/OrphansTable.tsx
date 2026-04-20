import { useMemo } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { useGetOrphans } from "../../utils/ReactQuerry/Orphans/useGetOrphans";
import { useDeleteOrphans } from "../../utils/ReactQuerry/Orphans/useDeleteOrphans";
import OrphanModal from "./OrphanModal";
import { CheckPopup } from "../CheckPopup";
import { DataTable } from "../../components/CompoundTable";

// Priority color function
const getPriorityColor = (value?: number | string) => {
  const v = Math.min(Math.max(Number(value) || 0, 0), 100);
  const hue = Math.round(120 - (v / 100) * 120);
  return `hsl(${hue} 72% 38%)`;
};

// Define Orphan Type
interface Orphan {
  id: number;
  name: string;
  age: number;
  type: string;
  residence: string;
  priority: number;
  is_sponsored: boolean;
}

// 1. Define Filter Options
const FILTER_OPTIONS = [
  { label: "مكفول", value: "sponsored" },
  { label: "غير مكفول", value: "unsponsored" },
  { label: "أولوية عالية (>60%)", value: "high_priority" },
];

function OrphansTableContent() {
  const { data, error, isLoading } = useGetOrphans();
  const { deleteOrphanMutate } = useDeleteOrphans();

  // 2. Destructure filterValue from context
  const {
    searchQuery,
    filterValue, // <--- Get the filter value
    deleteConfirm,
    setDeleteConfirm,
    setIsModalOpen,
    editItem,
    setEditItem,
  } = DataTable.useContext();

  const orphans: Orphan[] = data?.orphan || [];

  // 3. Update Filtering Logic
  const filteredOrphans = useMemo(() => {
    let result = orphans;

    // A. Apply Search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (orphan) =>
          orphan.name?.toLowerCase().includes(query) ||
          orphan.type?.toLowerCase().includes(query),
      );
    }

    // B. Apply Dropdown Filter
    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "sponsored":
          result = result.filter((o) => o.is_sponsored === true);
          break;
        case "unsponsored":
          result = result.filter((o) => o.is_sponsored === false);
          break;
        case "high_priority":
          result = result.filter((o) => o.priority > 60);
          break;
        default:
          break;
      }
    }

    return result;
  }, [orphans, searchQuery, filterValue]); // Add filterValue dependency

  const handleDelete = (orphanId: number) => {
    deleteOrphanMutate(orphanId, {
      onSuccess: () => setDeleteConfirm(null),
      onError: () => setDeleteConfirm(null),
    });
  };

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error message="حدث خطأ عند تحميل البيانات" />;

  return (
    <>
      <DataTable.ModalWrapper>
        <OrphanModal
          setIsModel={(val) => setIsModalOpen(!!val)}
          onSuccess={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      {deleteConfirm !== null && (
        <CheckPopup
          onClick={() => handleDelete(deleteConfirm as number)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن يتيم..." />

        {/* 4. Add the Filter Component */}
        <DataTable.Filter label="تصفية حسب الحالة" options={FILTER_OPTIONS} />

        <DataTable.AddButton label="يتيم" />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>الاسم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              العمر
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              السكن
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الأولوية</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>حالة الكفالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الإجراءات</DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredOrphans}
          // Pass a custom empty message based on filter
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد نتائج لهذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(orphan: Orphan) => (
            <DataTable.TableRow key={orphan.id}>
              {/* Name & Type Column */}
              <DataTable.TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--textColor)]">
                    {orphan.name}
                  </span>
                  <span className="text-xs text-[var(--textMuted)] md:hidden">
                    {orphan.type}
                  </span>
                </div>
              </DataTable.TableCell>

              {/* Age */}
              <DataTable.TableCell className="hidden md:table-cell">
                {orphan.age} سنة
              </DataTable.TableCell>

              {/* Residence */}
              <DataTable.TableCell className="hidden lg:table-cell">
                {orphan.residence}
              </DataTable.TableCell>

              {/* Priority Bar */}
              <DataTable.TableCell>
                <div className="flex items-center gap-2 min-w-[80px]">
                  <div className="h-2 w-12 md:w-20 rounded-full bg-[var(--borderColor)]/30 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${orphan.priority}%`,
                        backgroundColor: getPriorityColor(orphan.priority),
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold">
                    {orphan.priority}%
                  </span>
                </div>
              </DataTable.TableCell>

              {/* Sponsorship Status */}
              <DataTable.TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    orphan.is_sponsored
                      ? "bg-[var(--borderColor)]/80 text-[var(--primeColor)] outline border-[var(--primeColor)]"
                      : "bg-[var(--borderColor)]/80 text-[var(--errorColor)] outline border-[var(--errorColor)]"
                  }`}
                >
                  {orphan.is_sponsored ? "مكفول" : "غير مكفول"}
                </span>
              </DataTable.TableCell>

              {/* Actions */}
              <DataTable.TableCell>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setEditItem(orphan);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--borderColor)] rounded-lg transition-colors"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(orphan.id)}
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
        count={filteredOrphans.length}
        total={orphans.length}
      />
    </>
  );
}

export default function OrphansTable() {
  return (
    <DataTable.Root>
      <OrphansTableContent />
    </DataTable.Root>
  );
}
