import { supabase } from "../supabase";

export async function updateSponsorships(payload: {
  id: string;
  note: string;
  source: "active" | "history";
}) {
  const { id, note, source } = payload;
  const client = supabase();

  if (source === "active") {
    // Active row — the id is prefixed with "active-", strip it to get sponsor id
    const sponsorId = id.replace("active-", "");
    const { data, error } = await client
      .from("sponsor")
      .update({ note: note })
      .eq("id", sponsorId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // History row — update sponsorship table
    const { data, error } = await client
      .from("sponsorship")
      .update({ note })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
