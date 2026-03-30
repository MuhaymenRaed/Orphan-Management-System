import { supabase } from "../supabase";

export async function deleteUser(id: string) {
  const client = supabase();
  const { error } = await client.from("profiles").delete().eq("id", id);
  if (error) throw error;
  return true;
}
