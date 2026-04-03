import { useState, useEffect, useMemo } from "react";
import { SquarePen, Plus, CreditCard, StickyNote } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSalaries } from "../../utils/ReactQuerry/Salaries/useGetSalaries";
import { useUpdateSalaryNote } from "../../utils/ReactQuerry/Salaries/useUpdateSalaries";
import SalaryModal from "./SalariesModal";

interface SalaryRecord {
  payment_id: number;
  sponsor_name: string;
  orphan_name: string;
  amount: number;
  payment_date: string;
  status: "مدفوع" | "قيد الانتظار" | "متوقف";
  note?: string;
}

// 1. Define Filter Options for Salaries
const SALARY_FILTERS = [
  { label: "مدفوع", value: "paid" },
  { label: "قيد الانتظار", value: "pending" },
  { label: "متوقف", value: "stopped" },
];

function SalariesTableContent() {
  const { data: salaries, isLoading, isError } = useGetSalaries();
  const { updateNote } = useUpdateSalaryNote();

  // 2. Extract filterValue from context
  const { searchQuery, filterValue, setIsModalOpen, editItem, setEditItem } =
    DataTable.useContext();

  const [notes, setNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    if (salaries) {
      const initialNotes: Record<number, string> = {};
      salaries.forEach((s: SalaryRecord) => {
        initialNotes[s.payment_id] = s.note || "";
      });
      setNotes(initialNotes);
    }
  }, [salaries]);

  // 3. Combined Filtering Logic
  const filteredSalaries = useMemo(() => {
    let data: SalaryRecord[] = salaries || [];

    // A. Apply Search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      data = data.filter(
        (s) =>
          s.sponsor_name?.toLowerCase().includes(query) ||
          s.orphan_name?.toLowerCase().includes(query),
      );
    }

    // B. Apply Dropdown Filter
    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "paid":
          data = data.filter((s) => s.status === "مدفوع");
          break;
        case "pending":
          data = data.filter((s) => s.status === "قيد الانتظار");
          break;
        case "stopped":
          data = data.filter((s) => s.status === "متوقف");
          break;
        default:
          break;
      }
    }

    return data;
  }, [salaries, searchQuery, filterValue]);

  const handleAction = (salary: SalaryRecord) => {
    setEditItem(salary);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <DataTable.Error message=" حدث خطأ بتحميل البيانات" />;

  return (
    <>
      <DataTable.ModalWrapper>
        <SalaryModal
          setIsModel={(val) => setIsModalOpen(!!val)}
          onSuccess={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل أو اليتيم..." />

        {/* 4. Filter Component Added Here */}
        <DataTable.Filter label="حالة الدفع" options={SALARY_FILTERS} />

        {/* Total sum display */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--fillColor)] rounded-xl border border-[var(--borderColor)]">
          <CreditCard size={18} className="text-[var(--primeColor)]" />
          <span className="text-sm font-bold">
            السجلات المعروضة: {filteredSalaries.length}
          </span>
        </div>
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>
              الأطراف (كفيل/يتيم)
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              المبلغ
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              التاريخ
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الإجراءات
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="w-1/4 min-w-[150px]">
              الملاحظات
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredSalaries}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد رواتب تطابق هذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(salary: SalaryRecord) => (
            <DataTable.TableRow key={salary.payment_id}>
              <DataTable.TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[var(--textColor)] truncate max-w-[150px]">
                    {salary.sponsor_name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--textMuted)]">
                    <span className="bg-[var(--fillColor)] px-1 rounded">
                      يتيم:
                    </span>
                    <span className="truncate">{salary.orphan_name}</span>
                  </div>
                  <span className="md:hidden text-xs font-bold text-[var(--primeColor)]">
                    {salary.amount?.toLocaleString()} د.ع
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono font-bold">
                {salary.amount?.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)]">
                {salary.payment_date || "—"}
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${
                      salary.status === "مدفوع"
                        ? "bg-[var(--fillColor)] text-[var(--primeColor)] border-[var(--successColor)]"
                        : salary.status === "قيد الانتظار"
                          ? "bg-[var(--fillColor)] text-[var(--errorColor)] border-[var(--errorColor)]"
                          : "bg-[var(--fillColor)] text-[var(--errorColor)] border-[var(--errorColor)]"
                    }`}
                  >
                    {salary.status}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center items-center gap-2 md:gap-4">
                  <button
                    onClick={() => handleAction(salary)}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--primeColor)]/10 rounded-lg transition-all"
                    title="معالجة"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => handleAction(salary)}
                    className="p-2 text-[var(--textMuted2)] hover:bg-[var(--fillColor)] rounded-lg transition-all"
                    title="تعديل"
                  >
                    <SquarePen size={18} />
                  </button>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="relative group">
                  <textarea
                    rows={1}
                    className="w-full text-xs text-[var(--textColor)] bg-[var(--borderColor)] border border-transparent rounded-lg px-2 py-2 
                      hover:border-[var(--primeColor)] focus:bg-[var(--fillColor)] focus:border-[var(--primeColor)] 
                      focus:ring-2 focus:ring-[var(--primeColor)]/10 resize-none overflow-hidden"
                    value={notes[salary.payment_id] || ""}
                    placeholder="ملاحظة..."
                    maxLength={90}
                    onChange={(e) => {
                      setNotes((prev) => ({
                        ...prev,
                        [salary.payment_id]: e.target.value,
                      }));
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={() =>
                      updateNote({
                        id: salary.payment_id,
                        note: notes[salary.payment_id] || "",
                      })
                    }
                  />
                  <StickyNote
                    size={12}
                    className="absolute left-2 top-2.5 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity"
                  />
                </div>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        count={filteredSalaries.length}
        total={salaries?.length || 0}
      />
    </>
  );
}

export default function SalariesTable() {
  return (
    <DataTable.Root>
      <SalariesTableContent />
    </DataTable.Root>
  );
}
