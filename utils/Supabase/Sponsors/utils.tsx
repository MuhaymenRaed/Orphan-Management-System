import { supabase } from "../supabase";

export async function fetchSponsorStats() {
  const { data, error } = await supabase()
    .from("elegant_sponsors_list")
    .select("sponsorship_count");

  if (error) throw error;

  const totalSponsors = data?.length ?? 0;
  const totalSponsorships = (data || []).reduce(
    (sum, row) => sum + (row.sponsorship_count ?? 0),
    0,
  );

  return { totalSponsors, totalSponsorships };
}
