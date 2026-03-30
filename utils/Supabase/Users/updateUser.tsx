import { supabase } from "../supabase";

export async function updateUser(
  id: string,
  updates: Partial<{
    email: string;
    full_name: string;
    role: string;
    status: string;
  }>,
) {
  const client = supabase();
  const { data, error } = await client
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
}
