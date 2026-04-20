import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateSponsorFull,
  syncSponsorPaymentStatus,
} from "../../Supabase/Sponsors/updateSponsor";
import { toast } from "react-hot-toast";

type UpdatePayload = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  sponsorship_type?: string;
  status?: string;
  orphanIds: string[];
};

export function useUpdateSponsors() {
  const queryClient = useQueryClient();
  const { isPending, mutate: updateSponsorMutate } = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      // Update sponsor rows (replicated model) + sync orphan assignments
      const result = await updateSponsorFull(payload);

      // Sync payment statuses
      if (payload.status) {
        await syncSponsorPaymentStatus(payload.id, payload.status);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("تم تحديث بيانات الكفيل بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["orphans"] });
      queryClient.invalidateQueries({ queryKey: ["orphans", "lookup"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updateSponsorMutate, isPending };
}
