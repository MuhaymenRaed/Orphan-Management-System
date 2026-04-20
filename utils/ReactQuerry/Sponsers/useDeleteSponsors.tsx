import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSponsor } from "../../Supabase/Sponsors/deleteSponsor";
import { toast } from "react-hot-toast";

export function useDeleteSponsors() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteSponsorMutate } = useMutation({
    mutationFn: deleteSponsor,
    onSuccess: () => {
      toast.success("تم حذف الكفيل بنجاح!");
      queryClient.invalidateQueries({
        queryKey: ["sponsors"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["orphans"] });
      queryClient.invalidateQueries({ queryKey: ["orphans", "lookup"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
    },
    onError: (error) => {
      console.error("❌ Delete sponsor error:", error);
      toast.error("فشل في الحذف! يرجى التحقق من الاتصال.");
    },
  });

  return { deleteSponsorMutate, isPending };
}
