import { supabase } from "../supabase";

export async function addUser(user: {
  email: string;
  full_name: string;
  role: string;
  status: string;
}) {
  const client = supabase();
  const { data, error } = await client.from("profiles").insert([user]).select();
  if (error) throw error;
  return data?.[0];
}
