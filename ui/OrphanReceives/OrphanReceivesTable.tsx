import { useMemo } from "react";
import { useGetOrphanReceives } from "../../utils/ReactQuerry/OrphanReceives/useGetOrphanReceives";
import { DataTable } from "../../components/CompoundTable";

interface OrphanReceive {
  orphan_id: number;
  orphan_name: string;
  age: number;
  gender: string;
  orphan_type: string;
  is_sponsored: boolean;
  is_active: boolean;
  current_sponsors: number;
  sponsorship_types: string;
  active_since: string;
}

const FILTER_OPTIONS = [
  { label: "مكفول", value: "sponsored" },
  { label: "غير مكفول", value: "unsponsored" },
  { label: "نشط", value: "active" },
  { label: "غير نشط", value: "inactive" },
];

function OrphanReceivesTableContent() {
  const { data, error, isLoading } = useGetOrphanReceives();

  const { searchQuery, filterValue } = DataTable.useContext();

  const orphanReceives: OrphanReceive[] = data?.orphanReceives || [];

  const filtered = useMemo(() => {
    let result = orphanReceives;

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (o) =>
          o.orphan_name?.toLowerCase().includes(query) ||
          o.orphan_type?.toLowerCase().includes(query) ||
          o.sponsorship_types?.toLowerCase().includes(query),
      );
    }

    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "sponsored":
          result = result.filter((o) => o.is_sponsored);
          break;
        case "unsponsored":
          result = result.filter((o) => !o.is_sponsored);
          break;
        case "active":
          result = result.filter((o) => o.is_active);
          break;
        case "inactive":
          result = result.filter((o) => !o.is_active);
          break;
      }
    }

    return result;
  }, [orphanReceives, searchQuery, filterValue]);

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error message="حدث خطأ عند تحميل البيانات" />;

  return (
    <>
      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن يتيم..." />
        <DataTable.Filter label="تصفية حسب الحالة" options={FILTER_OPTIONS} />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>اسم اليتيم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              العمر
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              الجنس
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              النوع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>حالة الكفالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              عدد الكفلاء
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden xl:table-cell">
              أنواع الكفالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الحالة</DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filtered}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد نتائج لهذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(item: OrphanReceive) => (
            <DataTable.TableRow key={item.orphan_id}>
              <DataTable.TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--textColor)]">
                    {item.orphan_name}
                  </span>
                  <span className="text-xs text-[var(--textMuted)] md:hidden">
                    {item.gender} - {item.orphan_type}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell">
                {item.age} سنة
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell">
                {item.gender === "male" ? "ذكر" : "أنثى"}
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                {item.orphan_type}
              </DataTable.TableCell>

              <DataTable.TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    item.is_sponsored
                      ? "bg-[var(--borderColor)]/80 text-[var(--primeColor)] outline border-[var(--primeColor)]"
                      : "bg-[var(--borderColor)]/80 text-[var(--errorColor)] outline border-[var(--errorColor)]"
                  }`}
                >
                  {item.is_sponsored ? "مكفول" : "غير مكفول"}
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                <span className="text-sm font-bold text-[var(--primeColor)]">
                  {item.current_sponsors || 0}
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden xl:table-cell">
                <span className="text-xs text-[var(--textMuted)]">
                  {item.sponsorship_types || "—"}
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    item.is_active
                      ? "bg-[var(--successColor)]/10 text-[var(--successColor)]"
                      : "bg-[var(--warningColor)]/10 text-[var(--warningColor)]"
                  }`}
                >
                  {item.is_active ? "نشط" : "غير نشط"}
                </span>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        count={filtered.length}
        total={orphanReceives.length}
      />
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
