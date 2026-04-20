import { useMemo } from "react";
import { useGetOrphanReceives } from "../../utils/ReactQuerry/OrphanReceives/useGetOrphanReceives";
import { DataTable } from "../../components/CompoundTable";
import { DollarSign, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface OrphanFinancialStatus {
  orphan_id: string;
  orphan_name: string;
  orphanage_base_share: number;
  expected_sponsor_share: number;
  total_monthly_target: number;
  total_actual_received: number;
  funding_status: string;
  financial_gap: number;
}

const FILTER_OPTIONS = [
  { label: "مغطى", value: "covered" },
  { label: "تمويل جزئي", value: "partial" },
  { label: "الدار فقط", value: "orphanage_only" },
];

function OrphanReceivesTableContent() {
  const { data, error, isLoading } = useGetOrphanReceives();

  const { searchQuery, filterValue } = DataTable.useContext();

  const records: OrphanFinancialStatus[] = data || [];

  const filtered = useMemo(() => {
    let result = records;

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((o) =>
        o.orphan_name?.toLowerCase().includes(query),
      );
    }

    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "covered":
          result = result.filter((o) => o.funding_status === "Covered");
          break;
        case "partial":
          result = result.filter(
            (o) => o.funding_status === "Partially Funded",
          );
          break;
        case "orphanage_only":
          result = result.filter((o) => o.funding_status === "Orphanage Only");
          break;
      }
    }

    return result;
  }, [records, searchQuery, filterValue]);

  const totalTarget = filtered.reduce(
    (s, o) => s + (o.total_monthly_target || 0),
    0,
  );
  const totalReceived = filtered.reduce(
    (s, o) => s + (o.total_actual_received || 0),
    0,
  );
  const totalGap = filtered.reduce((s, o) => s + (o.financial_gap || 0), 0);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Covered":
        return "مغطى";
      case "Partially Funded":
        return "تمويل جزئي";
      case "Orphanage Only":
        return "الدار فقط";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Covered":
        return "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]";
      case "Partially Funded":
        return "bg-[var(--warningColor)]/10 text-[var(--warningColor)] border-[var(--warningColor)]";
      case "Orphanage Only":
        return "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border-[var(--errorColor)]";
      default:
        return "bg-[var(--fillColor)] text-[var(--textMuted)] border-[var(--borderColor)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Covered":
        return <TrendingUp size={14} />;
      case "Partially Funded":
        return <Minus size={14} />;
      case "Orphanage Only":
        return <TrendingDown size={14} />;
      default:
        return null;
    }
  };

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error message="حدث خطأ عند تحميل البيانات" />;

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--primeColor)]/10">
            <DollarSign size={18} className="text-[var(--primeColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي الهدف الشهري
            </span>
            <span className="text-sm font-bold text-[var(--textColor)]">
              {totalTarget.toLocaleString()} د.ع
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--successColor)]/10">
            <TrendingUp size={18} className="text-[var(--successColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي المُستلم
            </span>
            <span className="text-sm font-bold text-[var(--successColor)]">
              {totalReceived.toLocaleString()} د.ع
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--errorColor)]/10">
            <TrendingDown size={18} className="text-[var(--errorColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي العجز
            </span>
            <span className="text-sm font-bold text-[var(--errorColor)]">
              {totalGap.toLocaleString()} د.ع
            </span>
          </div>
        </div>
      </div>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن يتيم..." />
        <DataTable.Filter label="حالة التمويل" options={FILTER_OPTIONS} />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>اسم اليتيم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              حصة الدار
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              حصة الكفلاء المتوقعة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الهدف الشهري</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              المُستلم الفعلي
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>حالة التمويل</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              العجز المالي
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filtered}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد نتائج لهذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(item: OrphanFinancialStatus) => (
            <DataTable.TableRow key={item.orphan_id}>
              <DataTable.TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--textColor)]">
                    {item.orphan_name}
                  </span>
                  <span className="text-[10px] text-[var(--textMuted)] md:hidden">
                    الهدف: {item.total_monthly_target?.toLocaleString()} د.ع
                  </span>
                  <span className="text-[10px] text-[var(--primeColor)] md:hidden">
                    المُستلم: {item.total_actual_received?.toLocaleString()} د.ع
                  </span>
                  <span
                    className={`text-[10px] md:hidden ${
                      item.financial_gap > 0
                        ? "text-[var(--errorColor)]"
                        : "text-[var(--successColor)]"
                    }`}
                  >
                    العجز: {item.financial_gap > 0 ? "-" : ""}
                    {item.financial_gap?.toLocaleString()} د.ع
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono text-sm">
                {item.orphanage_base_share?.toLocaleString()}{" "}
                <span className="text-[10px] text-[var(--textMuted)]">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono text-sm">
                {item.expected_sponsor_share?.toLocaleString()}{" "}
                <span className="text-[10px] text-[var(--textMuted)]">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <span className="font-bold text-sm text-[var(--textColor)]">
                  {item.total_monthly_target?.toLocaleString()}{" "}
                  <span className="text-[10px] font-normal text-[var(--textMuted)]">
                    د.ع
                  </span>
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                <span className="font-bold text-sm text-[var(--primeColor)]">
                  {item.total_actual_received?.toLocaleString()}{" "}
                  <span className="text-[10px] font-normal">د.ع</span>
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${getStatusStyle(item.funding_status)}`}
                >
                  {getStatusIcon(item.funding_status)}
                  {getStatusLabel(item.funding_status)}
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell">
                <span
                  className={`font-bold text-sm ${
                    item.financial_gap > 0
                      ? "text-[var(--errorColor)]"
                      : "text-[var(--successColor)]"
                  }`}
                >
                  {item.financial_gap > 0 ? "-" : ""}
                  {item.financial_gap?.toLocaleString()}{" "}
                  <span className="text-[10px] font-normal">د.ع</span>
                </span>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount count={filtered.length} total={records.length} />
    </>
  );
}

export default function OrphanReceivesTable() {
  return (
    <DataTable.Root>
      <OrphanReceivesTableContent />
    </DataTable.Root>
  );
}
