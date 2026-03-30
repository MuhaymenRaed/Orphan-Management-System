import { supabase } from "../supabase";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const client = supabase();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}
