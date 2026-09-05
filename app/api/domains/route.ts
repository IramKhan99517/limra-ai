import { NextRequest, NextResponse } from "next/server";
import { compareDomains, type DomainRow } from "@/lib/legal";
import { checkAvailability, namecheapConfigured } from "@/lib/namecheap";

export const dynamic = "force-dynamic";

/**
 * GET /api/domains?root=yourbrand
 * Returns the registrar price comparison; when Namecheap API credentials are
 * configured it also attaches live availability per domain (`available`).
 * Without credentials it degrades to the curated price table (live: false).
 */
export async function GET(req: NextRequest) {
  const root = req.nextUrl.searchParams.get("root")?.trim();
  if (!root || !/^[a-z0-9-]{1,63}$/i.test(root)) {
    return NextResponse.json({ error: "Invalid domain root" }, { status: 400 });
  }

  const rows: DomainRow[] = compareDomains(root);

  const live = namecheapConfigured();
  let availability: Record<string, boolean> | null = null;
  if (live) {
    const domains = rows.map((r) => `${root.toLowerCase()}${r.ext}`);
    availability = await checkAvailability(domains);
  }

  return NextResponse.json({
    live,
    rows: rows.map((r) => ({
      ...r,
      domain: `${root.toLowerCase()}${r.ext}`,
      available: availability ? availability[`${root.toLowerCase()}${r.ext}`] ?? null : null,
    })),
  });
}
