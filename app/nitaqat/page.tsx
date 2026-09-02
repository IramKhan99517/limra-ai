"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

type Entity = {
  id: number;
  name: string;
  saudization_score: string;
  status: string;
};

const NITAQAT_BANDS = [
  { name: "Platinum", min: 40, color: "bg-violet-500", textColor: "text-violet-400", badge: "nitaqat-platinum", desc: "Outstanding Saudization — access to premium government incentives and priority MISA services." },
  { name: "Green", min: 26, color: "bg-emerald-500", textColor: "text-emerald-400", badge: "nitaqat-green", desc: "Meets targets — visa privileges and smooth licensing." },
  { name: "Yellow", min: 13, color: "bg-amber-500", textColor: "text-amber-400", badge: "nitaqat-yellow", desc: "Below target — limited visa issuance, subject to monitoring." },
  { name: "Red", min: 0, color: "bg-red-500", textColor: "text-red-400", badge: "nitaqat-red", desc: "Significantly below target — visa restrictions, penalties, potential labor ban." },
];

const REGIONAL_BUSINESSES = [
  { name: "Najd Tech Solutions LLC", sector: "Technology", region: "Riyadh", score: 71, band: "Platinum", employees: 28, saudi: 20 },
  { name: "Falak Logistics", sector: "Logistics", region: "Dammam", score: 64, band: "Platinum", employees: 45, saudi: 29 },
  { name: "Dammam Steel Works", sector: "Industrial", region: "Eastern Province", score: 58, band: "Platinum", employees: 120, saudi: 70 },
  { name: "Riyadh Cloud Systems", sector: "Technology", region: "Riyadh", score: 45, band: "Platinum", employees: 15, saudi: 7 },
  { name: "Jeddah Retail Group", sector: "Trade & Retail", region: "Jeddah", score: 76, band: "Platinum", employees: 34, saudi: 26 },
  { name: "NEOM Advisory Partners", sector: "Consulting", region: "Tabuk / NEOM", score: 69, band: "Platinum", employees: 12, saudi: 8 },
  { name: "Tabuk Agri Innovations", sector: "Agriculture", region: "Tabuk", score: 38, band: "Green", employees: 22, saudi: 8 },
  { name: "Eastern Petrochem Services", sector: "Energy", region: "Eastern Province", score: 61, band: "Platinum", employees: 85, saudi: 52 },
  { name: "Makkah Hospitality Co.", sector: "Tourism", region: "Makkah", score: 29, band: "Yellow", employees: 40, saudi: 12 },
  { name: "Vision Data Labs", sector: "Technology", region: "Riyadh", score: 82, band: "Platinum", employees: 18, saudi: 15 },
  { name: "Qassim Manufacturing", sector: "Industrial", region: "Qassim", score: 55, band: "Platinum", employees: 65, saudi: 36 },
  { name: "Riyadh Regional HQ Trading", sector: "Trading", region: "Riyadh", score: 88, band: "Platinum", employees: 30, saudi: 26 },
];

const RECOMMENDATIONS = [
  { icon: "📋", title: "Audit your current headcount", desc: "Map every employee's nationality and contract type. Qiwa provides a Saudization report you can download." },
  { icon: "🎓", title: "Hire Saudi graduates", desc: "Tap into the Human Resources Development Fund (HRDF/Hadaf) subsidies — up to 50% salary support for Saudi hires." },
  { icon: "📈", title: "Promote Saudis to leadership", desc: "Nitaqat weighs senior Saudi roles more heavily. Creating Saudi managerial positions accelerates your band." },
  { icon: "🤝", title: "Partner with training programs", desc: "Monsha'at and TVTC run SME-focused Saudi talent programs — subsidized training with job placement." },
  { icon: "⏰", title: "Track quarterly", desc: "Your Nitaqat band is recalculated monthly. Check Qiwa every quarter to avoid surprises." },
  { icon: "📱", title: "Use Qiwa Digital Services", desc: "File Saudization reports, issue iqamas, and track compliance — all through the Qiwa platform." },
];

function getBand(score: number) {
  return NITAQAT_BANDS.find((b) => score >= b.min) ?? NITAQAT_BANDS[3];
}

