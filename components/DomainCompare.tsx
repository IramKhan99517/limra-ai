"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

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

export default function DomainCompare() {
  const { t } = useI18n();
  const [root, setRoot] = useState("");
  const [rows, setRows] = useState<DomainRow[] | null>(null);
  const [live, setLive] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      }
    } finally {
      setBusy(false);
    }
  }

  const clean = root.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const liveLabel = live
    ? `live availability via ${provider ?? "registrar"} API`
    : "indicative prices — connect a registrar API key for live data";

  return (
    <section id="domains" className="border-t border-ink-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("domains.eyebrow")}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{t("domains.title")}</h2>
          <p className="mt-3 max-w-xl text-sm text-dune">{t("domains.sub")}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass mt-12 rounded-xl p-6">
            <label className="text-sm text-dune" htmlFor="domain-root">
              {t("domains.inputLabel")}
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="domain-root"
                value={root}
                onChange={(e) => setRoot(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder={t("domains.placeholder")}
                dir="ltr"
                className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
              />
              <button
                onClick={run}
                disabled={busy}
                className="shrink-0 rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {busy ? t("domains.searching") : t("domains.search")}
              </button>
            </div>

            {rows && rows.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-line text-start text-xs uppercase tracking-wide text-dune">
                      <th className="pb-3 text-start font-normal">{t("domains.extension")}</th>
                      <th className="pb-3 text-start font-normal">{t("domains.price")}</th>
                      <th className="pb-3 text-start font-normal">{t("domains.registrar")}</th>
                      <th className="pb-3 text-start font-normal">{t("domains.renew")}</th>
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
                              {clean}
                              <span className="text-gold">{r.ext}</span>
                            </span>
                            {r.note && (
                              <span className="ms-2 rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                                {r.note}
                              </span>
                            )}
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
                            <span className="ms-1.5 text-xs text-dune">{t("domains.best")}</span>
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
                              {t("domains.buy")} ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs leading-relaxed text-dune/70">
                  {liveLabel} · {t("domains.note")}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
