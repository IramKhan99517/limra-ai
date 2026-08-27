"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { BUSINESS_ACTIVITIES } from "@/lib/documentTypes";
import { JOURNEY_STAGES, getStep, formatSar, formatDays } from "@/lib/ksaJourney";

type RoadmapStep = {
  id: number;
  order_index: number;
  title: string;
  description: string;
  document_type_id: string | null;
  status: "pending" | "in_progress" | "done";
  step_key: string | null;
  stage: string | null;
};

type SummaryData =
  | { hasEntity: false }
  | {
      hasEntity: true;
      entity: {
        id: number;
        name: string;
        activity: string;
        status: string;
        saudization_score: string;
        ownership?: string | null;
        legal_structure?: string | null;
      };
      roadmap: RoadmapStep[];
      nextAction: RoadmapStep | null;
      activeLicenses: number;
      pendingFilings: number;
      licensesExpiringSoon: { type: string; expiry_date: string }[];
    };

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [explainingId, setExplainingId] = useState<number | null>(null);
  const [explanations, setExplanations] = useState<Record<number, string>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setChecking(false);
    try {
      const res = await fetch("/api/summary", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError(true);
    }
  }

  async function toggleStep(step: RoadmapStep) {
    setUpdatingId(step.id);
    const { data: { session } } = await supabase.auth.getSession();
    const nextStatus = step.status === "done" ? "pending" : "done";
    await fetch("/api/roadmap", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ id: step.id, status: nextStatus }),
    });
    await load();
    setUpdatingId(null);
  }

  async function explainStep(step: RoadmapStep) {
    if (!data || !data.hasEntity || !step.step_key) return;
    setExplainingId(step.id);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const res = await fetch("/api/journey/assist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ entityId: data.entity.id, stepKey: step.step_key }),
      });
      const json = await res.json();
      setExplanations((prev) => ({
        ...prev,
        [step.id]: json.answer ?? "Couldn't load guidance right now.",
      }));
    } catch {
      setExplanations((prev) => ({ ...prev, [step.id]: "Couldn't load guidance right now." }));
    } finally {
      setExplainingId(null);
    }
  }

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="eyebrow">Command Dashboard</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Your business, one view</h1>
          </Reveal>

          {error && (
            <div className="mt-10 rounded-xl border border-gold/40 bg-gold/5 p-6 text-sm text-linen">
              <p className="font-medium text-gold">Couldn&apos;t load your dashboard.</p>
              <p className="mt-2 text-dune">Check that DATABASE_URL and Supabase keys are configured correctly.</p>
            </div>
          )}

          {data && !data.hasEntity && (
            <Reveal delay={0.05} className="mt-10">
              <div className="rounded-xl border border-signal/40 bg-signal/5 p-8 text-center">
                <p className="font-display text-xl">You haven&apos;t started a business yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-dune">
                  Tell LIMRA AI what you want to do, and we&apos;ll build a personalized setup
                  roadmap for you — documents, licenses, and next steps, tailored to your business.
                </p>
                <a
                  href="/onboarding"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
                >
                  Start your business
                </a>
              </div>
            </Reveal>
          )}

          {data && data.hasEntity && (
            <>
              <Reveal delay={0.05} className="mt-10">
                <div className="rounded-xl border border-ink-line p-6">
                  <p className="eyebrow">
                    {BUSINESS_ACTIVITIES.find((a) => a.id === data.entity.activity)?.label ?? data.entity.activity}
                  </p>
                  <h2 className="mt-1 font-display text-2xl">{data.entity.name}</h2>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-dune">Status</p>
                      <p className="mt-1 capitalize text-linen">{data.entity.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dune">Active licenses</p>
                      <p className="mt-1 font-mono text-signal">{data.activeLicenses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dune">Pending filings</p>
                      <p className="mt-1 font-mono text-gold">{data.pendingFilings}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {data.nextAction && (
                <Reveal delay={0.08} className="mt-6">
                  <div className="rounded-xl border border-signal/40 bg-signal/5 p-5">
                    <p className="text-xs uppercase tracking-wide text-signal">Recommended next action</p>
                    <p className="mt-1 text-linen">{data.nextAction.title}</p>
                    <p className="mt-1 text-sm text-dune">{data.nextAction.description}</p>
                    {data.nextAction.document_type_id && (
                      <a href="/vault" className="mt-2 inline-block text-xs text-signal hover:underline">
                        Go to Document Vault →
                      </a>
                    )}
                  </div>
                </Reveal>
              )}

              {data.licensesExpiringSoon.length > 0 && (
                <Reveal delay={0.1} className="mt-6">
                  <div className="rounded-xl border border-gold/40 bg-gold/5 p-5">
                    <p className="text-xs uppercase tracking-wide text-gold">Renewals due within 30 days</p>
                    <ul className="mt-2 space-y-1 text-sm text-linen">
                      {data.licensesExpiringSoon.map((l, i) => (
                        <li key={i}>
                          {l.type} — due {new Date(l.expiry_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.12} className="mt-8">
                <div className="rounded-xl border border-ink-line p-6">
                  {(() => {
                    const roadmap = data.roadmap;
                    const byKey = new Map<string, RoadmapStep>();
                    roadmap.forEach((s) => {
                      if (s.step_key) byKey.set(s.step_key, s);
                    });
                    const doneCount = roadmap.filter((s) => s.status === "done").length;
                    const knownStages = new Set(JOURNEY_STAGES.map((s) => s.key));
                    const grouped = JOURNEY_STAGES.map((stage) => ({
                      stage,
                      steps: roadmap.filter((s) => s.stage === stage.key),
                    })).filter((g) => g.steps.length > 0);
                    const ungrouped = roadmap.filter((s) => !s.stage || !knownStages.has(s.stage));

                    const renderStep = (step: RoadmapStep) => {
                      const engineStep = getStep(step.step_key);
                      const fee = engineStep ? formatSar(engineStep.estFeeSar) : null;
                      const days = engineStep ? formatDays(engineStep.estDays) : null;
                      const unmet = (engineStep?.dependsOn ?? [])
                        .map((dk) => byKey.get(dk))
                        .filter((s): s is RoadmapStep => !!s && s.status !== "done")
                        .map((s) => s.title);
                      return (
                        <li key={step.id} className="border-b border-ink-line/60 pb-4 last:border-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className={`text-sm ${step.status === "done" ? "text-dune line-through" : "text-linen"}`}>
                                {step.title}
                              </p>
                              <p className="mt-0.5 text-xs text-dune">{step.description}</p>
                              {engineStep && (
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-dune">
                                  <span className="rounded-full bg-ink-line px-2 py-0.5">{engineStep.authority}</span>
                                  {fee && <span>{fee}</span>}
                                  {days && <span>· {days}</span>}
                                  <span
                                    className="rounded-full border border-gold/40 px-2 py-0.5 text-gold"
                                    title="Indicative estimate from public sources — confirm with the authority. Not a quote."
                                  >
                                    indicative · verify
                                  </span>
                                </div>
                              )}
                              {unmet.length > 0 && (
                                <p className="mt-1 text-[11px] text-gold/80">Complete first: {unmet.join(", ")}</p>
                              )}
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                                {step.document_type_id && (
                                  <a href="/vault" className="text-signal hover:underline">
                                    Go to Vault →
                                  </a>
                                )}
                                {engineStep && (
                                  <a
                                    href={engineStep.portalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-signal hover:underline"
                                  >
                                    {engineStep.authority} portal →
                                  </a>
                                )}
                                {step.step_key && (
                                  <button
                                    onClick={() => explainStep(step)}
                                    disabled={explainingId === step.id}
                                    className="text-dune transition hover:text-linen disabled:opacity-60"
                                  >
                                    {explainingId === step.id ? "Thinking…" : "✦ Explain this step"}
                                  </button>
                                )}
                              </div>
                              {explanations[step.id] && (
                                <div className="mt-2 whitespace-pre-wrap rounded-lg border border-ink-line bg-ink-soft/40 p-3 text-xs text-dune">
                                  {explanations[step.id]}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => toggleStep(step)}
                              disabled={updatingId === step.id}
                              className={`shrink-0 rounded-full border px-3 py-1 text-xs transition ${
                                step.status === "done"
                                  ? "border-signal/40 text-signal"
                                  : "border-ink-line text-dune hover:border-dune hover:text-linen"
                              }`}
                            >
                              {step.status === "done" ? "Done ✓" : "Mark done"}
                            </button>
                          </div>
                        </li>
                      );
                    };

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <h2 className="font-display text-lg">Your setup roadmap</h2>
                          <span className="font-mono text-xs text-signal">
                            {doneCount} / {roadmap.length}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-dune">
                          A step-by-step Saudi setup path built for your business. Fees and timelines are
                          indicative and flagged for verification; final approval always comes from the
                          relevant government authority.
                        </p>

                        <div className="mt-6 space-y-8">
                          {grouped.map((group) => (
                            <div key={group.stage.key}>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-gold">
                                  {String(group.stage.order).padStart(2, "0")}
                                </span>
                                <h3 className="font-display text-sm uppercase tracking-wide text-linen">
                                  {group.stage.label}
                                </h3>
                              </div>
                              <ul className="mt-3 space-y-4">{group.steps.map(renderStep)}</ul>
                            </div>
                          ))}

                          {ungrouped.length > 0 && (
                            <div>
                              <h3 className="font-display text-sm uppercase tracking-wide text-linen">
                                Your roadmap
                              </h3>
                              <ul className="mt-3 space-y-4">{ungrouped.map(renderStep)}</ul>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
