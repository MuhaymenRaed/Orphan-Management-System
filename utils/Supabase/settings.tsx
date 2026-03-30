import { supabase } from "../Supabase/supabase";

export async function fetchSettings() {
  const { data, error } = await supabase()
    .from("settings")
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateSettings(newSettings: any) {
  const { data, error } = await supabase()
    .from("settings")
    .update(newSettings)
    .eq("id", newSettings.id)
    .select();
  if (error) throw error;
  return data;
}
