// src/Supabase/Orphans/uploadOrphans.ts
import { supabase } from "../supabase";

export async function addSalary(salaryData: {
  amount: number;
  status: string;
}) {
  const { data: salary, error } = await supabase()
    .from("sponsor_payment") // ✅ Make sure table name matches your database
    .insert(salaryData)
    .select();

  if (error) throw error;
  return salary;
}
