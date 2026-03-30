import { supabase } from "../supabase";

export async function fetchUsers() {
  const client = supabase();
  const { data, error } = await client
    .from("profiles")
    .select("id, email, full_name, role, status, created_at, updated_at");
  if (error) throw error;
  return data;
}
