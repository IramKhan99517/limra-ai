/**
 * GoDaddy API integration — live domain availability.
 *
 * No IP whitelisting required (unlike Namecheap), so it works on Vercel's
 * dynamic egress IPs. Server-only credentials, never exposed to the client:
 *   GODADDY_API_KEY    — from developer.godaddy.com → API Keys
 *   GODADDY_API_SECRET — the matching secret
 *
 * Returns a map of domain -> available, or null when not configured /
 * unreachable so callers fall back to the curated price table.
 */

const API_URL = "https://api.godaddy.com/v1/domains/available";

export function godaddyConfigured(): boolean {
  return Boolean(process.env.GODADDY_API_KEY && process.env.GODADDY_API_SECRET);
}

export async function checkAvailability(
  domains: string[],
): Promise<Record<string, boolean> | null> {
  if (!godaddyConfigured() || domains.length === 0) return null;

  // GoDaddy batch limit is 100 domains per call; we send at most 50.
  const params = new URLSearchParams({
    domains: domains.slice(0, 100).join(","),
    checkType: "FAST",
    forTransfer: "false",
  });

  try {
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      domains?: { domain: string; available: boolean }[];
    };
    const list = data.domains;
    if (!Array.isArray(list) || list.length === 0) return null;

    const out: Record<string, boolean> = {};
    for (const d of list) {
      out[d.domain.toLowerCase()] = d.available;
    }
    return out;
  } catch {
    return null;
  }
}
