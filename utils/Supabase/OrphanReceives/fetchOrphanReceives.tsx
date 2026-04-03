import { supabase } from "../supabase";

export async function fetchOrphanReceives() {
  const { data: orphanReceives, error } = await supabase()
    .from("orphan_receives_view")
    .select("*");
  if (error) throw error;
  return { orphanReceives };
}
