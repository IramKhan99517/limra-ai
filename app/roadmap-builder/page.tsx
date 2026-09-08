"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { PremiumGate, useSubscription } from "@/lib/paywall";
import { AppShell } from "@/components/AppShell";
import { Reveal } from "@/components/Reveal";
import { RecommendedNames } from "@/components/RecommendedNames";
import { BUSINESS_ACTIVITIES } from "@/lib/documentTypes";
import {
  OWNERSHIP_OPTIONS,
  LEGAL_STRUCTURE_OPTIONS,
  buildJourney,
  normalizeProfile,
  formatSar,
  formatDays,
  type Ownership,
  type LegalStructure,
  type BusinessProfile,
} from "@/lib/ksaJourney";

const EXAMPLES = [
  "I want to start a food business in Saudi Arabia",
  "I'm opening a software consultancy in Riyadh",
  "I want to import and sell electronics",
];

type Generated = {
  profile: BusinessProfile;
  groups: ReturnType<typeof buildJourney>;
  totalFee: [number, number];
  totalDays: [number, number];
  idea: string;
};

export default function RoadmapBuilderPage() {
  const router = useRouter();
  const { loading } = useSubscription();
  const [checking, setChecking] = useState(true);
  const [idea, setIdea] = useState("");
  const [activity, setActivity] = useState("consulting");
  const [ownership, setOwnership] = useState<Ownership>("saudi_gcc");
  const [legalStructure, setLegalStructure] = useState<LegalStructure>("llc");
  const [busy, setBusy] = useState(false);
  const [generated, setGenerated] = useState<Generated | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login?returnTo=/roadmap-builder");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  // Foreign investors cannot use a sole establishment — keep the form legal.
  useEffect(() => {
    if (ownership === "foreign" && legalStructure === "sole_establishment") {
      setLegalStructure("llc");
    }
  }, [ownership, legalStructure]);

  function build() {
    if (!idea.trim()) return;
    setBusy(true);
    setGenerated(null);
    // Deterministic engine + simulated AI latency for the premium feel.
    setTimeout(() => {
      const profile = normalizeProfile({
        activity: activity as BusinessProfile["activity"],
        ownership,
        legalStructure,
      });
      const groups = buildJourney(profile);
      const steps = groups.flatMap((g) => g.steps);
      const feeLo = steps.reduce((sum, s) => sum + (s.estFeeSar?.[0] ?? 0), 0);
      const feeHi = steps.reduce((sum, s) => sum + (s.estFeeSar?.[1] ?? 0), 0);
      const dayLo = steps.reduce((sum, s) => sum + (s.estDays?.[0] ?? 0), 0);
      const dayHi = steps.reduce((sum, s) => sum + (s.estDays?.[1] ?? 0), 0);
      setGenerated({ profile, groups, totalFee: [feeLo, feeHi], totalDays: [dayLo, dayHi], idea });
      setBusy(false);
    }, 800);
  }

  if (checking || loading) return null;

  return (
    <AppShell>
      <Reveal>
        <p className="eyebrow">Roadmap Builder</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Your Saudi setup roadmap — with branding built in
        </h1>
        <p className="mt-3 max-w-xl text-dune">
          Describe your business and LIMRA AI maps your activity to the exact licenses and documents
          you need across Saudi authorities — and suggests brand-ready business names alongside
          your roadmap.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <PremiumGate>
          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block lg:col-span-2">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">
                  Business idea
                </span>
                <textarea
                  rows={3}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. I want to start a specialty coffee roastery in Riyadh"
                  className="w-full rounded-lg border border-ink-line bg-ink px-4 py-3 text-sm text-linen placeholder:text-dune/50 focus:border-signal/50 focus:outline-none"
                />
                <span className="mt-2 flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setIdea(ex)}
                      className="rounded-full border border-ink-line px-3 py-1 text-xs text-dune transition hover:border-dune hover:text-linen"
                    >
                      {ex}
                    </button>
                  ))}
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">
                  Business type
                </span>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {BUSINESS_ACTIVITIES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Ownership</span>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as Ownership)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {OWNERSHIP_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-[11px] text-dune">
                  {OWNERSHIP_OPTIONS.find((o) => o.id === ownership)?.hint}
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Legal structure</span>
                <select
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value as LegalStructure)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {LEGAL_STRUCTURE_OPTIONS.map((o) => (
                    <option
                      key={o.id}
                      value={o.id}
                      disabled={ownership === "foreign" && !o.foreignAllowed}
                    >
                      {o.label}
                      {ownership === "foreign" && !o.foreignAllowed ? " — Saudi/GCC only" : ""}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-[11px] text-dune">
                  {LEGAL_STRUCTURE_OPTIONS.find((o) => o.id === legalStructure)?.hint}
                </span>
              </label>

              <div className="flex items-end lg:col-span-2">
                <button
                  onClick={build}
                  disabled={busy || !idea.trim()}
                  className="rounded-full bg-signal px-7 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
                >
                  {busy ? "Building your roadmap…" : "Generate roadmap + names"}
                </button>
              </div>
            </div>
          </div>
        </PremiumGate>
      </Reveal>

      {generated && (
        <>
          <Reveal delay={0.06} className="mt-8">
            <div className="rounded-2xl border border-ink-line p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Your setup roadmap</p>
                  <h2 className="mt-2 font-display text-xl md:text-2xl">
                    {generated.groups.length} stages · {generated.groups.flatMap((g) => g.steps).length} steps
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  <span className="rounded-full bg-ink-line px-3 py-1.5 text-linen">
                    Fees: {formatSar(generated.totalFee)}
                  </span>
                  <span className="rounded-full bg-ink-line px-3 py-1.5 text-linen">
                    Timeline: {formatDays(generated.totalDays)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {generated.groups.map((g) => (
                  <div key={g.stage.key}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold">
                        {String(g.stage.order).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-sm uppercase tracking-wide text-linen">
                        {g.stage.label}
                      </h3>
                    </div>
                    <ul className="mt-2 space-y-2.5">
                      {g.steps.map((s) => (
                        <li key={s.key} className="rounded-lg border border-ink-line/60 p-3.5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm text-linen">{s.title}</p>
                              <p className="mt-0.5 text-xs text-dune">{s.description}</p>
                            </div>
                            <a
                              href={s.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-xs text-signal hover:underline"
                            >
                              {s.authority} portal →
                            </a>
                          </div>
                          {(formatSar(s.estFeeSar) || formatDays(s.estDays)) && (
                            <p className="mt-2 flex flex-wrap gap-2 text-[11px] text-dune">
                              {formatSar(s.estFeeSar) && (
                                <span className="rounded-full bg-ink-line px-2 py-0.5">{formatSar(s.estFeeSar)}</span>
                              )}
                              {formatDays(s.estDays) && (
                                <span className="rounded-full bg-ink-line px-2 py-0.5">{formatDays(s.estDays)}</span>
                              )}
                              <span className="rounded-full border border-gold/40 px-2 py-0.5 text-gold">
                                indicative · verify
                              </span>
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-dune/70">
                Indicative orientation only — final approvals, fees, and timelines always come from
                the relevant Saudi authority.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-8">
            <RecommendedNames seed={generated.idea || "limra"} activity={activity} hint={generated.idea} autoGenerate={false} />
          </Reveal>
        </>
      )}
    </AppShell>
  );
}