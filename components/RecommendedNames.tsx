"use client";

/* RecommendedNames — the \"Recommended Business Names\" module.
 *
 * Generates 10 English names, 10 Arabic names, 5 premium brandable names,
 * and 5 SEO-friendly names for a business idea, each with a meaning,
 * industry fit, brand-strength score, domain-likelihood score, Arabic
 * transliteration, and Arabic brand version. Uses the deterministic KSA
 * naming engine (lib/naming.ts) so results are stable per idea.
 */

import { useEffect, useMemo, useState } from "react";
import { generateNames, type NameSuggestion } from "@/lib/naming";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

const GROUP_ORDER: { key: NameSuggestion["category"]; title: string; rtl?: boolean }[] = [
  { key: "english", title: "English names" },
  { key: "arabic", title: "Arabic names", rtl: true },
  { key: "brandable", title: "Premium brandable names" },
  { key: "seo", title: "SEO-friendly names" },
];

const CATEGORY_LABELS: Record<string, string> = {
  english: "English",
  arabic: "Arabic",
  brandable: "Premium",
  seo: "SEO",
};

const CATEGORY_COLORS: Record<string, string> = {
  english: "bg-signal/10 text-signal",
  arabic: "bg-gold/10 text-gold",
  brandable: "bg-violet-500/10 text-violet-400",
  seo: "bg-emerald-500/10 text-emerald-400",
};

const ACTIVITIES = [
  { id: "food", label: "Food & Beverage" },
  { id: "tech", label: "Technology & SaaS" },
  { id: "trade", label: "Trading & Retail" },
  { id: "consulting", label: "Consulting & Services" },
  { id: "industrial", label: "Industrial & Manufacturing" },
];

export function RecommendedNames({
  seed,
  activity,
  hint,
  autoGenerate = true,
}: {
  /** Stable seed so the same idea always yields the same names. */
  seed: string;
  activity?: string;
  /** Free-text business description to bias generation. */
  hint?: string;
  /** Auto-generate on mount (dashboard mode) vs. wait for the button (builder mode). */
  autoGenerate?: boolean;
}) {
  const { lang } = useI18n();
  const [idea, setIdea] = useState(hint ?? "");
  const [act, setAct] = useState(activity ?? "consulting");
  const [results, setResults] = useState<NameSuggestion[] | null>(null);
  const [busy, setBusy] = useState(false);

  function generate() {
    setBusy(true);
    setResults(null);
    // Simulate AI latency for a premium feel; results are deterministic.
    setTimeout(() => {
      setResults(generateNames({ seed: idea || seed, activity: act, hint: idea }));
      setBusy(false);
    }, 600);
  }

  useEffect(() => {
    if (autoGenerate) {
      setResults(generateNames({ seed, activity: act, hint }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    if (!results) return null;
    return GROUP_ORDER.map((g) => ({
      ...g,
      items: results.filter((r) => r.category === g.key),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div className="rounded-2xl border border-ink-line p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Recommended Business Names</p>
          <h2 className="mt-2 font-display text-xl md:text-2xl">
            30 brand-ready names for your idea
          </h2>
          <p className="mt-2 max-w-xl text-sm text-dune">
            10 English, 10 Arabic, 5 premium brandable, and 5 SEO-friendly options — each with
            meaning, industry fit, brand strength, and domain likelihood, plus Arabic
            transliteration and a natural Arabic brand version.
          </p>
        </div>
        <span className="rounded-full border border-signal/30 bg-signal/5 px-3 py-1 text-xs text-signal">
          AI-generated
        </span>
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="e.g. specialty coffee roastery in Riyadh"
          className="w-full rounded-full border border-ink-line bg-ink px-4 py-2.5 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
        />
        <select
          value={act}
          onChange={(e) => setAct(e.target.value)}
          className="shrink-0 rounded-full border border-ink-line bg-ink px-4 py-2.5 text-sm text-linen focus:outline-none"
        >
          {ACTIVITIES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          disabled={busy}
          className="shrink-0 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
        >
          {busy ? "Generating…" : "Generate names"}
        </button>
      </div>

      {grouped && (
        <div className="mt-8 space-y-8">
          {grouped.map((g) => (
            <Reveal key={g.key}>
              <div className="flex items-center gap-3">
                <h3 className="font-display text-lg">{g.title}</h3>
                <span className="rounded-full bg-ink-line px-2 py-0.5 font-mono text-[10px] text-dune">
                  {g.items.length}
                </span>
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {g.items.map((n) => (
                  <NameCard key={n.name} n={n} lang={lang} rtl={g.rtl} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {!grouped && !busy && (
        <p className="mt-6 text-sm text-dune">
          {autoGenerate
            ? "Generating names for your business…"
            : "Hit “Generate names” to see your recommended business names."}
        </p>
      )}
    </div>
  );
}

function NameCard({ n, lang, rtl }: { n: NameSuggestion; lang: string; rtl?: boolean }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(n.name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="rounded-xl border border-ink-line p-5 transition hover:border-signal/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`truncate font-display text-lg ${rtl ? "text-end" : ""}`} dir={rtl ? "rtl" : "ltr"}>
            {n.name}
          </p>
          <p className="mt-0.5 text-xs text-dune">{n.meaning}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${CATEGORY_COLORS[n.category]}`}>
          {CATEGORY_LABELS[n.category]}
        </span>
      </div>

      <p className="mt-2 text-xs text-dune">{n.industryFit}</p>

      {/* Arabic versions */}
      <div className="mt-3 space-y-1.5 rounded-lg bg-ink-soft/40 p-3">
        <p className="text-[10px] uppercase tracking-wide text-dune">Arabic transliteration</p>
        <p dir="rtl" className="font-display text-sm text-linen">{n.transliterationAr}</p>
        {n.brandVersionAr !== n.transliterationAr && (
          <>
            <p className="pt-1 text-[10px] uppercase tracking-wide text-dune">Arabic brand version</p>
            <p dir="rtl" className="font-display text-sm text-gold">{n.brandVersionAr}</p>
          </>
        )}
      </div>

      {/* Scores */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <ScorePill label={lang === "ar" ? "العلامة" : "Brand"} value={n.brandScore} />
        <ScorePill label={lang === "ar" ? "النطاق" : "Domain"} value={n.domainScore} />
        <button
          onClick={copy}
          className="ms-auto rounded-full border border-ink-line px-3 py-1 text-dune transition hover:border-dune hover:text-linen"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "text-signal" : value >= 60 ? "text-gold" : "text-dune";
  return (
    <span className="rounded-full bg-ink-line px-2.5 py-1 font-mono">
      <span className="text-dune">{label} </span>
      <span className={color}>{value}</span>
    </span>
  );
}