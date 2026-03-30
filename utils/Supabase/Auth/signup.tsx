import { supabase } from "../supabase";

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const client = supabase();
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
