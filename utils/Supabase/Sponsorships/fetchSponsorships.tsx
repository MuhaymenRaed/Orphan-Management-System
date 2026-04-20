import { supabase } from "../supabase";

export const fetchSponsorship = async () => {
  const client = supabase();

  // Fetch active sponsorships from sponsor table + historical from sponsorship table + orphan names
  // Also fetch ALL sponsors (including deleted) for name resolution in history
  const [sponsorsRes, allSponsorsRes, historyRes, orphansRes] =
    await Promise.all([
      client
        .from("sponsor")
        .select(
          "id, name, orphan_id, sponsorship_type, join_date, status, created_at, note",
        )
        .eq("is_deleted", false)
        .not("orphan_id", "is", null)
        .order("created_at", { ascending: false }),
      client.from("sponsor").select("id, name"),
      client
        .from("sponsorship")
        .select(
          "id, sponsor_id, orphan_id, sponsorship_type, start_date, status, created_at, note",
        )
        .order("created_at", { ascending: false }),
      client.from("orphan").select("id, name"),
    ]);

  if (sponsorsRes.error) throw sponsorsRes.error;

  const orphanMap = new Map(
    (orphansRes.data || []).map((o: any) => [o.id, o.name]),
  );

  // Build sponsor name map from ALL sponsors (including soft-deleted) for history resolution
  const sponsorNameMap = new Map(
    (allSponsorsRes.data || []).map((s: any) => [s.id, s.name]),
  );

  // Active sponsorships from sponsor table
  const activeRows = (sponsorsRes.data || []).map((row: any) => ({
    sponsorship_id: `active-${row.id}`,
    sponsor_name: row.name || "—",
    orphan_name: orphanMap.get(row.orphan_id) || "—",
    sponsorship_type: row.sponsorship_type || "—",
    start_date: row.created_at ? row.created_at.split("T")[0] : "—",
    end_date: "",
    status: "نشط" as const,
    note: row.note || "",
    created_at: row.created_at,
    _source: "active" as const,
  }));

  // Historical sponsorships from sponsorship table
  const historyRows = (historyRes.data || []).map((row: any) => ({
    sponsorship_id: row.id,
    sponsor_name: sponsorNameMap.get(row.sponsor_id) || "—",
    orphan_name: orphanMap.get(row.orphan_id) || "—",
    sponsorship_type: row.sponsorship_type || "—",
    start_date: row.start_date || "—",
    end_date: row.created_at ? row.created_at.split("T")[0] : "—",
    status: row.status || "متوقف",
    note: row.note || "",
    created_at: row.created_at,
    _source: "history" as const,
  }));

  // Combine: active first, then historical
  return [...activeRows, ...historyRows];
};
