"use client";

import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

const GRANTS = [
  {
    name: "Monsha'at SME Development Program",
    provider: "Monsha'at (SME Authority)",
    type: "Grant / Subsidy",
    amount: "Up to SAR 200,000",
    eligibility: ["SME registered with Monsha'at", "Saudi-owned or majority Saudi-owned", "Operating for 6+ months"],
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
  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="eyebrow">Grants & Incentives</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              Funding your KSA business — <span className="italic text-signal">what&apos;s available</span>
            </h1>
            <p className="mt-3 max-w-xl text-dune">
              Curated list of government grants, subsidies, and incentive programs for SMEs and
              startups in Saudi Arabia. Updated from public sources — always verify eligibility
              with the issuing authority.
            </p>
          </Reveal>

          {/* Quick Stats */}
          <Reveal delay={0.05} className="mt-10">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-ink-line p-4 text-center">
                <p className="font-mono text-2xl text-signal">{GRANTS.length}</p>
                <p className="mt-1 text-xs text-dune">Programs listed</p>
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

          {/* Grants List */}
          <div className="mt-10 space-y-6">
            {GRANTS.map((grant, i) => (
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

          {/* Tips */}
          <Reveal delay={0.3} className="mt-12">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Tips for Grant Applications</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  { tip: "Register with Monsha'at first", desc: "Most SME grants require Monsha'at registration — it's free and takes 10 minutes online." },
                  { tip: "Keep financials ready", desc: "Having clean financial records (even basic) dramatically improves approval chances." },
                  { tip: "Apply early in the fiscal year", desc: "Many government budgets are allocated Jan–Mar. Apply early for best chances." },
                  { tip: "Use Saudi Exports for free help", desc: "Saudi Exports offers free consultation on export readiness and grant matching." },
                ].map((t, i) => (
                  <div key={i} className="rounded-lg border border-ink-line/60 p-4">
                    <p className="text-sm text-linen">{t.tip}</p>
                    <p className="mt-1 text-xs text-dune">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Disclaimer */}
          <Reveal delay={0.35} className="mt-8">
            <p className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-dune">
              <span className="font-medium text-gold">⚠ Verify before applying.</span>{" "}
              Grant amounts, eligibility, and deadlines change frequently. Always confirm current
              details with the issuing authority. LIMRA provides orientation — the authority
              makes the final decision.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
