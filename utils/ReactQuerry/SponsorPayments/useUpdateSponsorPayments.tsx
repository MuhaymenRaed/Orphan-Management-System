import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSponsorPayment,
  updateSponsorPayment,
  updateSponsorPaymentNote,
} from "../../Supabase/SponsorPayments/updateSponsorPayment";
import { toast } from "react-hot-toast";

export function useCreateSponsorPayment() {
  const queryClient = useQueryClient();

  const { isPending, mutate: createPaymentMutate } = useMutation({
    mutationFn: createSponsorPayment,
    onSuccess: () => {
      toast.success("تم إنشاء الدفعة بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
      queryClient.invalidateQueries({ queryKey: ["orphanageFunds"] });
    },
    onError: (error) => {
      toast.error("فشل في إنشاء الدفعة! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { createPaymentMutate, isPending };
}

export function useUpdateSponsorPayment() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updatePaymentMutate } = useMutation({
    mutationFn: updateSponsorPayment,
    onSuccess: () => {
      toast.success("تم تحديث الدفعة بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
      queryClient.invalidateQueries({ queryKey: ["orphanageFunds"] });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updatePaymentMutate, isPending };
}

export function useUpdateSponsorPaymentNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSponsorPaymentNote,
    onSuccess: () => {
      toast.success("تم تحديث الملاحظة بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
    },
    onError: (error) => {
      toast.error("فشل في تحديث الملاحظة!");
      console.error(error);
    },
  });

  return {
    updateNote: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
