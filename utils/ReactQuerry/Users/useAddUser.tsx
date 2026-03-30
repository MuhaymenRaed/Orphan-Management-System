import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUser } from "../../Supabase/Users/addUser";

export function useAddUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