export default function NitaqatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login");
        return;
      }
      setChecking(false);

      const { data } = await supabase
        .from("entities")
        .select("id, name, saudization_score, status")
        .eq("owner_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setEntities(data ?? []);
    }).catch(() => setChecking(false));
  }, [router]);

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="eyebrow">Nitaqat Tracker</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              Saudization <span className="italic text-signal">compliance dashboard</span>
            </h1>
            <p className="mt-3 max-w-xl text-dune">
              Monitor your Saudization (Nitaqat) ratio, understand your current band, and see how
              businesses across KSA are performing — all in one view.
            </p>
          </Reveal>

          {/* Nitaqat Band Visualization */}
          <Reveal delay={0.05} className="mt-12">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Nitaqat Bands</h2>
              <p className="mt-1 text-xs text-dune">
                Your band is determined by the percentage of Saudi nationals in your workforce.
                Bands are recalculated monthly by the Ministry of Human Resources (MHRSD).
              </p>
              <div className="mt-6 space-y-3">
                {NITAQAT_BANDS.map((band) => (
                  <div key={band.name} className="rounded-lg border border-ink-line/60 p-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${band.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-display text-sm ${band.textColor}`}>{band.name}</p>
                          <span className="font-mono text-[11px] text-dune">
                            {band.name === "Platinum" ? "40%+" : `${band.min}%+`}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-dune">{band.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Entity Saudization Scores — clickable */}
          {entities.length > 0 && (
            <Reveal delay={0.1} className="mt-8">
              <div className="rounded-xl border border-ink-line p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg">Your Businesses</h2>
                    <p className="mt-1 text-xs text-dune">
                      Saudization scores for your registered entities. Click to view details.
                    </p>
                  </div>
                  <a href="/dashboard" className="text-xs text-signal hover:underline">
                    View all →
                  </a>
                </div>
                <div className="mt-6 space-y-3">
                  {entities.map((entity) => {
                    const score = Number(entity.saudization_score);
                    const band = getBand(score);
                    return (
                      <a
                        key={entity.id}
                        href="/dashboard"
                        className="block rounded-lg border border-ink-line p-4 transition hover:border-signal/40 hover:bg-signal/5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-linen">{entity.name}</p>
                            <p className="mt-1 text-xs text-dune capitalize">Status: {entity.status}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-mono text-2xl ${band.textColor}`}>{score}%</p>
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${band.badge}`}>
                              {band.name}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-line">
                          <div
                            className={`h-full rounded-full transition-all ${band.color}`}
                            style={{ width: `${Math.min(score, 100)}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-dune">
                          <span>0%</span>
                          <span className="text-signal">View dashboard →</span>
                          <span>Platinum at 40%+</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {entities.length === 0 && (
            <Reveal delay={0.08} className="mt-8">
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 text-center">
                <p className="text-linen">No businesses on file yet</p>
                <p className="mt-2 text-sm text-dune">
                  Start your business setup to see Saudization tracking here.
                </p>
                <a
                  href="/onboarding"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft"
                >
                  Start your business
                </a>
              </div>
            </Reveal>
          )}

          {/* Regional Businesses Across KSA */}
          <Reveal delay={0.12} className="mt-12">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Businesses Across KSA</h2>
              <p className="mt-1 text-xs text-dune">
                How other businesses are performing on Saudization — browse by region and sector.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-line text-left text-dune">
                      <th className="pb-3 font-normal">Business</th>
                      <th className="pb-3 font-normal">Sector</th>
                      <th className="pb-3 font-normal">Region</th>
                      <th className="pb-3 font-normal">Score</th>
                      <th className="pb-3 font-normal">Band</th>
                      <th className="pb-3 font-normal">Saudi / Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REGIONAL_BUSINESSES.sort((a, b) => b.score - a.score).map((biz) => {
                      const band = getBand(biz.score);
                      return (
                        <tr key={biz.name} className="border-b border-ink-line/60 transition hover:bg-signal/5">
                          <td className="py-3 text-linen">{biz.name}</td>
                          <td className="py-3 text-dune">{biz.sector}</td>
                          <td className="py-3 text-dune">{biz.region}</td>
                          <td className={`py-3 font-mono ${band.textColor}`}>{biz.score}%</td>
                          <td className="py-3">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${band.badge}`}>
                              {band.name}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-dune">
                            {biz.saudi} / {biz.employees}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-dune">
                Illustrative sample data for orientation — real-time Saudization data is available through Qiwa.
              </p>
            </div>
          </Reveal>

          {/* Recommendations */}
          <Reveal delay={0.15} className="mt-12">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Improve Your Saudization</h2>
              <p className="mt-1 text-xs text-dune">
                Practical steps to move your Nitaqat band forward.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {RECOMMENDATIONS.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-ink-line/60 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{rec.icon}</span>
                      <div>
                        <p className="text-sm text-linen">{rec.title}</p>
                        <p className="mt-1 text-xs text-dune">{rec.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Key Resources */}
          <Reveal delay={0.2} className="mt-8">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Key Resources</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Qiwa (MHRSD)", url: "https://qiwa.sa", note: "Labor file, Saudization reports & iqama services" },
                  { name: "HRDF (Hadaf)", url: "https://hrdf.gov.sa", note: "Salary subsidies for Saudi employees" },
                  { name: "GOSI", url: "https://www.gosi.gov.sa", note: "Social insurance registration & contributions" },
                  { name: "Monsha'at", url: "https://monshaat.gov.sa", note: "SME Authority — Saudization programs for SMEs" },
                ].map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-ink-line p-4 transition hover:border-signal/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-linen">{r.name}</p>
                      <span className="text-dune transition group-hover:text-signal">↗</span>
                    </div>
                    <p className="mt-1 text-xs text-dune">{r.note}</p>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Disclaimer */}
          <Reveal delay={0.25} className="mt-6">
            <p className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-dune">
              <span className="font-medium text-gold">⚠ Verify with authorities.</span>{" "}
              Nitaqat thresholds and Saudization requirements change. Always confirm current
              requirements through{" "}
              <a href="https://qiwa.sa" target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">
                Qiwa
              </a>{" "}
              or the Ministry of Human Resources before making hiring decisions. LIMRA provides
              orientation, not legal advice.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
