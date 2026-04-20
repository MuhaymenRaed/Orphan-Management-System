import { supabase } from "../supabase";

export async function fetchOrphanageFunds() {
  const { data, error } = await supabase()
    .from("orphanage_funds")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
