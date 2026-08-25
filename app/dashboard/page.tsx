"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { BUSINESS_ACTIVITIES } from "@/lib/documentTypes";

type RoadmapStep = {
  id: number;
  order_index: number;
  title: string;
  description: string;
  document_type_id: string | null;
  status: "pending" | "in_progress" | "done";
};

type SummaryData =
  | { hasEntity: false }
  | {
      hasEntity: true;
      entity: { id: number; name: string; activity: string; status: string; saudization_score: string };
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

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
            <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Command Dashboard</p>
                <h1 className="mt-3 font-display text-3xl md:text-4xl">Your business, one view</h1>
              </div>
              
                href="/onboarding"
                className="rounded-full border border-ink-line px-4 py-2 text-sm text-linen transition hover:border-dune"
                  >
                + Start another business
              </a>
            </div>
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
                  <h2 className="font-display text-lg">Your setup roadmap</h2>
                  <p className="mt-1 text-xs text-dune">
                    LIMRA guides you through each step. Final approval always comes from the relevant
                    Saudi government authority.
                  </p>
                  <ul className="mt-4 space-y-3">
                    {data.roadmap.map((step) => (
                      <li
                        key={step.id}
                        className="flex items-start justify-between gap-4 border-b border-ink-line/60 pb-3 last:border-0"
                      >
                        <div>
                          <p className={`text-sm ${step.status === "done" ? "text-dune line-through" : "text-linen"}`}>
                            {step.title}
                          </p>
                          <p className="mt-0.5 text-xs text-dune">{step.description}</p>
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
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
