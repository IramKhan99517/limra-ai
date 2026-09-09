"use client";

/* Contract Analyzer — /contract-analyzer
 *
 * Sign-in-gated: upload a contract (PDF / docx / txt), get a plain-language
 * summary, risk flags (from the deterministic rule engine), and the questions
 * to ask before signing — all bilingual (follows the site language toggle).
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";

type Risk = {
  id: string;
  severity: "high" | "medium" | "low";
  evidence: string;
};

type Analysis = {
  fileName: string;
  contractType: string | null;
  summary: string;
  keyTerms: string[];
  risks: Risk[];
  questions: string[];
  aiUsed: boolean;
};

const SEVERITY_STYLES: Record<Risk["severity"], string> = {
  high: "border-red-400/40 bg-red-400/5 text-red-300",
  medium: "border-gold/40 bg-gold/5 text-gold",
  low: "border-ink-line bg-ink-line/30 text-dune",
};

export default function ContractAnalyzerPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const [checking, setChecking] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!session?.user) {
          router.push("/login?returnTo=/contract-analyzer");
          return;
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  function pickFile(f: File | null) {
    setError(null);
    if (!f) return;
    const lower = f.name.toLowerCase();
    const ok = lower.endsWith(".pdf") || lower.endsWith(".docx") || lower.endsWith(".txt") || lower.endsWith(".md");
    if (!ok) {
      setError(t("contract.error.type"));
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError(t("contract.error.tooLarge"));
      return;
    }
    setFile(f);
  }

  async function analyze() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setAnalysis(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const form = new FormData();
      form.append("file", file);
      form.append("lang", lang);

      const res = await fetch("/api/contract-analyzer", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: form,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const key =
          json.error === "empty" ? "contract.error.empty"
          : json.error === "tooLarge" ? "contract.error.tooLarge"
          : json.error === "type" ? "contract.error.type"
          : "contract.error.failed";
        setError(t(key));
        return;
      }

      setAnalysis(await res.json());
    } catch {
      setError(t("contract.error.failed"));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setAnalysis(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (checking) return null;

  const riskCount = analysis?.risks.length ?? 0;
  const highCount = analysis?.risks.filter((r) => r.severity === "high").length ?? 0;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow">{t("contract.eyebrow")}</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">{t("contract.title")}</h1>
            <p className="mt-3 text-dune">{t("contract.sub")}</p>
          </Reveal>

          {/* Upload */}
          {!analysis && (
            <Reveal delay={0.05} className="mt-10">
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  pickFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition ${
                  dragOver ? "border-signal bg-signal/5" : "border-ink-line hover:border-dune"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-xl text-signal">
                  ⬆
                </span>
                <p className="mt-4 text-linen">{t("contract.dropzone")}</p>
                <p className="mt-1 text-xs text-dune">{t("contract.formats")}</p>
                <span className="mt-5 rounded-full border border-ink-line px-5 py-2 text-sm text-linen transition hover:border-dune">
                  {t("contract.choose")}
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {file && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-line bg-ink-soft/40 p-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-dune">{t("contract.fileName")}</p>
                    <p className="truncate text-linen">{file.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                      className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-gold hover:text-gold"
                    >
                      {t("contract.remove")}
                    </button>
                    <button
                      onClick={analyze}
                      disabled={busy}
                      className="rounded-full bg-signal px-5 py-2 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
                    >
                      {busy ? t("contract.analyzing") : t("contract.analyze")}
                    </button>
                  </div>
                </div>
              )}

              {busy && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-signal/30 bg-signal/5 p-4 text-sm text-signal">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                  {t("contract.analyzing")}
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-lg border border-gold/40 bg-gold/5 p-4 text-sm text-gold">
                  {error}
                </div>
              )}
            </Reveal>
          )}

          {/* Result */}
          {analysis && (
            <div className="mt-10 space-y-6">
              <Reveal>
                <div className="rounded-2xl border border-signal/30 bg-signal/5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-linen">{analysis.fileName}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-signal/15 px-2.5 py-1 font-mono text-signal">
                        {riskCount} {t("contract.result.heroRisk")}
                      </span>
                      {highCount > 0 && (
                        <span className="rounded-full bg-red-400/15 px-2.5 py-1 font-mono text-red-300">
                          {highCount} × {t("contract.result.severity.high")}
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="mt-4 font-display text-xl">{t("contract.result.summary")}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-linen">{analysis.summary}</p>
                  {analysis.keyTerms.length > 0 && (
                    <>
                      <h3 className="mt-4 text-xs uppercase tracking-wide text-dune">
                        {t("contract.result.keyTerms")}
                      </h3>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {analysis.keyTerms.map((kt, i) => (
                          <li
                            key={i}
                            dir={/[\u0600-\u06FF]/.test(kt) ? "rtl" : "ltr"}
                            className="rounded-full border border-ink-line bg-ink/40 px-3 py-1 text-xs text-dune"
                          >
                            {kt}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-ink-line p-6">
                  <h2 className="font-display text-xl">{t("contract.result.risks")}</h2>
                  {analysis.risks.length === 0 ? (
                    <p className="mt-3 text-sm text-dune">{t("contract.result.risksNone")}</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {analysis.risks.map((r, i) => (
                        <li key={i} className={`rounded-xl border p-4 ${SEVERITY_STYLES[r.severity]}`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium">{t(`contract.risk.${r.id}`)}</p>
                            <span className="rounded-full border border-current px-2 py-0.5 text-[10px] uppercase tracking-wide">
                              {t(`contract.result.severity.${r.severity}`)}
                            </span>
                          </div>
                          <p dir={lang === "ar" ? "rtl" : "ltr"} className="mt-1.5 text-sm text-linen">
                            {t(`contract.risk.${r.id}.desc`)}
                          </p>
                          {r.evidence && (
                            <p
                              dir="ltr"
                              className="mt-2 truncate rounded-lg bg-ink/60 px-3 py-1.5 font-mono text-[11px] text-dune"
                            >
                              “{r.evidence}”
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6">
                  <h2 className="font-display text-xl">{t("contract.result.questions")}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {analysis.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-linen">
                        <span className="mt-0.5 font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-xs text-dune">{t("contract.result.disclaimer")}</p>
                <button
                  onClick={reset}
                  className="mt-4 rounded-full border border-signal/50 px-6 py-3 text-sm text-signal transition hover:bg-signal hover:text-ink"
                >
                  {t("contract.result.newAnalysis")}
                </button>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
