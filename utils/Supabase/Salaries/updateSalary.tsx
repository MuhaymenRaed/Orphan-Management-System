import { supabase } from "../supabase";

type UpdateSalaryPayload = {
  id: number;
  amount?: number;
  status?: string;
  note?: string;
};

export async function updateSalary(payload: UpdateSalaryPayload) {
  const { id, ...updateData } = payload;

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function updateSalaryNote(payload: { id: number; note: string }) {
  const { id, note } = payload;

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update({ note })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}
