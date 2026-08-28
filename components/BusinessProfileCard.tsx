"use client";

import { useEffect, useState } from "react";
import { BUSINESS_ACTIVITIES, type BusinessActivity } from "@/lib/documentTypes";
import {
  OWNERSHIP_OPTIONS,
  LEGAL_STRUCTURE_OPTIONS,
  JOURNEY_STAGES,
  normalizeProfile,
  flattenJourney,
  formatSar,
  type Ownership,
  type LegalStructure,
} from "@/lib/ksaJourney";

type Entity = {
  activity: string;
  ownership?: string | null;
  legal_structure?: string | null;
};

type RoadmapStep = { stage: string | null; status: "pending" | "in_progress" | "done" };

export function BusinessProfileCard({
  entity,
  roadmap,
  rebuilding,
  onRebuild,
}: {
  entity: Entity;
  roadmap: RoadmapStep[];
  rebuilding: boolean;
  onRebuild: (activity: string, ownership: string, legalStructure: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [activity, setActivity] = useState<BusinessActivity>(entity.activity as BusinessActivity);
  const [ownership, setOwnership] = useState<Ownership>((entity.ownership as Ownership) ?? "saudi_gcc");
  const [legalStructure, setLegalStructure] = useState<LegalStructure>(
    (entity.legal_structure as LegalStructure) ?? "llc",
  );

  // Keep the editor in sync when a rebuild swaps in fresh entity values.
  useEffect(() => {
    setActivity(entity.activity as BusinessActivity);
    setOwnership((entity.ownership as Ownership) ?? "saudi_gcc");
    setLegalStructure((entity.legal_structure as LegalStructure) ?? "llc");
  }, [entity.activity, entity.ownership, entity.legal_structure]);

  // Foreign investors can't use a sole establishment — keep the selection legal.
  useEffect(() => {
    if (ownership === "foreign" && legalStructure === "sole_establishment") {
      setLegalStructure("llc");
    }
  }, [ownership, legalStructure]);

  const activityLabel =
    BUSINESS_ACTIVITIES.find((a) => a.id === entity.activity)?.label ?? entity.activity;
  const ownershipLabel =
    OWNERSHIP_OPTIONS.find((o) => o.id === entity.ownership)?.label ?? "Ownership not set";
  const legalLabel =
    LEGAL_STRUCTURE_OPTIONS.find((l) => l.id === entity.legal_structure)?.label ?? "Structure not set";
  const isForeign = entity.ownership === "foreign";

  // Engine-derived read — deterministic, no fabricated numbers. Fees are the
  // sum of the same indicative estimates shown on each step, flagged verify.
  const profile = normalizeProfile({
    activity: entity.activity as BusinessActivity,
    ownership: entity.ownership,
    legalStructure: entity.legal_structure,
  });
  const engineSteps = flattenJourney(profile);
  const stageCount = new Set(engineSteps.map((s) => s.stageKey)).size;
  const feeLo = engineSteps.reduce((sum, s) => sum + (s.estFeeSar?.[0] ?? 0), 0);
  const feeHi = engineSteps.reduce((sum, s) => sum + (s.estFeeSar?.[1] ?? 0), 0);
  const tip = `${engineSteps.length} setup steps across ${stageCount} stages. ${
    isForeign
      ? "Foreign ownership adds a MISA investment license up front, before Commercial Registration."
      : "As a Saudi/GCC-owned entity you skip the MISA investment license and go straight to Commercial Registration."
  } Indicative government fees total ${formatSar([feeLo, feeHi]) ?? "SAR —"}.`;

  // Per-stage completion for the journey rail.
  const stageStats = JOURNEY_STAGES.map((stage) => {
    const steps = roadmap.filter((r) => r.stage === stage.key);
    const done = steps.filter((r) => r.status === "done").length;
    return { key: stage.key, label: stage.label, order: stage.order, total: steps.length, done };
  }).filter((s) => s.total > 0);
  const totalSteps = stageStats.reduce((n, s) => n + s.total, 0);
  const totalDone = stageStats.reduce((n, s) => n + s.done, 0);
  const currentIndex = stageStats.findIndex((s) => s.done < s.total);
  const current = currentIndex === -1 ? null : stageStats[currentIndex];

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-line">
      {/* Accent rail — a thin gradient that reads as "a path", not decoration. */}
      <div className="h-1 w-full bg-gradient-to-r from-signal via-gold/50 to-transparent" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Business profile</p>
            <p className="mt-1 text-sm text-dune">How LIMRA tailors your roadmap.</p>
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="shrink-0 rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-dune hover:text-linen"
            aria-expanded={editing}
          >
            {editing ? "Close" : "Adjust ✎"}
          </button>
        </div>

        {/* Profile chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-ink-line bg-ink-soft/40 px-3 py-1 text-xs text-linen">
            {activityLabel}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              isForeign ? "border-gold/40 bg-gold/5 text-gold" : "border-signal/40 bg-signal/5 text-signal"
            }`}
          >
            {ownershipLabel}
          </span>
          <span className="rounded-full border border-ink-line bg-ink-soft/40 px-3 py-1 text-xs text-linen">
            {legalLabel}
          </span>
        </div>

        {/* Engine read / AI tip */}
        <div className="mt-4 rounded-xl border border-ink-line bg-ink-soft/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-signal">✦ LIMRA read</p>
            <span
              className="rounded-full border border-gold/40 px-2 py-0.5 text-[11px] text-gold"
              title="Indicative estimate from public sources — confirm with the authority. Not a quote."
            >
              indicative · verify
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-dune">{tip}</p>
        </div>

        {/* Journey rail — the signature element. Each segment is one stage; fill
            shows completion, so the whole setup path is legible at a glance. */}
        {stageStats.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dune">Your setup journey</span>
              <span className="font-mono text-signal">
                {totalDone}/{totalSteps} steps
              </span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {stageStats.map((s) => {
                const pct = s.total ? (s.done / s.total) * 100 : 0;
                const complete = s.done === s.total;
                return (
                  <div
                    key={s.key}
                    className="group relative flex-1"
                    title={`${String(s.order).padStart(2, "0")} ${s.label} — ${s.done}/${s.total} done`}
                  >
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink-line">
                      <div
                        className={`h-full rounded-full transition-all ${complete ? "bg-signal" : "bg-gold"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-dune">
              {current ? (
                <>
                  Now on stage {current.order} of {JOURNEY_STAGES.length}:{" "}
                  <span className="text-linen">{current.label}</span>
                </>
              ) : (
                <span className="text-signal">All stages complete — verify each approval with its authority.</span>
              )}
            </p>
          </div>
        )}

        {/* Editor */}
        {editing && (
          <div className="mt-5 border-t border-ink-line/60 pt-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Business type</span>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as BusinessActivity)}
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
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Legal structure</span>
                <select
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value as LegalStructure)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {LEGAL_STRUCTURE_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id} disabled={ownership === "foreign" && !o.foreignAllowed}>
                      {o.label}
                      {ownership === "foreign" && !o.foreignAllowed ? " — Saudi/GCC only" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onRebuild(activity, ownership, legalStructure)}
                disabled={rebuilding}
                className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
              >
                {rebuilding ? "Rebuilding…" : "Rebuild my roadmap"}
              </button>
              <p className="text-[11px] text-dune">
                Completed steps are kept; only the remaining path is regenerated.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
