import { Modal } from "../../components/CompundModel";
import {
  useCreateSponsorPayment,
  useUpdateSponsorPayment,
} from "../../utils/ReactQuerry/SponsorPayments/useUpdateSponsorPayments";

type FormData = {
  paid_amount: string;
};

type SponsorPaymentModalProps = {
  setIsModel: (value: boolean) => void;
  onSuccess?: () => void;
  editData?: any | null;
};

export default function SponsorPaymentModal({
  setIsModel,
  onSuccess,
  editData,
}: SponsorPaymentModalProps) {
  const { updatePaymentMutate, isPending: isUpdating } =
    useUpdateSponsorPayment();
  const { createPaymentMutate, isPending: isCreating } =
    useCreateSponsorPayment();

  const isVirtual =
    editData?._isVirtual || editData?.id?.startsWith("virtual-");
  const isPending = isUpdating || isCreating;

  const modalKey = editData?.id ? `edit-${editData.id}` : "create-new";

  const defaultValues = editData
    ? { paid_amount: editData.paid_amount?.toString() || "0" }
    : { paid_amount: "" };

  const onSubmit = (data: FormData) => {
    const paidAmount = parseFloat(data.paid_amount) || 0;
    const expectedAmount = editData?.expected_amount ?? 0;

    const callbacks = {
      onSuccess: () => {
        setIsModel(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        console.error("Mutation failed:", error);
      },
    };

    if (isVirtual) {
      createPaymentMutate(
        {
          sponsor_id: editData.sponsor_id,
          payment_target_month: editData.payment_target_month,
          expected_amount: expectedAmount,
          paid_amount: paidAmount,
          note: editData.note || "",
        },
        callbacks,
      );
    } else {
      updatePaymentMutate(
        {
          id: editData.id,
          paid_amount: paidAmount,
          expected_amount: expectedAmount,
        },
        callbacks,
      );
    }
  };

  return (
    <Modal.Root<FormData>
      key={modalKey}
      onClose={() => setIsModel(false)}
      onSubmit={onSubmit}
      isPending={isPending}
      defaultValues={defaultValues}
      mode="edit"
    >
      <Modal.Header
        title="تعديل دفعة الكفيل"
        editTitle={
          editData?.sponsor_name
            ? `تعديل دفعة: ${editData.sponsor_name}`
            : "تعديل الدفعة"
        }
      />

      <Modal.Body>
        <Modal.Grid>
          <Modal.Input<FormData>
            name="paid_amount"
            label="المبلغ المدفوع (د.ع) *"
            type="number"
            placeholder="0.00"
            validation={{
              required: "المبلغ مطلوب",
              min: { value: 0, message: "المبلغ لا يمكن أن يكون سالباً" },
            }}
            span={2}
          />
        </Modal.Grid>

        {editData && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--fillColor)]/40 border border-[var(--borderColor)]/20 space-y-1">
            <p className="text-xs text-[var(--subTextColor)]">
              المبلغ المتوقع:{" "}
              <span className="font-bold">
                {editData.expected_amount?.toLocaleString()} د.ع
              </span>
            </p>
            {editData.expected_amount > 0 && (
              <p className="text-xs text-[var(--textMuted)]">
                الحالة ستُحدَّث تلقائياً بناءً على المبلغ المُدخَل
              </p>
            )}
          </div>
        )}

        <Modal.Footer submitText="حفظ الدفعة" />
      </Modal.Body>
    </Modal.Root>
  );
}
