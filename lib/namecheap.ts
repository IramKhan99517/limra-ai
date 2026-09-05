/**
 * Namecheap API integration — live domain availability.
 *
 * Credentials are server-only (never exposed to the client):
 *   NAMECHEAP_API_USER  — your Namecheap account username
 *   NAMECHEAP_API_KEY   — API key from Profile → Tools → Namecheap API Access
 *   NAMECHEAP_CLIENT_IP — the IP whitelisted in the Namecheap API console
 *
 * When the keys are missing, or the API is unreachable (e.g. the sandbox IP is
 * not whitelisted yet), callers fall back to the curated price table so the
 * UI keeps working.
 */

const API_URL = "https://api.namecheap.com/xml.response";

export function namecheapConfigured(): boolean {
  return Boolean(
    process.env.NAMECHEAP_API_USER &&
      process.env.NAMECHEAP_API_KEY &&
      process.env.NAMECHEAP_CLIENT_IP,
  );
}

/**
 * Returns a map of domain -> available (true = registerable), or null when the
 * API is not configured / not reachable. Batched: Namecheap allows up to 50
 * domains per namecheap.domains.check call.
 */
export async function checkAvailability(
  domains: string[],
): Promise<Record<string, boolean> | null> {
  if (!namecheapConfigured() || domains.length === 0) return null;

  const params = new URLSearchParams({
    ApiUser: process.env.NAMECHEAP_API_USER!,
    ApiKey: process.env.NAMECHEAP_API_KEY!,
    UserName: process.env.NAMECHEAP_API_USER!,
    Command: "namecheap.domains.check",
    ClientIp: process.env.NAMECHEAP_CLIENT_IP!,
    DomainList: domains.slice(0, 50).join(","),
  });

  try {
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      cache: "no-store",
      // Namecheap enforces per-day quotas; a short timeout keeps the UI snappy
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const xml = await res.text();

    // API-level error (e.g. IP not whitelisted, quota exceeded)
    if (/<Error[^>]*>\d+<\/Error>/.test(xml) || /Status="ERROR"/.test(xml)) {
      return null;
    }

    const out: Record<string, boolean> = {};
    const re = /<DomainCheckResult\s+Domain="([^"]+)"\s+Available="(true|false)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      out[m[1].toLowerCase()] = m[2] === "true";
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}
