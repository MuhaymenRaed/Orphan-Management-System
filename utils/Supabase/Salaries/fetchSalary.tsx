import { supabase } from "../supabase";

export const fetchSalary = async () => {
  const { data, error } = await supabase()
    .from("sponsor_payment")
    .select(
      `
      id,
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

  if (error) throw error;

  // Map to the shape the SalariesTable expects
  return (data || []).map((row: any) => ({
    payment_id: row.id,
    sponsor_name: row.sponsor?.name || "\u2014",
    orphan_name: "\u2014",
    amount: row.paid_amount ?? row.expected_amount,
    payment_date: row.payment_date,
    status: row.status,
    note: row.note,
  }));
};
