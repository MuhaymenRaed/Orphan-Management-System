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
  const { id, ...updateData } = newSettings;

  // First fetch the current row to know exact column names
  const { data: current, error: fetchErr } = await supabase()
    .from("settings")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr) throw fetchErr;

  // Only send keys that actually exist as columns in the table
  const existingColumns = new Set(Object.keys(current));
  const cleanData: Record<string, any> = {};
  for (const [key, value] of Object.entries(updateData)) {
    if (existingColumns.has(key)) {
      cleanData[key] = value;
    }
  }

  const { data, error } = await supabase()
    .from("settings")
    .update(cleanData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}
