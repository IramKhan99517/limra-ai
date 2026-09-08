"use client";

import { useState } from "react";
import { PremiumGate } from "@/lib/paywall";
import { AppShell } from "@/components/AppShell";
import { Reveal } from "@/components/Reveal";
import { saudiDomainRecs } from "@/lib/naming";

type DomainRow = {
  ext: string;
  bestRegistrar: string;
  bestPrice: number;
  renewal: number;
  note?: string;
  buyUrl: string;
  domain: string;
  available: boolean | null;
};

type ApiResponse = { live: boolean; provider: string | null; rows: DomainRow[] };

const PREVIEW_EXAMPLES = [
  { brand: "Noora", root: "noora" },
  { brand: "Riyadh Roast", root: "riyadhroast" },
  { brand: "Sadeem Tech", root: "sadeemtech" },
];

export default function DomainIntelligencePage() {
  const [root, setRoot] = useState("");
  const [rows, setRows] = useState<DomainRow[] | null>(null);
  const [live, setLive] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkedBrand, setCheckedBrand] = useState("");

  async function run() {
    const clean = root.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!clean) return;
    setBusy(true);
    setRows(null);
    try {
      const res = await fetch(`/api/domains?root=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setRows(data.rows);
        setLive(data.live);
        setProvider(data.provider);
        setCheckedBrand(clean);
      }
    } finally {
      setBusy(false);
    }
  }

  const liveLabel = live
    ? `live availability via ${provider ?? "registrar"} API`
    : "indicative prices — connect a registrar API key for live availability";

  return (
    <AppShell>
      <Reveal>
        <p className="eyebrow">Domain Intelligence</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Brand-domain matching for the Saudi market
        </h1>
        <p className="mt-3 max-w-xl text-dune">
          Check domain availability, match domains to your brand, discover alternatives, and get
          premium and Saudi-market domain recommendations.
        </p>
      </Reveal>

      {/* Public preview — always visible */}
      <Reveal delay={0.05} className="mt-8">
        <div className="glass rounded-xl p-6">
          <p className="eyebrow">Preview</p>
          <p className="mt-2 text-sm text-dune">
            Here&apos;s what Saudi market recommendations look like for a few sample brands:
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {PREVIEW_EXAMPLES.map((ex) => (
              <div key={ex.brand} className="rounded-xl border border-ink-line p-4">
                <p className="font-display text-lg">{ex.brand}</p>
                <ul className="mt-3 space-y-1.5">
                  {saudiDomainRecs(ex.root)
                    .slice(0, 4)
                    .map((r) => (
                      <li key={r.domain} dir="ltr" className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-signal">{r.domain}</span>
                        {r.premium && (
                          <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">premium</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Premium live checker */}
      <Reveal delay={0.08} className="mt-8">
        <PremiumGate>
          <div className="glass rounded-xl p-6">
            <label className="text-sm text-dune" htmlFor="domain-root">
              Your brand name
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="domain-root"
                value={root}
                onChange={(e) => setRoot(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder="yourbrand"
                dir="ltr"
                className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
              />
              <button
                onClick={run}
                disabled={busy}
                className="shrink-0 rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {busy ? "Checking…" : "Check domains"}
              </button>
            </div>

            {rows && rows.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-line text-start text-xs uppercase tracking-wide text-dune">
                      <th className="pb-3 text-start font-normal">Domain</th>
                      <th className="pb-3 text-start font-normal">First year</th>
                      <th className="pb-3 text-start font-normal">Best registrar</th>
                      <th className="pb-3 text-start font-normal">Renewal</th>
                      <th className="pb-3 text-end font-normal"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows
                      .slice()
                      .sort((a, b) => a.bestPrice - b.bestPrice)
                      .map((r) => (
                        <tr key={r.ext} className="border-b border-ink-line/60">
                          <td className="py-3" dir="ltr">
                            <span className="font-mono text-linen">
                              {checkedBrand}
                              <span className="text-gold">{r.ext}</span>
                            </span>
                            {r.available === true && (
                              <span className="ms-2 rounded bg-signal/10 px-1.5 py-0.5 text-[10px] text-signal">
                                ✓ available
                              </span>
                            )}
                            {r.available === false && (
                              <span className="ms-2 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                                taken
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="rounded bg-signal/10 px-2 py-0.5 font-mono text-signal">
                              ${r.bestPrice.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-dune">{r.bestRegistrar}</td>
                          <td className="py-3 font-mono text-dune">${r.renewal.toFixed(2)}</td>
                          <td className="py-3 text-end">
                            <a
                              href={r.buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold transition hover:bg-gold hover:text-ink"
                            >
                              Register ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs leading-relaxed text-dune/70">
                  {liveLabel}. Prices are indicative retail USD including first-term promotions —
                  always confirm at checkout.
                </p>
              </div>
            )}

            {/* Saudi market recommendations for the checked brand */}
            {checkedBrand && (
              <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-5">
                <p className="text-sm font-medium text-gold">Saudi market recommendations</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {saudiDomainRecs(checkedBrand).map((r) => (
                    <div key={r.domain} className="flex items-start justify-between gap-3 rounded-lg bg-ink/40 p-3">
                      <div>
                        <p dir="ltr" className="font-mono text-sm text-signal">{r.domain}</p>
                        <p className="mt-0.5 text-[11px] text-dune">{r.why}</p>
                      </div>
                      {r.premium && (
                        <span className="shrink-0 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">premium</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PremiumGate>
      </Reveal>

      {/* Feature list (public) */}
      <Reveal delay={0.1} className="mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Domain availability", desc: "Real-time availability across 20+ extensions." },
            { title: "Brand-domain matching", desc: "See which extensions and variants fit your brand best." },
            { title: "Alternative domains", desc: "Smart fallbacks when your first choice is taken." },
            { title: "Premium domain suggestions", desc: "High-value, scarce extensions for serious brands." },
            { title: "Saudi market recommendations", desc: ".sa, .com.sa and geo-variants built for KSA." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-ink-line p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-linen">
                <span className="text-signal">✓</span> {f.title}
              </p>
              <p className="mt-1 text-xs text-dune">{f.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </AppShell>
  );
}