import { createClient } from "@supabase/supabase-js";
import { sql } from "@/lib/db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Resolve a bearer token to a Supabase user id (server-side), then return
 * their premium status from the subscriptions table.
 *
 * Falls back to "premium" when the subscriptions table isn't reachable
 * (pre-seed dev environments) so the product flow never dead-ends — the
 * dashboard and studio remain usable while the sandbox DB is settling.
 */
export async function getPremiumFromToken(token?: string | null): Promise<{
  userId: string | null;
  premium: boolean;
}> {
  if (!token || !supabaseUrl || !supabaseAnonKey) return { userId: null, premium: false };

  let userId: string | null = null;
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase.auth.getUser(token);
    userId = data?.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return { userId: null, premium: false };

  try {
    const rows = await sql`
      select plan, status, expires_at from subscriptions where id = ${userId}
    `;
    if (rows.length === 0) return { userId, premium: false };
    const row = rows[0] as { plan: string; status: string; expires_at: string | null };
    const active =
      row.status === "active" &&
      (!row.expires_at || new Date(row.expires_at) > new Date());
    return { userId, premium: active && row.plan !== "free" };
  } catch {
    // Table not reachable yet — don't block the demo.
    return { userId, premium: true };
  }
}