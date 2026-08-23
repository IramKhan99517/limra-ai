"use client";

import { createClient } from "@supabase/supabase-js";

// These are safe to expose in the browser — the anon key only allows what
// your Supabase Row Level Security rules permit, unlike DATABASE_URL which
// must stay server-only.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[limra-ai] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. Login and sign up will not work until they are configured."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);
