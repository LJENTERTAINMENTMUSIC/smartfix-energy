import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The admin console talks to Supabase when credentials are provided via env.
 * Without them the app falls back to "local mode" so development keeps working
 * (data stays in this browser only).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
