import { useMemo, useState } from "react";
import { SquarePen, Trash2, Mail, Phone, UserCheck } from "lucide-react";
import { useGetSponsors } from "../../utils/ReactQuerry/Sponsers/useGetSponsors";
import { useDeleteSponsors } from "../../utils/ReactQuerry/Sponsers/useDeleteSponsors";
import SponsorModal from "./SponsorModal";
import { CheckPopup } from "../CheckPopup";
import { DataTable } from "../../components/CompoundTable";
import { fetchSponsorOrphans } from "../../utils/Supabase/Sponsors/fetchSponsor";

interface Sponsor {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  sponsorship_count: number;
  sponsorship_type: string;
  join_date: string;
  status: "نشط" | "متوقف";
}

// 1. Define Filter Options for Sponsors
const SPONSOR_FILTERS = [
  { label: "كفلاء نشطون", value: "active" },
  { label: "كفلاء متوقفون", value: "inactive" },
  { label: "كفالات متعددة (> 2)", value: "high_volume" },
];

function SponsorsTableContent() {
  const { data, error, isLoading } = useGetSponsors();
  const { deleteSponsorMutate } = useDeleteSponsors();
  const [loadingEdit, setLoadingEdit] = useState(false);

  const {
    searchQuery,
    filterValue,
    deleteConfirm,
    setDeleteConfirm,
    setIsModalOpen,
    editItem,
    setEditItem,
  } = DataTable.useContext();

  const sponsors: Sponsor[] = data?.sponsor || [];

  const filteredSponsors = useMemo(() => {
    let result = sponsors;

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.phone?.includes(query) ||
          s.email?.toLowerCase().includes(query),
      );
    }

    if (filterValue && filterValue !== "all") {
      switch (filterValue) {
        case "active":
          result = result.filter((s) => s.status === "نشط");
          break;
        case "inactive":
          result = result.filter((s) => s.status === "متوقف");
          break;
        case "high_volume":
          result = result.filter((s) => s.sponsorship_count >= 2);
          break;
        default:
          break;
      }
    }

    return result;
  }, [sponsors, searchQuery, filterValue]);

  const handleEdit = async (sponsor: Sponsor) => {
    setLoadingEdit(true);
    try {
      // Fetch ALL active orphans from sponsorship table
      const orphans = await fetchSponsorOrphans(sponsor.id);
      const currentOrphans = (orphans || []).map((o: any) => ({
        id: o.id as string,
        name: o.name as string,
      }));

      setEditItem({ ...sponsor, currentOrphans });
      setIsModalOpen(true);
    } catch (err) {
      console.error("[handleEdit] fetchSponsorOrphans failed:", err);
      setEditItem({ ...sponsor, currentOrphans: [] });
      setIsModalOpen(true);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = (sponsorId: string) => {
    deleteSponsorMutate(sponsorId, {
      onSuccess: () => setDeleteConfirm(null),
      onError: () => setDeleteConfirm(null),
    });
  };

  if (isLoading || loadingEdit) return <DataTable.Loading />;
  if (error)
    return <DataTable.Error message="حدث خطأ أثناء تحميل بيانات الكفلاء" />;

  return (
    <>
      <DataTable.ModalWrapper>
        <SponsorModal
          key={editItem?.id || "create-new"}
          setIsModel={(val) => setIsModalOpen(!!val)}
          onCompleted={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      {deleteConfirm !== null && (
        <CheckPopup
          onClick={() => handleDelete(deleteConfirm as string)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن كفيل..." />

        {/* 4. Filter Component Added Here */}
        <DataTable.Filter label="تصفية الكفلاء" options={SPONSOR_FILTERS} />

        <DataTable.AddButton label="كفيل" />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>الكفيل</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              الاتصال
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell text-center">
              الكفالات
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الإجراءات
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredSponsors}
          emptyMessage={
            filterValue !== "all"
              ? "لا يوجد كفلاء يطابقون هذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(sponsor: Sponsor) => (
            <DataTable.TableRow key={sponsor.id}>
              <DataTable.TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[var(--textColor)]">
                    {sponsor.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--textMuted)] md:hidden">
                    <Phone size={10} />
                    <span>{sponsor.phone}</span>
                  </div>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--textColor)]/80">
                    <Phone size={12} className="text-[var(--primeColor)]" />
                    <span className="tabular-nums">{sponsor.phone}</span>
                  </div>
                  {sponsor.email && (
                    <div className="flex items-center gap-2 text-[10px] text-[var(--textMuted2)]">
                      <Mail size={12} />
                      <span className="truncate max-w-[150px]">
                        {sponsor.email}
                      </span>
                    </div>
                  )}
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-[var(--primeColor)]">
                    {sponsor.sponsorship_count}
                  </span>
                  <span className="text-[10px] text-[var(--textMuted)]">
                    يتيم
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      sponsor.status === "نشط"
                        ? "bg-[var(--fillColor)] text-[var(--primeColor)] border-[var(--primeColor)]"
                        : "bg-[var(--fillColor)] text-[var(--errorColor)] border-[var(--errorColor)]"
                    }`}
                  >
                    <UserCheck
                      size={10}
                      className={sponsor.status === "نشط" ? "block" : "hidden"}
                    />
                    {sponsor.status}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center items-center gap-2 md:gap-4">
                  <button
                    onClick={() => handleEdit(sponsor)}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--borderColor)] rounded-lg transition-colors"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(sponsor.id)}
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
        count={filteredSponsors.length}
        total={sponsors.length}
      />
    </>
  );
}

export default function SponsorsTable() {
  return (
    <DataTable.Root>
      <SponsorsTableContent />
    </DataTable.Root>
  );
}
