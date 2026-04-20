import { supabase } from "../supabase";

export async function fetchOrphanReceives() {
  const { data, error } = await supabase()
    .from("orphan_financial_status_view")
    .select("*");
  if (error) throw error;
  return data;
}
