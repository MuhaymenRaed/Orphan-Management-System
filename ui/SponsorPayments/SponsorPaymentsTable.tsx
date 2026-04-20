import { useState, useEffect, useMemo } from "react";
import { SquarePen, CreditCard, StickyNote } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSponsorPayments } from "../../utils/ReactQuerry/SponsorPayments/useGetSponsorPayments";
import { useUpdateSponsorPaymentNote } from "../../utils/ReactQuerry/SponsorPayments/useUpdateSponsorPayments";
import SponsorPaymentModal from "./SponsorPaymentsModal";

interface PaymentRecord {
  id: string;
  sponsor_name: string;
  payment_target_month: string;
  expected_amount: number;
  paid_amount: number;
  extra_charity: number;
  remaining_debt: number;
  remaining: number; // paid_amount - expected_amount (positive=surplus, negative=owed)
  payment_date: string;
  status:
    | "مدفوع بالكامل"
    | "فائض"
    | "ناقص"
    | "غير مدفوع"
    | "قيد الانتظار"
    | string;
  note?: string;
}

const PAYMENT_FILTERS = [
  { label: "مدفوع بالكامل", value: "paid" },
  { label: "فائض", value: "surplus" },
  { label: "ناقص", value: "partial" },
  { label: "غير مدفوع", value: "unpaid" },
];

function SponsorPaymentsTableContent() {
  const { data: payments, isLoading, isError } = useGetSponsorPayments();
  const { updateNote } = useUpdateSponsorPaymentNote();

  const { searchQuery, filterValue, setIsModalOpen, editItem, setEditItem } =
    DataTable.useContext();

  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payments) {
      const initialNotes: Record<string, string> = {};
      payments.forEach((p: PaymentRecord) => {
        initialNotes[p.id] = p.note || "";
      });
      setNotes(initialNotes);
    }
  }, [payments]);

  const filteredPayments = useMemo(() => {
    let data: PaymentRecord[] = payments || [];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      data = data.filter((p) => p.sponsor_name?.toLowerCase().includes(query));
    }

    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "paid":
          data = data.filter((p) => p.status === "مدفوع بالكامل");
          break;
        case "surplus":
          data = data.filter((p) => p.status === "فائض");
          break;
        case "partial":
          data = data.filter((p) => p.status === "ناقص");
          break;
        case "unpaid":
          data = data.filter((p) => p.status === "غير مدفوع");
          break;
      }
    }

    return data;
  }, [payments, searchQuery, filterValue]);

  const handleAction = (payment: PaymentRecord) => {
    setEditItem(payment);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "مدفوع بالكامل":
        return "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]";
      case "فائض":
        return "bg-[var(--primeColor)]/10 text-[var(--primeColor)] border-[var(--primeColor)]";
      case "ناقص":
        return "bg-[var(--warningColor)]/10 text-[var(--warningColor)] border-[var(--warningColor)]";
      case "غير مدفوع":
        return "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border-[var(--errorColor)]";
      case "قيد الانتظار":
        return "bg-[var(--fillColor)] text-[var(--textMuted)] border-[var(--borderColor)]";
      default:
        return "bg-[var(--fillColor)] text-[var(--textMuted)] border-[var(--borderColor)]";
    }
  };

  const renderRemaining = (payment: PaymentRecord) => {
    const remaining =
      payment.remaining ?? payment.paid_amount - payment.expected_amount;
    if (payment.paid_amount === 0) {
      // Unpaid: show full expected as debt
      return (
        <span className="text-[var(--errorColor)] font-bold tabular-nums">
          −{payment.expected_amount?.toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    if (remaining > 0) {
      // Surplus: paid more than expected
      return (
        <span className="text-[var(--primeColor)] font-bold tabular-nums">
          +{remaining.toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    if (remaining < 0) {
      // Deficit: still owes
      return (
        <span className="text-[var(--errorColor)] font-bold tabular-nums">
          −{Math.abs(remaining).toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    // Exactly paid
    return (
      <span className="text-[var(--successColor)] font-bold tabular-nums">
        ✓ مسدًّد
      </span>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <DataTable.Error message="حدث خطأ بتحميل البيانات" />;

  return (
    <>
      <DataTable.ModalWrapper>
        <SponsorPaymentModal
          setIsModel={(val: boolean) => setIsModalOpen(!!val)}
          onSuccess={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل..." />
        <DataTable.Filter label="حالة الدفع" options={PAYMENT_FILTERS} />

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--fillColor)] rounded-xl border border-[var(--borderColor)]">
          <CreditCard size={18} className="text-[var(--primeColor)]" />
          <span className="text-sm font-bold">
            السجلات: {filteredPayments.length}
          </span>
        </div>
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>الكفيل</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              المبلغ المتوقع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              المبلغ المدفوع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              المتبقي
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
          data={filteredPayments}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد دفعات تطابق هذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(payment: PaymentRecord) => (
            <DataTable.TableRow key={payment.id}>
              <DataTable.TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[var(--textColor)] truncate max-w-[150px]">
                    {payment.sponsor_name || "—"}
                  </span>
                  <span className="md:hidden text-xs font-bold text-[var(--primeColor)]">
                    المدفوع: {payment.paid_amount?.toLocaleString()} د.ع
                  </span>
                  <span className="md:hidden text-[10px] text-[var(--textMuted)]">
                    المتوقع: {payment.expected_amount?.toLocaleString()} د.ع
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono font-bold">
                {payment.expected_amount?.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono font-bold text-[var(--primeColor)]">
                {payment.paid_amount?.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                {renderRemaining(payment)}
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)]">
                {payment.payment_date || "—"}
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${getStatusStyle(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAction(payment)}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--primeColor)]/10 rounded-lg transition-all"
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
                    value={notes[payment.id] || ""}
                    placeholder="ملاحظة..."
                    maxLength={90}
                    onChange={(e) => {
                      setNotes((prev) => ({
                        ...prev,
                        [payment.id]: e.target.value,
                      }));
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={() => {
                      // Skip DB update for virtual (not-yet-created) records
                      if (!payment.id?.startsWith("virtual-")) {
                        updateNote({
                          id: payment.id,
                          note: notes[payment.id] || "",
                        });
                      }
                    }}
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
        count={filteredPayments.length}
        total={payments?.length || 0}
      />
    </>
  );
}

export default function SponsorPaymentsTable() {
  return (
    <DataTable.Root>
      <SponsorPaymentsTableContent />
    </DataTable.Root>
  );
}
