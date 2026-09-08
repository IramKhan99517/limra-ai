"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Reveal } from "@/components/Reveal";
import { useSubscription } from "@/lib/paywall";

const GRANTS = [
  {
    name: "Monsha'at SME Development Program",
    provider: "Monsha'at (SME Authority)",
    type: "Grant / Subsidy",
    amount: "Up to SAR 200,000",
    eligibility: ["SME registered with Monsha'at", "Saudi-owned or majority Saudi-owned", "Operating for 6+ months"],
    actionPlan: "Register with Monsha'at → prepare 6 months of financials → apply with a growth plan covering equipment or training.",
    description: "Financial support for SME growth — covers equipment, marketing, training, and operational expansion costs.",
    url: "https://monshaat.gov.sa",
    deadline: "Rolling — apply anytime",
    difficulty: "Medium",
  },
  {
    name: "HRDF (Hadaf) Salary Support",
    provider: "Human Resources Development Fund",
    type: "Salary Subsidy",
    amount: "Up to 50% of salary (12 months)",
    eligibility: ["Registered with GOSI", "Hiring Saudi nationals", "Company Saudization below sector average"],
    actionPlan: "Register with GOSI → post jobs via Qiwa → claim the subsidy monthly per new Saudi hire.",
    description: "Covers up to 50% of a new Saudi hire's salary for 12 months — applies to SMEs and startups.",
    url: "https://hrdf.gov.sa",
    deadline: "Continuous",
    difficulty: "Easy",
  },
  {
    name: "Saudi Export Development Authority (Saudi Exports)",
    provider: "Saudi Exports",
    type: "Export Support",
    amount: "50–70% of export costs",
    eligibility: ["Saudi-registered company", "Exporting or planning to export", "Product/service meets quality standards"],
    actionPlan: "Get a free export-readiness consultation → build a market-entry plan → claim subsidies for trade shows and logistics.",
    description: "Subsidizes trade shows, marketing, certification, and logistics costs for Saudi exporters.",
    url: "https://saudiexportsa.com",
    deadline: "Per program cycle",
    difficulty: "Medium",
  },
  {
    name: "MISA Premium Residency Incentives",
    provider: "MISA",
    type: "Visa / Residency",
    amount: "Expedited processing + fee waivers",
    eligibility: ["Foreign investors with SAR 4M+ capital", "Strategic sector (tech, health, tourism)", "Creating 5+ Saudi jobs"],
    actionPlan: "Review MISA premium-residency criteria → structure your investment → apply with a job-creation plan.",
    description: "Premium residency pathway for qualifying foreign investors — includes expedited licensing and reduced fees.",
    url: "https://misa.gov.sa",
    deadline: "Continuous",
    difficulty: "Hard",
  },
  {
    name: "KAFD Startups Program",
    provider: "King Abdullah Financial District",
    type: "Workspace + Mentorship",
    amount: "Subsidized office space + SAR 50K seed",
    eligibility: ["Fintech, InsurTech, or WealthTech startup", "Incorporated in KSA", "MVP ready"],
    actionPlan: "Prepare your pitch deck + MVP demo → apply to the cohort → relocate to KAFD if accepted.",
    description: "Workspace in KAFD with mentorship, investor network access, and seed funding for qualifying fintech startups.",
    url: "https://www.kafd.sa",
    deadline: "Cohort-based — check website",
    difficulty: "Hard",
  },
  {
    name: "KSAPME Digital Transformation Grant",
    provider: "Monsha'at + CITC",
    type: "Digital Grant",
    amount: "Up to SAR 100,000",
    eligibility: ["SME registered in KSA", "Technology adoption or digital transformation project", "12+ months operating"],
    actionPlan: "Audit your current tools → pick a transformation project (POS, CRM, cloud) → apply with vendor quotes.",
    description: "Co-funded by CITC and Monsha'at to help SMEs digitize operations — POS systems, e-commerce, CRM, cloud migration.",
    url: "https://citr.gov.sa",
    deadline: "Rolling",
    difficulty: "Easy",
  },
  {
    name: "Tourism Development Fund (TDF)",
    provider: "Tourism Development Fund",
    type: "Loan + Grant",
    amount: "Up to SAR 2M (mixed loan/grant)",
    eligibility: ["Tourism or hospitality business", "Saudi-registered", "Feasibility study submitted"],
    actionPlan: "Commission a feasibility study → structure the financing mix → submit alongside your tourism license.",
    description: "Flexible financing for tourism projects — hotels, resorts, tour operators, adventure tourism, and heritage sites.",
    url: "https://tdf.sa",
    deadline: "Rolling",
    difficulty: "Medium",
  },
  {
    name: "NEOM Innovation Fund",
    provider: "NEOM",
    type: "Innovation Grant",
    amount: "Varies (project-based)",
    eligibility: ["Technology or sustainability focus", "Willing to locate in NEOM", "Innovative solution with NEOM alignment"],
    actionPlan: "Map your solution to a NEOM pillar → join the NEOM community → submit a project application.",
    description: "Funding for innovative projects aligned with NEOM's vision — renewable energy, circular economy, advanced mobility, biotech.",
    url: "https://www.neom.com",
    deadline: "Application-based",
    difficulty: "Hard",
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Hard: "bg-red-500/15 text-red-400",
};

export default function GrantsPage() {
  const { active, loading } = useSubscription();
  const [showMore, setShowMore] = useState(false);

  // Public users see the first 3 programs; premium sees everything.
  const visible = active ? GRANTS : GRANTS.slice(0, 3);

  return (
    <AppShell>
      <Reveal>
        <p className="eyebrow">Grants & Incentives</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Funding your KSA business — <span className="italic text-signal">what&apos;s available</span>
        </h1>
        <p className="mt-3 max-w-xl text-dune">
          Curated government grants, subsidies, and incentive programs for SMEs and startups in
          Saudi Arabia. Premium members get full recommendations, eligibility analysis, and
          step-by-step action plans.
        </p>
      </Reveal>

      {/* Quick Stats */}
      <Reveal delay={0.05} className="mt-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-ink-line p-4 text-center">
            <p className="font-mono text-2xl text-signal">{GRANTS.length}</p>
            <p className="mt-1 text-xs text-dune">Programs in database</p>
          </div>
          <div className="rounded-xl border border-ink-line p-4 text-center">
            <p className="font-mono text-2xl text-gold">SAR 2M+</p>
            <p className="mt-1 text-xs text-dune">Max single grant</p>
          </div>
          <div className="rounded-xl border border-ink-line p-4 text-center">
            <p className="font-mono text-2xl text-signal">50%</p>
            <p className="mt-1 text-xs text-dune">Max salary subsidy</p>
          </div>
        </div>
      </Reveal>

      {/* Benefits overview — always visible */}
      <Reveal delay={0.07} className="mt-8">
        <div className="rounded-2xl border border-signal/20 bg-signal/5 p-6">
          <p className="eyebrow">Why premium?</p>
          <h2 className="mt-2 font-display text-xl">Unlock full grant intelligence</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { t: "Full grant recommendations", d: "Every program matched to your industry." },
              { t: "Eligibility analysis", d: "See at a glance whether you qualify." },
              { t: "Action plans", d: "Step-by-step application paths, ready to execute." },
            ].map((b) => (
              <div key={b.t} className="rounded-xl border border-ink-line p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-linen">
                  <span className="text-signal">✓</span> {b.t}
                </p>
                <p className="mt-1 text-xs text-dune">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Grants list */}
      <div className="mt-10 space-y-6">
        {visible.map((grant, i) => (
          <Reveal key={grant.name} delay={i * 0.04}>
            <div className="rounded-xl border border-ink-line p-6 transition hover:border-signal/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg">{grant.name}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${DIFFICULTY_COLORS[grant.difficulty] ?? "bg-ink-line text-dune"}`}>
                      {grant.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-dune">
                    {grant.provider} · {grant.type}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm text-signal">{grant.amount}</p>
                  <p className="mt-0.5 text-[10px] text-dune">{grant.deadline}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-dune">{grant.description}</p>

              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wide text-gold">Eligibility</p>
                <ul className="mt-1 space-y-0.5">
                  {grant.eligibility.map((req) => (
                    <li key={req} className="text-xs text-dune">— {req}</li>
                  ))}
                </ul>
              </div>

              {active && (
                <div className="mt-4 rounded-lg border border-signal/20 bg-signal/5 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-signal">AI action plan</p>
                  <p className="mt-1 text-xs text-linen">{grant.actionPlan}</p>
                </div>
              )}

              <div className="mt-4">
                <a
                  href={grant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-signal/40 px-4 py-1.5 text-xs text-signal transition hover:bg-signal hover:text-ink"
                >
                  Apply / Learn more →
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Paywall: public sees limited examples + upgrade CTA */}
      {!active && !loading && (
        <Reveal delay={0.2} className="mt-8">
          <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6 text-center">
            <p className="font-display text-xl">
              {showMore ? "The rest is premium" : `See all ${GRANTS.length} programs`}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-dune">
              Full grant recommendations, eligibility analysis, industry-specific opportunities, and
              action plans — available to premium members.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {!showMore && (
                <button
                  onClick={() => setShowMore(true)}
                  className="rounded-full border border-ink-line px-5 py-2.5 text-sm text-dune transition hover:border-dune hover:text-linen"
                >
                  Show me more examples
                </button>
              )}
              <a
                href="/subscribe"
                className="rounded-full bg-signal px-6 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft"
              >
                Unlock full access
              </a>
            </div>
          </div>
        </Reveal>
      )}

      {/* Disclaimer */}
      <Reveal delay={0.35} className="mt-8">
        <p className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-dune">
          <span className="font-medium text-gold">⚠ Verify before applying.</span> Grant amounts,
          eligibility, and deadlines change frequently. Always confirm current details with the
          issuing authority. LIMRA provides orientation — the authority makes the final decision.
        </p>
      </Reveal>
    </AppShell>
  );
}