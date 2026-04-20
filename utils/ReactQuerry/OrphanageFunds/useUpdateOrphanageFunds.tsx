import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrphanageFundNote } from "../../Supabase/OrphanageFunds/updateOrphanageFundNote";
import { toast } from "react-hot-toast";

export function useUpdateOrphanageFundNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateOrphanageFundNote,
    onSuccess: () => {
      toast.success("تم حفظ الملاحظة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["orphanageFunds"] });
    },
    onError: (error) => {
      toast.error("فشل في حفظ الملاحظة!");
      console.error(error);
    },
  });

  return {
    updateNote: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
