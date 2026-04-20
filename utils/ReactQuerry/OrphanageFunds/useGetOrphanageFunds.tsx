import { useQuery } from "@tanstack/react-query";
import { fetchOrphanageFunds } from "../../Supabase/OrphanageFunds/fetchOrphanageFunds";

export function useGetOrphanageFunds() {
  return useQuery({
    queryKey: ["orphanageFunds"],
    queryFn: fetchOrphanageFunds,
  });
}
