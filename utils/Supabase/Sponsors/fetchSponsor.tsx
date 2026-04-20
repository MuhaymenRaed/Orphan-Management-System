import { supabase } from "../supabase";

export async function FetchSponsor() {
  const { data, error } = await supabase()
    .from("elegant_sponsors_list")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { sponsor: data };
}

/**
 * Fetch ALL orphans assigned to a sponsor.
 * In the new model, each sponsor row = one sponsor–orphan link.
 * Siblings share the same name + phone.
 */
export async function fetchSponsorOrphans(sponsorId: string) {
  const client = supabase();

  // 1. Get this sponsor's identity (name + phone)
  const { data: thisSponsor, error: sErr } = await client
    .from("sponsor")
    .select("name, phone")
    .eq("id", sponsorId)
    .single();

  if (sErr) throw sErr;
  if (!thisSponsor) return [];

  // 2. Find all sibling rows (same person, different orphans)
  const { data: siblings, error: sibErr } = await client
    .from("sponsor")
    .select("orphan_id")
    .eq("name", thisSponsor.name)
    .eq("phone", thisSponsor.phone)
    .eq("is_deleted", false)
    .not("orphan_id", "is", null);

  if (sibErr) throw sibErr;

  const orphanIds = [
    ...new Set((siblings || []).map((s: any) => s.orphan_id).filter(Boolean)),
  ];
  if (orphanIds.length === 0) return [];

  // 3. Fetch orphan names
  const { data: orphans, error: oErr } = await client
    .from("orphan")
    .select("id, name")
    .in("id", orphanIds);

  if (oErr) throw oErr;
  return orphans || [];
}

/**
 * Get all sibling sponsor row IDs for a given sponsor (same person).
 */
export async function getSponsorSiblingIds(
  sponsorId: string,
): Promise<string[]> {
  const client = supabase();

  const { data: thisSponsor } = await client
    .from("sponsor")
    .select("name, phone")
    .eq("id", sponsorId)
    .single();

  if (!thisSponsor) return [sponsorId];

  const { data: siblings } = await client
    .from("sponsor")
    .select("id")
    .eq("name", thisSponsor.name)
    .eq("phone", thisSponsor.phone)
    .eq("is_deleted", false);

  return (siblings || []).map((s: any) => s.id);
}
