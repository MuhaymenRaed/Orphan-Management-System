import { useQuery } from "@tanstack/react-query";
import { supabase } from "../Supabase/supabase";
export const useOrphanLookup = () => {
  return useQuery({
    queryKey: ["orphans", "lookup"],
    queryFn: async () => {
      const { data, error } = await supabase()
        .from("orphan")
        .select("id, name, is_sponsored")
        .eq("is_deleted", false);
      if (error) throw error;
      return data;
    },
  });
};
