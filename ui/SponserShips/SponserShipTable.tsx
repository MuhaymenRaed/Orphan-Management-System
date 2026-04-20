import { useState, useEffect, useMemo } from "react";
import { StickyNote } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSponsorships } from "../../utils/ReactQuerry/Sponsorships/useGetSponsorships";
import { useUpdateSponsorships } from "../../utils/ReactQuerry/Sponsorships/useUpdateSponsorships";

interface Sponsorship {
  sponsorship_id: string;
  sponsor_name: string;
  orphan_name: string;
  sponsorship_type: string;
  start_date: string;
  end_date: string;
  status: "نشط" | "متوقف";
  note: string;
}

// 1. Define Filter Options
const SPONSORSHIP_FILTERS = [
  { label: "كفالات نشطة", value: "active" },
  { label: "كفالات متوقفة", value: "cancelled" },
  { label: "كفالة كاملة", value: "full" },
  { label: "كفالة جزئية", value: "partial" },
  { label: "كفالة دراسة", value: "educational" },
  { label: "كفالة صحية", value: "medical" },
];

function SponsorshipsTableContent() {
  const { data: sponsorships, isLoading, isError } = useGetSponsorships();
  const { updateNote } = useUpdateSponsorships();

  // 2. Destructure filterValue from Context
  const { searchQuery, filterValue } = DataTable.useContext();

  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sponsorships) {
      const initialNotes: Record<string, string> = {};
      sponsorships.forEach((s: Sponsorship) => {
        initialNotes[s.sponsorship_id] = s.note || "";
      });
      setNotes(initialNotes);
    }
  }, [sponsorships]);

  // 3. Integrated Filter & Search Logic
  const filteredSponsorships = useMemo(() => {
    let result: Sponsorship[] = sponsorships || [];

    // A. Apply Search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (s) =>
          s.sponsor_name?.toLowerCase().includes(query) ||
          s.orphan_name?.toLowerCase().includes(query),
      );
    }

    // B. Apply Dropdown Filter
    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "active":
          result = result.filter((s) => s.status === "نشط");
          break;
        case "cancelled":
          result = result.filter((s) => s.status === "متوقف");
          break;
        case "full":
          result = result.filter((s) => s.sponsorship_type.includes("كاملة"));
          break;
        case "partial":
          result = result.filter((s) => s.sponsorship_type.includes("جزئية"));
          break;
        case "educational":
          result = result.filter((s) => s.sponsorship_type.includes("دراسة"));
          break;
        case "medical":
          result = result.filter((s) => s.sponsorship_type.includes("صحية"));
          break;
        default:
          break;
      }
    }

    return result;
  }, [sponsorships, searchQuery, filterValue]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <DataTable.Error message="حدث خطأ عند تحميل البيانات" />;

  return (
    <>
      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل أو اليتيم..." />

        {/* 4. Add the Filter Component */}
        <DataTable.Filter
          label="تصفية الكفالات"
          options={SPONSORSHIP_FILTERS}
        />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>
              الأطراف (كفيل/يتيم)
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              النوع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              البداية
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              التوقف
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="w-1/3 min-w-[150px]">
              الملاحظات
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredSponsorships}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد كفالات تطابق هذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(sponsorship: Sponsorship) => (
            <DataTable.TableRow key={sponsorship.sponsorship_id}>
              <DataTable.TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--textColor)] truncate max-w-[120px] md:max-w-none">
                    {sponsorship.sponsor_name}
                  </span>
                  <span className="text-[10px] text-[var(--textMuted)]">
                    يتيم: {sponsorship.orphan_name}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell">
                <span className="px-2 py-0.5 rounded-md border border-[var(--primeColor)]/30 text-[10px] text-[var(--primeColor)]">
                  {sponsorship.sponsorship_type}
                </span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)] text-xs">
                {sponsorship.start_date}
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)] text-xs">
                {sponsorship.end_date || "—"}
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      sponsorship.status === "نشط"
                        ? "bg-[var(--fillColor)] text-[var(--primeColor)] shadow-sm border border-[var(--primeColor)] shadow-[var(--primeColor)]/20"
                        : "bg-[var(--fillColor)] text-[var(--errorColor)] border border-[var(--errorColor)]"
                    }`}
                  >
                    {sponsorship.status}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="relative group">
                  <textarea
                    rows={1}
                    className="w-full text-xs text-[var(--textColor)] bg-[var(--borderColor)] border border-transparent rounded-lg px-2 py-2 
                      hover:border-[var(--primeColor)] focus:bg-[var(--fillColor)] focus:border-[var(--primeColor)] 
                      focus:ring-2 focus:ring-[var(--primeColor)]/10 resize-none overflow-hidden"
                    value={notes[sponsorship.sponsorship_id] || ""}
                    placeholder="ملاحظة..."
                    maxLength={90}
                    onChange={(e) => {
                      setNotes((prev) => ({
                        ...prev,
                        [sponsorship.sponsorship_id]: e.target.value,
                      }));
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={() => {
                      updateNote({
                        id: sponsorship.sponsorship_id,
                        note: notes[sponsorship.sponsorship_id],
                        source: sponsorship.sponsorship_id.startsWith("active-")
                          ? "active"
                          : "history",
                      });
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
        count={filteredSponsorships.length}
        total={sponsorships?.length || 0}
      />
    </>
  );
}

export default function SponsorshipsTable() {
  return (
    <DataTable.Root>
      <SponsorshipsTableContent />
    </DataTable.Root>
  );
}
