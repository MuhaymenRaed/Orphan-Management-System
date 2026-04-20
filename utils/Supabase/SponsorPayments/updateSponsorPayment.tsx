import { supabase } from "../supabase";

type UpdatePayload = {
  id: string;
  paid_amount: number;
  expected_amount: number;
};

type CreatePayload = {
  sponsor_id: string;
  payment_target_month: string;
  expected_amount: number;
  paid_amount: number;
  status?: string;
  note?: string;
};

function computePaymentStatus(paid: number, expected: number): string {
  if (paid === 0) return "قيد الانتظار";
  if (paid === expected) return "مدفوع بالكامل";
  if (paid > expected) return "فائض";
  return "ناقص";
}

export async function createSponsorPayment(payload: CreatePayload) {
  const paid = payload.paid_amount;
  const expected = payload.expected_amount;
  const surplus = Math.max(0, paid - expected);
  const debt = Math.max(0, expected - paid);

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .insert({
      sponsor_id: payload.sponsor_id,
      payment_target_month: payload.payment_target_month,
      expected_amount: expected,
      paid_amount: paid,
      extra_charity: surplus,
      remaining_debt: debt,
      status: payload.status ?? computePaymentStatus(paid, expected),
      note: payload.note || "",
    })
    .select();

  if (error) throw error;
  return data;
}

export async function updateSponsorPayment(payload: UpdatePayload) {
  const { id, paid_amount, expected_amount } = payload;

  const surplus = Math.max(0, paid_amount - expected_amount);
  const debt = Math.max(0, expected_amount - paid_amount);
  const status = computePaymentStatus(paid_amount, expected_amount);

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update({
      paid_amount,
      expected_amount,
      extra_charity: surplus,
      remaining_debt: debt,
      status,
      payment_date:
        paid_amount > 0 ? new Date().toISOString().split("T")[0] : null,
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function updateSponsorPaymentNote(payload: {
  id: string;
  note: string;
}) {
  const { id, note } = payload;

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update({ note })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}
