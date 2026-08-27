"use client";

import { useMemo, useState } from "react";

const ACTIVITIES = [
  { id: "tech", label: "Technology & SaaS", base: 22000 },
  { id: "trade", label: "Trading & Retail", base: 26000 },
  { id: "consulting", label: "Consulting & Services", base: 19000 },
  { id: "industrial", label: "Industrial & Manufacturing", base: 34000 },
];

const STRUCTURES = [
  { id: "llc", label: "LLC (MISA)", modifier: 1 },
  { id: "branch", label: "Foreign Branch", modifier: 1.18 },
  { id: "rhq", label: "Regional HQ", modifier: 1.45 },
];

const IQAMA_COST = 3900;

export function Calculator() {
  const [activityId, setActivityId] = useState(ACTIVITIES[0].id);
  const [structureId, setStructureId] = useState(STRUCTURES[0].id);
  const [iqamas, setIqamas] = useState(2);

  const activity = ACTIVITIES.find((a) => a.id === activityId)!;
  const structure = STRUCTURES.find((s) => s.id === structureId)!;

  const { total, timeline } = useMemo(() => {
    const total = Math.round((activity.base * structure.modifier + iqamas * IQAMA_COST) / 100) * 100;
    const minDays = 4 + Math.round(structure.modifier * 2);
    const maxDays = minDays + 3 + (iqamas > 4 ? 2 : 0);
    return { total, timeline: `${minDays}-${maxDays}` };
  }, [activity, structure, iqamas]);

  return (
    <div className="grid gap-8 rounded-2xl border border-ink-line bg-ink-soft/60 p-6 md:grid-cols-2 md:p-10">
      <div className="space-y-6">
        <Field label="Business Activity">
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITIES.map((a) => (
              <OptionButton key={a.id} active={a.id === activityId} onClick={() => setActivityId(a.id)}>
                {a.label}
              </OptionButton>
            ))}
          </div>
        </Field>

        <Field label="Legal Structure">
          <div className="grid grid-cols-3 gap-2">
            {STRUCTURES.map((s) => (
              <OptionButton key={s.id} active={s.id === structureId} onClick={() => setStructureId(s.id)}>
                {s.label}
              </OptionButton>
            ))}
          </div>
        </Field>

        <Field label={`Residency Iqamas — ${iqamas}`}>
          <input
            type="range"
            min={0}
            max={10}
            value={iqamas}
            onChange={(e) => setIqamas(Number(e.target.value))}
            className="w-full accent-signal"
            aria-label="Number of residency iqamas"
          />
        </Field>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-signal/25 bg-ink p-6">
        <div>
          <p className="eyebrow">Estimated Year-1 Total</p>
          <p className="mt-2 font-mono text-4xl text-linen">
            SAR {total.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-dune">
            Includes MISA license, commercial registration, {iqamas} Iqama{iqamas === 1 ? "" : "s"}, and
            mandatory Year-1 fees.
          </p>
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-dune">Est. Timeline</p>
          <p className="font-mono text-2xl text-gold">{timeline} days</p>
          <p className="mt-4 text-xs text-dune">
            Indicative estimate only — not a quote. Actual costs and timelines vary by activity,
            legal structure, and authority.
          </p>
        </div>
        <a
          href="/signup"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
        >
          Start your setup
        </a>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-dune">{label}</p>
      {children}
    </div>
  );
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
        active
          ? "border-signal bg-signal/10 text-linen"
          : "border-ink-line text-dune hover:border-dune hover:text-linen"
      }`}
    >
      {children}
    </button>
  );
}
