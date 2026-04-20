import { supabase } from "../supabase";

/**
 * Generate or update the sponsor_payment record for one sponsor (by name+phone)
 * for the current month. Calculates expected_amount from sponsorship_prices
 * based on all their active orphan links.
 *
 * @param fallbackSponsorId - ID from elegant_sponsors_list, used when no orphan links exist
 */
export async function generateSponsorPayment(
  sponsorName: string,
  sponsorPhone: string,
  fallbackSponsorId?: string,
) {
  const client = supabase();

  // Current month as YYYY-MM-01
  const now = new Date();
  const targetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // 1. Get all active orphan links for this sponsor person
  const { data: links, error: linksErr } = await client
    .from("sponsor")
    .select("id, sponsorship_type, created_at")
    .eq("name", sponsorName)
    .eq("phone", sponsorPhone)
    .eq("is_deleted", false)
    .not("orphan_id", "is", null)
    .order("created_at", { ascending: true });

  if (linksErr) throw linksErr;

  // Representative ID = first created row for this person, or fallback from view
  const representativeId = links?.[0]?.id || fallbackSponsorId;
  if (!representativeId) return; // No ID available at all

  // 2. Fetch pricing table
  const { data: prices, error: pricesErr } = await client
    .from("sponsorship_prices")
    .select("type_name, monthly_cost");

  if (pricesErr) throw pricesErr;

  const priceMap = new Map(
    (prices || []).map((p: any) => [p.type_name, Number(p.monthly_cost)]),
  );

  // 3. Calculate total expected monthly amount
  const totalExpected = (links || []).reduce((sum: number, link: any) => {
    return sum + (priceMap.get(link.sponsorship_type) || 0);
  }, 0);

  // 4. Find ALL sponsor IDs for this person (including soft-deleted, for old payment references)
  const { data: allRows } = await client
    .from("sponsor")
    .select("id")
    .eq("name", sponsorName)
    .eq("phone", sponsorPhone);

  const allPossibleIds = [
    ...(allRows || []).map((r: any) => r.id),
    ...(fallbackSponsorId ? [fallbackSponsorId] : []),
  ];
  // Deduplicate
  const uniqueIds = [...new Set(allPossibleIds)];

  // 5. Check for existing payment this month
  const { data: existing } = await client
    .from("sponsor_payment")
    .select("id, sponsor_id, status, paid_amount")
    .in("sponsor_id", uniqueIds)
    .eq("payment_target_month", targetMonth);

  if (existing && existing.length > 0) {
    // Update unpaid/pending records with recalculated expected amount
    for (const record of existing) {
      if (["قيد الانتظار", "غير مدفوع"].includes(record.status)) {
        await client
          .from("sponsor_payment")
          .update({
            sponsor_id: representativeId,
            expected_amount: totalExpected,
          })
          .eq("id", record.id);
      }
    }
  } else {
    // Create new payment record for current month
    await client.from("sponsor_payment").insert({
      sponsor_id: representativeId,
      payment_target_month: targetMonth,
      expected_amount: totalExpected,
      paid_amount: 0,
      status: "قيد الانتظار",
      note: "",
    });
  }
}

/**
 * Generate payments for ALL active sponsors for the current month.
 * Use this to seed/fix existing data.
 */
export async function generateAllSponsorPayments() {
  const client = supabase();

  // Get unique active sponsors from the aggregated view
  const { data: sponsors, error } = await client
    .from("elegant_sponsors_list")
    .select("id, name, phone")
    .eq("is_deleted", false);

  if (error) throw error;

  for (const sponsor of sponsors || []) {
    try {
      await generateSponsorPayment(sponsor.name, sponsor.phone, sponsor.id);
    } catch (e) {
      console.error(`Error generating payment for ${sponsor.name}:`, e);
    }
  }
}
