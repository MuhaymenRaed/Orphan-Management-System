import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../Supabase/Users/fetchUsers";

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
