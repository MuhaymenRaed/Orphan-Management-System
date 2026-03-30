import { supabase } from "../supabase";

export async function signOut() {
  const client = supabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  return true;
}
