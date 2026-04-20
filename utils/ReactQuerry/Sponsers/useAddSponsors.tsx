import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addSponsor } from "../../Supabase/Sponsors/uploadSponsor";

export function useAddSponsors() {
  const queryClient = useQueryClient();

  const {
    isPending,
    isSuccess,
    mutate: addSponsorMutate,
  } = useMutation({
    mutationFn: addSponsor,
    onSuccess: () => {
      toast.success("تم إضافة الكفيل بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["orphans"] });
      queryClient.invalidateQueries({ queryKey: ["orphans", "lookup"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("فشل في الإضافة! يرجى التحقق من الاتصال.");
    },
  });

  return { addSponsorMutate, isPending, isSuccess };
}
