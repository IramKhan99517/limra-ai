import { NextRequest, NextResponse } from "next/server";
import { compareDomains, type DomainRow } from "@/lib/legal";
import {
  checkAvailability as checkNamecheap,
  namecheapConfigured,
} from "@/lib/namecheap";
import {
  checkAvailability as checkGoDaddy,
  godaddyConfigured,
} from "@/lib/godaddy";

export const dynamic = "force-dynamic";

/**
 * GET /api/domains?root=yourbrand
 * Returns the registrar price comparison plus live availability when a
 * registrar API is configured. Provider priority: GoDaddy (works on any
 * host, no IP whitelist) → Namecheap (requires IP whitelisting, so it is
 * really only practical where the app has a fixed egress IP). Without any
 * keys it degrades to the curated price table (live: false).
 */
export async function GET(req: NextRequest) {
  const root = req.nextUrl.searchParams.get("root")?.trim();
  if (!root || !/^[a-z0-9-]{1,63}$/i.test(root)) {
    return NextResponse.json({ error: "Invalid domain root" }, { status: 400 });
  }

  const rows: DomainRow[] = compareDomains(root);
  const domains = rows.map((r) => `${root.toLowerCase()}${r.ext}`);

  // GoDaddy first: no IP whitelist, so it is the safe default on Vercel.
  // Namecheap is a fallback for fixed-IP environments (e.g. self-hosted).
  let availability: Record<string, boolean> | null = null;
  let provider: string | null = null;
  if (godaddyConfigured()) {
    availability = await checkGoDaddy(domains);
    if (availability) provider = "GoDaddy";
  }
  if (!availability && namecheapConfigured()) {
    availability = await checkNamecheap(domains);
    if (availability) provider = "Namecheap";
  }

  return NextResponse.json({
    live: availability !== null,
    provider,
    rows: rows.map((r) => ({
      ...r,
      domain: `${root.toLowerCase()}${r.ext}`,
      available: availability
        ? availability[`${root.toLowerCase()}${r.ext}`] ?? null
        : null,
    })),
  });
}
