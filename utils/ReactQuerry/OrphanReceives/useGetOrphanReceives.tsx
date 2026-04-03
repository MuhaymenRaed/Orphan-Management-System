import { useQuery } from "@tanstack/react-query";
import { fetchOrphanReceives } from "../../Supabase/OrphanReceives/fetchOrphanReceives";

export function useGetOrphanReceives() {
  return useQuery({
    queryKey: ["orphanReceives"],
    queryFn: fetchOrphanReceives,
  });
}
