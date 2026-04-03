import { supabase } from "../supabase";

export async function fetchOrphans() {
  const { data: orphan, error } = await supabase()
    .from("orphan")
    .select("*")
    .eq("is_deleted", false);
  if (error) throw error;
  return { orphan };
}
