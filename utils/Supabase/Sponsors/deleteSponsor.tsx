import { supabase } from "../supabase";
import { getSponsorSiblingIds } from "./fetchSponsor";

export async function deleteSponsor(sponsorId: string) {
  const client = supabase();

  // 1. Get all sibling rows (same person) and their orphan_ids
  const siblingIds = await getSponsorSiblingIds(sponsorId);

  const { data: siblings } = await client
    .from("sponsor")
    .select("id, orphan_id, sponsorship_type, join_date, created_at")
    .in("id", siblingIds)
    .eq("is_deleted", false);

  const orphanIds = (siblings || [])
    .map((s: any) => s.orphan_id)
    .filter(Boolean) as string[];

  // 2. Log each active link to sponsorship table as historical record
  for (const sib of siblings || []) {
    if (sib.orphan_id) {
      const { error: histErr } = await client.from("sponsorship").insert({
        sponsor_id: sib.id,
        orphan_id: sib.orphan_id,
        sponsorship_type: sib.sponsorship_type || "كفالة جزئية",
        start_date: sib.created_at
          ? sib.created_at.split("T")[0]
          : sib.join_date,
        status: "متوقف",
      });
      if (histErr) throw histErr;
    }
  }

  // 3. Soft-delete ALL sibling sponsor rows
  const { data, error } = await client
    .from("sponsor")
    .update({ is_deleted: true })
    .in("id", siblingIds);

  if (error) throw error;

  // 4. Set all pending payments for this sponsor to متوقف
  await client
    .from("sponsor_payment")
    .update({ status: "متوقف" })
    .in("sponsor_id", siblingIds)
    .in("status", ["قيد الانتظار", "غير مدفوع"]);

  // 4. Update orphan is_sponsored for orphans that no longer have active sponsors
  for (const orphanId of orphanIds) {
    const { data: remaining } = await client
      .from("sponsor")
      .select("id")
      .eq("orphan_id", orphanId)
      .eq("is_deleted", false)
      .limit(1);

    if (!remaining || remaining.length === 0) {
      await client
        .from("orphan")
        .update({ is_sponsored: false })
        .eq("id", orphanId);
    }
  }

  return data;
}
