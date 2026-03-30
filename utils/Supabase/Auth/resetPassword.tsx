import { supabase } from "../supabase";

export async function resetPassword(email: string) {
  const client = supabase();
  const { data, error } = await client.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}
