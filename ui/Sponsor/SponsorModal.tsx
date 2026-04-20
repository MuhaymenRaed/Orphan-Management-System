import { useState, useMemo } from "react";
import { Modal } from "../../components/CompundModel";
import { useOrphanLookup } from "../../utils/ReactQuerry/orphanLookup";
import { useAddSponsors } from "../../utils/ReactQuerry/Sponsers/useAddSponsors";
import { useUpdateSponsors } from "../../utils/ReactQuerry/Sponsers/useUpdateSponsors";
import { type SponsorFormData } from "../../utils/sponsor";
import { X, Search, UserPlus, Users } from "lucide-react";

type SponsorModalProps = {
  setIsModel: React.Dispatch<React.SetStateAction<boolean>>;
  onCompleted?: () => void;
  editData?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    sponsorship_type?: string;
    sponsorship_count?: number;
    status?: string;
    /** All active orphans from sponsorship table */
    currentOrphans?: { id: string; name: string }[];
  } | null;
};

export default function SponsorModal({
  setIsModel,
  onCompleted,
  editData,
}: SponsorModalProps) {
  const isEditMode = Boolean(editData);
  const { data: orphans } = useOrphanLookup();

  const { addSponsorMutate, isPending: isAddPending } = useAddSponsors();
  const { updateSponsorMutate, isPending: isUpdatePending } =
    useUpdateSponsors();

  const isPending = isAddPending || isUpdatePending;
  const modalKey = editData?.id ? `edit-${editData.id}` : "create-new";

  // Orphan selection state — pre-populate from all active sponsorships
  const [selectedOrphanIds, setSelectedOrphanIds] = useState<string[]>(
    editData?.currentOrphans?.map((o) => o.id) || [],
  );
  const [orphanSearch, setOrphanSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const defaultValues: Partial<SponsorFormData> = editData
    ? {
        orphanIds: editData.currentOrphans?.map((o) => o.id) || [],
        fullName: editData.name ?? "",
        phone: editData.phone ?? "",
        email: editData.email ?? "",
        sponsorshipType: editData.sponsorship_type ?? "كفالة جزئية",
        status: editData.status ?? "نشط",
      }
    : {
        orphanIds: [],
        status: "نشط",
        sponsorshipType: "كفالة جزئية",
      };

  // Build orphan lookup map for name resolution
  const orphanMap = useMemo(() => {
    const map: Record<string, string> = {};
    // Seed with editData orphans so names are always available
    editData?.currentOrphans?.forEach((o) => {
      map[o.id] = o.name;
    });
    orphans?.forEach((o: any) => {
      map[o.id] = o.name;
    });
    return map;
  }, [orphans, editData]);

  // Filter available orphans (not already selected, matches search)
  // When no search text, show unsponsored orphans first as suggestions
  const availableOrphans = useMemo(() => {
    if (!orphans) return [];
    const notSelected = orphans.filter(
      (o: any) => !selectedOrphanIds.includes(o.id),
    );
    if (orphanSearch.trim()) {
      return notSelected.filter((o: any) =>
        o.name.toLowerCase().includes(orphanSearch.toLowerCase()),
      );
    }
    // Default: unsponsored first
    return [...notSelected].sort((a: any, b: any) => {
      if (!a.is_sponsored && b.is_sponsored) return -1;
      if (a.is_sponsored && !b.is_sponsored) return 1;
      return 0;
    });
  }, [orphans, selectedOrphanIds, orphanSearch]);

  const addOrphan = (id: string) => {
    setSelectedOrphanIds((prev) => [...prev, id]);
    setOrphanSearch("");
  };

  const removeOrphan = (id: string) => {
    setSelectedOrphanIds((prev) => prev.filter((x) => x !== id));
  };

  const handleSubmit = (data: SponsorFormData) => {
    const payload = {
      name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      sponsorship_type: data.sponsorshipType,
      status: data.status,
      orphanIds: selectedOrphanIds,
    };

    const mutationOptions = {
      onSuccess: () => {
        setIsModel(false);
        onCompleted?.();
      },
      onError: (err: any) => console.error("Mutation failed:", err),
    };

    if (isEditMode && editData) {
      updateSponsorMutate({ id: editData.id, ...payload }, mutationOptions);
    } else {
      addSponsorMutate(payload, mutationOptions);
    }
  };

  return (
    <Modal.Root<SponsorFormData>
      key={modalKey}
      onClose={() => setIsModel(false)}
      onSubmit={handleSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      mode={isEditMode ? "edit" : "create"}
    >
      <Modal.Header title="إضافة كفيل جديد" editTitle="تعديل بيانات الكفيل" />

      <Modal.Body>
        <Modal.Grid>
          <Modal.Input<SponsorFormData>
            name="fullName"
            label="الاسم الكامل *"
            placeholder="اسم الكفيل الثلاثي"
            validation={{ required: "الاسم مطلوب" }}
          />

          <Modal.Input<SponsorFormData>
            name="phone"
            label="رقم الهاتف *"
            type="tel"
            placeholder="07XXXXXXXX"
            validation={{
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "رقم الهاتف غير صحيح",
              },
            }}
          />

          <Modal.Input<SponsorFormData>
            name="email"
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@mail.com"
            span={2}
          />

          <Modal.Select<SponsorFormData>
            name="sponsorshipType"
            label="نوع الكفالة"
            options={[
              { value: "كفالة كاملة", label: "كفالة كاملة" },
              { value: "كفالة جزئية", label: "كفالة جزئية" },
              { value: "كفالة صحية", label: "كفالة صحية" },
              { value: "كفالة دراسة", label: "كفالة دراسة" },
            ]}
            placeholder="اختر نوع الكفالة"
          />

          <Modal.Select<SponsorFormData>
            name="status"
            label="حالة الحساب"
            options={[
              { value: "نشط", label: "نشط" },
              { value: "متوقف", label: "متوقف" },
            ]}
          />
        </Modal.Grid>

        {/* ── Multi-orphan assignment section ── */}
        <div className="mt-5 col-span-1 md:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--subTextColor)] mb-2 mr-0.5">
            <Users size={14} />
            تعيين الأيتام ({selectedOrphanIds.length})
          </label>

          {/* Selected orphans chips */}
          {selectedOrphanIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedOrphanIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primeColor)]/10 text-[var(--primeColor)] border border-[var(--primeColor)]/20"
                >
                  {orphanMap[id] || id}
                  <button
                    type="button"
                    onClick={() => removeOrphan(id)}
                    className="hover:bg-[var(--primeColor)]/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search & dropdown to add orphan */}
          <div className="relative">
            <div className="relative">
              <Search
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--textMuted)]"
              />
              <input
                type="text"
                value={orphanSearch}
                onChange={(e) => setOrphanSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="ابحث عن يتيم لإضافته..."
                className="w-full pr-9 pl-3.5 py-2.5 bg-[var(--fillColor)] border border-[var(--borderColor)] rounded-xl focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 outline-none transition-all duration-200 text-sm text-[var(--textColor)] placeholder:text-[var(--textMuted)]"
              />
            </div>

            {/* Dropdown results — show on focus or search */}
            {(searchFocused || orphanSearch.trim()) &&
              availableOrphans.length > 0 && (
                <div className="absolute z-20 w-full mt-1 max-h-40 overflow-y-auto bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-xl shadow-lg">
                  {!orphanSearch.trim() && (
                    <div className="px-4 py-1.5 text-[10px] font-bold text-[var(--primeColor)] border-b border-[var(--borderColor)]">
                      الأيتام الأكثر احتياجاً
                    </div>
                  )}
                  {availableOrphans.slice(0, 8).map((orphan: any) => (
                    <button
                      key={orphan.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addOrphan(orphan.id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-right text-[var(--textColor)] hover:bg-[var(--fillColor)] transition-colors"
                    >
                      <UserPlus
                        size={14}
                        className="text-[var(--primeColor)] shrink-0"
                      />
                      <span>{orphan.name}</span>
                      {!orphan.is_sponsored && (
                        <span className="mr-auto text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500">
                          غير مكفول
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

            {(searchFocused || orphanSearch.trim()) &&
              availableOrphans.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-xl shadow-lg p-3 text-center text-xs text-[var(--textMuted)]">
                  لا يوجد أيتام متاحون
                </div>
              )}
          </div>
        </div>

        <Modal.Footer submitText="حفظ الكفيل" />
      </Modal.Body>
    </Modal.Root>
  );
}
