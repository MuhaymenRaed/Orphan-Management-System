import { supabase } from "../supabase";

export async function updatePassword(newPassword: string) {
  const client = supabase();
  const { data, error } = await client.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
}
