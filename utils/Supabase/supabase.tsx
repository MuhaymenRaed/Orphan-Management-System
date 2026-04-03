import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cavpiewbzvnwoaihtebd.supabase.co";
const supabaseKey = "sb_publishable_5T8czwdt_vs-V07ROx_d6g_ERkc40J8";

// Singleton – one client shared across the entire app
const client = createClient(supabaseUrl, supabaseKey);

export function supabase() {
  return client;
}
