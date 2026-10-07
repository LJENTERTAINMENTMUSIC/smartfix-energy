import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = "https://qfmeylybzvtjoabykblh.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbWV5bHlienZ0am9hYnlrYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mzk5OTQsImV4cCI6MjA5MDExNTk5NH0.7uQVT8rojtBMCVJNNSD41nlaNu1Wr2YtFmTYOc1hlWA";

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
