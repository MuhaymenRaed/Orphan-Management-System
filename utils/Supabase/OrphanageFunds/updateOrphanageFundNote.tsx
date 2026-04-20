import { supabase } from "../supabase";

export async function updateOrphanageFundNote(payload: {
  id: string;
  note: string;
}) {
  const { id, note } = payload;

  const { data, error } = await supabase()
    .from("orphanage_funds")
    .update({ note })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}
