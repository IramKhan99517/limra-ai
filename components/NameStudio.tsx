"use client";

import { useState } from "react";
import { checkTradeName, type NameResult } from "@/lib/legal";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

const RULES = [1, 2, 3, 4, 5];

export default function NameStudio() {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [result, setResult] = useState<NameResult | null>(null);
  const [busy, setBusy] = useState(false);

  function run() {
    if (!name.trim()) return;
    setBusy(true);
    setResult(null);
    setTimeout(() => {
      setResult(checkTradeName(name));
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
    <section id="namestudio" className="border-t border-ink-line px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("studio.eyebrow")}</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">{t("studio.title")}</h2>
          <p className="mt-3 max-w-xl text-sm text-dune">{t("studio.sub")}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal delay={0.05}>
            <div className="glass rounded-xl p-6">
              <label className="text-sm text-dune" htmlFor="trade-name">
                {t("studio.inputLabel")}
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="trade-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && run()}
                  placeholder={t("studio.placeholder")}
                  className="w-full rounded-full border border-ink-line bg-ink px-5 py-3 text-sm text-linen outline-none placeholder:text-dune/50 focus:border-signal/50"
                />
                <button
                  onClick={run}
                  disabled={busy}
                  className="shrink-0 rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
                >
                  {busy ? t("studio.checking") : t("studio.check")}
                </button>
              </div>

              {result && (
                <div className="mt-5">
                  <div className={`rounded-xl border p-4 ${verdictStyles[result.verdict]}`}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
                      {t("studio.result.title")}
                    </p>
                    <p className="mt-1 font-display text-xl">{t(verdictKey[result.verdict])}</p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {result.issues.map((i, idx) => (
                        <li key={idx} className="flex gap-2 leading-relaxed text-linen/90">
                          <span>
                            {i.severity === "block" ? "✕" : i.severity === "warn" ? "⚠" : "ℹ"}
                          </span>
                          <span>{lang === "ar" ? i.messageAr : i.message}</span>
                        </li>
                      ))}
                      {result.issues.length === 0 && <li>✓ {t("studio.result.pass")}</li>}
                    </ul>
                  </div>

                  {result.verdict !== "fail" && (
                    <div className="mt-4 rounded-xl border border-ink-line p-4">
                      <p className="text-sm text-gold">{t("studio.suggest.title")}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.suggestions.map((s) => (
                          <span
                            key={s}
                            dir="ltr"
                            className="rounded-full border border-ink-line bg-ink-soft px-3 py-1 font-mono text-xs text-dune"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-dune/70">{t("studio.suggest.note")}</p>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-dune/70">{t("studio.result.disclaimer")}</p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-gold rounded-xl p-6">
              <p className="eyebrow">{t("studio.rules")}</p>
              <ul className="mt-4 space-y-4">
                {RULES.map((r) => (
                  <li key={r} className="border-s-2 border-gold/40 ps-3">
                    <p className="text-sm text-linen">{t(`studio.rule${r}`)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-dune">
                      {t(`studio.rule${r}.desc`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
