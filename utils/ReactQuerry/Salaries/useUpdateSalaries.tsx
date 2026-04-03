import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateSalary,
  updateSalaryNote,
} from "../../Supabase/Salaries/updateSalary";
import { toast } from "react-hot-toast";

export function useUpdateSalary() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateSalaryMutate } = useMutation({
    mutationFn: updateSalary,
    onSuccess: () => {
      toast.success("تم تحديث بيانات الراتب بنجاح!");
      queryClient.invalidateQueries({
        queryKey: ["salaries"],
      });
      queryClient.refetchQueries({
        queryKey: ["salaries"],
        type: "active",
      });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updateSalaryMutate, isPending };
}

export function useUpdateSalaryNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSalaryNote,
    onSuccess: () => {
      toast.success("تم تحديث الملاحظة بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
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
