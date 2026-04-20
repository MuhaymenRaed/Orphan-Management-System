import { supabase } from "../supabase";

export async function signOut() {
  const client = supabase();
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  } catch {
    // If global signout fails (network), force local session clear
    await client.auth.signOut({ scope: "local" });
  }
  return true;
}
