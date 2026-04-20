import { supabase } from "../supabase";

const BASE_AMOUNT = 50_000; // Base monthly amount for sponsors with no active sponsorship

export const fetchSponsorPayments = async () => {
  const client = supabase();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // 1. Fetch all active sponsors from the view (includes sponsorship_type + count)
  const { data: sponsors, error: sponsorsErr } = await client
    .from("elegant_sponsors_list")
    .select("id, name, phone, sponsorship_type, sponsorship_count")
    .eq("is_deleted", false);

  if (sponsorsErr) console.error("Failed to fetch sponsors:", sponsorsErr);

  // 2. Fetch sponsorship pricing
  const { data: prices, error: pricesErr } = await client
    .from("sponsorship_prices")
    .select("type_name, monthly_cost");

  if (pricesErr) console.error("Failed to fetch prices:", pricesErr);

  const priceMap = new Map(
    (prices || []).map((p: any) => [p.type_name, Number(p.monthly_cost)]),
  );

  // 3. Helper: compute expected amount for a sponsor
  // Sponsors with no active sponsorship pay the BASE_AMOUNT
  const computeExpected = async (sponsor: any): Promise<number> => {
    if (!sponsor.sponsorship_type) return BASE_AMOUNT;

    // For uniform types, simple: price × count
    const singlePrice = priceMap.get(sponsor.sponsorship_type);
    if (singlePrice !== undefined) {
      return singlePrice * (sponsor.sponsorship_count || 1);
    }

    // For mixed types (e.g. "كفالة متنوعة"), query individual rows
    const { data: rows } = await client
      .from("sponsor")
      .select("sponsorship_type")
      .eq("name", sponsor.name)
      .eq("phone", sponsor.phone)
      .eq("is_deleted", false)
      .not("orphan_id", "is", null);

    const total = (rows || []).reduce(
      (sum: number, r: any) => sum + (priceMap.get(r.sponsorship_type) || 0),
      0,
    );
    // Fall back to BASE_AMOUNT if no matching prices found
    return total > 0 ? total : BASE_AMOUNT;
  };

  // 4. Precompute expected amounts for all sponsors
  const sponsorExpectedMap = new Map<string, number>();
  for (const s of sponsors || []) {
    sponsorExpectedMap.set(s.id, await computeExpected(s));
  }

  // 5. Check which sponsors already have a current-month payment
  const { data: currentMonthPayments } = await client
    .from("sponsor_payment")
    .select("id, sponsor_id, expected_amount, sponsor ( name )")
    .eq("payment_target_month", currentMonth);

  const paidIds = new Set(
    (currentMonthPayments || []).map((p: any) => p.sponsor_id),
  );
  const paidNames = new Set(
    (currentMonthPayments || []).map((p: any) => p.sponsor?.name),
  );

  // 6. Create real DB records for sponsors missing a current-month payment
  const missingSponsors = (sponsors || []).filter(
    (s: any) => !paidIds.has(s.id) && !paidNames.has(s.name),
  );

  for (const s of missingSponsors) {
    const expectedAmount = sponsorExpectedMap.get(s.id) ?? BASE_AMOUNT;

    const { error: insertErr } = await client.from("sponsor_payment").insert({
      sponsor_id: s.id,
      payment_target_month: currentMonth,
      expected_amount: expectedAmount,
      paid_amount: 0,
      remaining_debt: expectedAmount,
      extra_charity: 0,
      status: "قيد الانتظار",
      note: "",
    });

    if (insertErr) {
      console.error(
        `Insert payment failed for ${s.name}:`,
        insertErr.message,
        insertErr.details,
        insertErr.code,
      );
    }
  }

  // Step 7 removed: updating expected_amount individually triggers recursive
  // database triggers (PostgreSQL error 54001: stack depth limit exceeded).

  // 8. Fetch ALL payment records (including any newly created)
  const { data: allPayments, error: fetchErr } = await client
    .from("sponsor_payment")
    .select(
      `
      id,
      sponsor_id,
      payment_target_month,
      expected_amount,
      paid_amount,
      extra_charity,
      remaining_debt,
      payment_date,
      status,
      note,
      created_at,
      sponsor ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (fetchErr) throw fetchErr;

  const flatPayments = (allPayments || []).map((row: any) => {
    // Always use fresh expected from current sponsorship state (override stale DB value)
    const freshExpected =
      row.sponsor_id && sponsorExpectedMap.has(row.sponsor_id)
        ? sponsorExpectedMap.get(row.sponsor_id)!
        : row.expected_amount;

    // remaining > 0 means surplus (paid more), remaining < 0 means still owes
    const remaining = (row.paid_amount || 0) - freshExpected;

    return {
      ...row,
      expected_amount: freshExpected,
      remaining,
      sponsor_name: row.sponsor?.name || "—",
      payment_date: row.payment_date ? row.payment_date.split("T")[0] : null,
    };
  });

  // 9. For any sponsors where INSERT failed, add virtual records as fallback
  const finalPaidIds = new Set(
    flatPayments
      .filter((p: any) => p.payment_target_month === currentMonth)
      .map((p: any) => p.sponsor_id),
  );
  const finalPaidNames = new Set(
    flatPayments
      .filter((p: any) => p.payment_target_month === currentMonth)
      .map((p: any) => p.sponsor_name),
  );

  const virtualRecords: any[] = [];
  for (const s of (sponsors || []).filter(
    (s: any) => !finalPaidIds.has(s.id) && !finalPaidNames.has(s.name),
  )) {
    const expectedAmount = sponsorExpectedMap.get(s.id) ?? BASE_AMOUNT;
    virtualRecords.push({
      id: `virtual-${s.id}`,
      sponsor_id: s.id,
      sponsor_name: s.name,
      payment_target_month: currentMonth,
      expected_amount: expectedAmount,
      paid_amount: 0,
      extra_charity: 0,
      remaining_debt: expectedAmount,
      remaining: -expectedAmount, // 0 paid - expected = negative (owes)
      payment_date: null,
      status: "قيد الانتظار",
      note: "",
      created_at: new Date().toISOString(),
      _isVirtual: true,
    });
  }

  return [...virtualRecords, ...flatPayments];
};
