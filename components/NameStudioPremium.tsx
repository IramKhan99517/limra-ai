"use client";

import { useMemo, useState } from "react";
import {
  checkKsaName,
  generateNames,
  type NameSuggestion,
  type NameResult,
} from "@/lib/naming";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

type Tab = "generate" | "check";

const CATEGORY_LABELS: Record<string, string> = {
  english: "English",
  arabic: "Arabic",
  brandable: "Premium Brandable",
  seo: "SEO-Friendly",
};

const CATEGORY_COLORS: Record<string, string> = {
  english: "bg-signal/10 text-signal",
  arabic: "bg-gold/10 text-gold",
  brandable: "bg-violet-500/10 text-violet-400",
  seo: "bg-emerald-500/10 text-emerald-400",
};

export default function NameStudioPremium() {
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<Tab>("generate");
  const [idea, setIdea] = useState("");
  const [activity, setActivity] = useState("consulting");
  const [results, setResults] = useState<NameSuggestion[] | null>(null);
  const [checkName, setCheckName] = useState("");
  const [checkResult, setCheckResult] = useState<NameResult | null>(null);
  const [busy, setBusy] = useState(false);

  const grouped = useMemo(() => {
    if (!results) return null;
    return {
      english: results.filter((r) => r.category === "english"),
      arabic: results.filter((r) => r.category === "arabic"),
      brandable: results.filter((r) => r.category === "brandable"),
      seo: results.filter((r) => r.category === "seo"),
    };
  }, [results]);

  function generate() {
    setBusy(true);
    setResults(null);
    // Simulate AI latency for a more premium feel.
    setTimeout(() => {
      setResults(generateNames({ seed: idea || "limra", activity, hint: idea }));
      setBusy(false);
    }, 700);
  }

  function runCheck() {
    if (!checkName.trim()) return;
    setBusy(true);
    setCheckResult(null);
    setTimeout(() => {
      setCheckResult(checkKsaName(checkName));
      setBusy(false);
    }, 450);
  }

  const verdictStyles: Record<string, string> = {
    pass: "border-signal/40 bg-signal/5 text-signal",
    warn: "border-gold/40 bg-gold/5 text-gold",
    fail: "border-red-500/40 bg-red-500/10 text-red-400",
  };
  const verdictKey: Record<string, string> = {
    pass: "studio.result.pass",
    warn: "studio.result.warn",
    fail: "studio.result.fail",
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2">
        <TabButton active={tab === "generate"} onClick={() => setTab("generate")}>
          ✦ Generate Names
        </TabButton>
        <TabButton active={tab === "check"} onClick={() => setTab("check")}>
          ◎ Check Suitability
        </TabButton>
      </div>

      {tab === "generate" && (
        <div className="mt-6">
          <div className="glass rounded-xl p-6">
            <label className="text-sm text-dune" htmlFor="studio-idea">
              Describe your business idea
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="studio-idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
                placeholder="e.g. specialty coffee roastery in Riyadh"
                className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
              />
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="shrink-0 rounded-full border border-ink-line bg-ink px-4 py-3 text-sm text-linen focus:outline-none"
              >
                <option value="food">Food & Beverage</option>
                <option value="tech">Technology & SaaS</option>
                <option value="trade">Trading & Retail</option>
                <option value="consulting">Consulting & Services</option>
                <option value="industrial">Industrial & Manufacturing</option>
              </select>
              <button
                onClick={generate}
                disabled={busy}
                className="shrink-0 rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {busy ? "Generating…" : "Generate names"}
              </button>
            </div>
          </div>

          {grouped && (
            <div className="mt-8 space-y-8">
              <NameGroup
                title="English names"
                count={grouped.english.length}
                items={grouped.english}
                lang={lang}
              />
              <NameGroup
                title="Arabic names"
                count={grouped.arabic.length}
                items={grouped.arabic}
                lang={lang}
                rtl
              />
              <NameGroup
                title="Premium brandable names"
                count={grouped.brandable.length}
                items={grouped.brandable}
                lang={lang}
              />
              <NameGroup
                title="SEO-friendly names"
                count={grouped.seo.length}
                items={grouped.seo}
                lang={lang}
              />
            </div>
          )}
        </div>
      )}

      {tab === "check" && (
        <div className="mt-6">
          <div className="glass rounded-xl p-6">
            <label className="text-sm text-dune" htmlFor="studio-check">
              Proposed business name
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="studio-check"
                value={checkName}
                onChange={(e) => setCheckName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runCheck()}
                placeholder="e.g. Falcon Heights Trading Company"
                className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
              />
              <button
                onClick={runCheck}
                disabled={busy}
                className="shrink-0 rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {busy ? "Checking…" : "Check name"}
              </button>
            </div>

            {checkResult && (
              <div className="mt-5">
                <div className={`rounded-xl border p-4 ${verdictStyles[checkResult.verdict]}`}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
                    Saudi naming rules result
                  </p>
                  <p className="mt-1 font-display text-xl">{t(verdictKey[checkResult.verdict])}</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {checkResult.issues.map((i, idx) => (
                      <li key={idx} className="flex gap-2 leading-relaxed text-linen/90">
                        <span>
                          {i.severity === "block" ? "✕" : i.severity === "warn" ? "⚠" : "ℹ"}
                        </span>
                        <span>{lang === "ar" ? i.messageAr : i.message}</span>
                      </li>
                    ))}
                    {checkResult.issues.length === 0 && <li>✓ No issues found</li>}
                  </ul>
                </div>

                {checkResult.verdict !== "fail" && (
                  <div className="mt-4 rounded-xl border border-ink-line p-4">
                    <p className="text-sm text-gold">Suggested alternatives</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {checkResult.suggestions.map((s) => (
                        <span
                          key={s}
                          dir="ltr"
                          className="rounded-full border border-ink-line bg-ink-soft px-3 py-1 font-mono text-xs text-dune"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-dune/70">
                  Indicative screening only — final name approval rests with the Saudi Ministry of
                  Commerce / Saudi Business Center.
                </p>
              </div>
            )}
          </div>

          <div className="glass-gold mt-6 rounded-xl p-6">
            <p className="eyebrow">KSA naming rules applied</p>
            <ul className="mt-4 space-y-4">
              {[
                { t: "Religious terms", d: "Names of God, religions, or sacred terms are rejected." },
                { t: "Place names", d: "Country and city names (Saudi, Riyadh, Jeddah…) cannot stand alone." },
                { t: "Regulated activities", d: "Banking, health, education, and similar names need prior authority approval." },
                { t: "Foreign names", d: "Foreign brand words are transliterated, not translated, in Arabic." },
                { t: "Legal form", d: "Company names should include or imply a legal form (LLC, establishment…)." },
              ].map((r) => (
                <li key={r.t} className="border-s-2 border-gold/40 ps-3">
                  <p className="text-sm text-linen">{r.t}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-dune">{r.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
        active ? "bg-signal text-ink" : "border border-ink-line text-dune hover:border-dune hover:text-linen"
      }`}
    >
      {children}
    </button>
  );
}

function NameGroup({
  title,
  count,
  items,
  lang,
  rtl,
}: {
  title: string;
  count: number;
  items: NameSuggestion[];
  lang: string;
  rtl?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <Reveal>
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg">{title}</h3>
        <span className="rounded-full bg-ink-line px-2 py-0.5 font-mono text-[10px] text-dune">{count}</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((n) => (
          <NameCard key={n.name} n={n} lang={lang} rtl={rtl} />
        ))}
      </div>
    </Reveal>
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
        <ScorePill label="Brand" value={n.brandScore} />
        <ScorePill label="Domain" value={n.domainScore} />
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