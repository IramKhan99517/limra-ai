"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

type SummaryData = {
  activeLicenses: number;
  pendingFilings: number;
  avgSaudization: number;
  entityCount: number;
  activity: { week: string; score: string }[];
  entities: { id: number; name: string; owner: string; status: string; saudization_score: string }[];
  filings: { id: number; title: string; due_date: string; status: string; entity_name: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setChecking(false);
      fetch("/api/summary")
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then(setData)
        .catch(() => setError(true));
    });
  }, [router]);

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Command Dashboard</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Live operations overview</h1>
          </Reveal>

          {error && (
            <div className="mt-10 rounded-xl border border-gold/40 bg-gold/5 p-6 text-sm text-linen">
              <p className="font-medium text-gold">Couldn&apos;t load dashboard data.</p>
              <p className="mt-2 text-dune">Check that DATABASE_URL is configured correctly in Vercel.</p>
            </div>
          )}

          {data && (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-4">
                <StatCard label="Active Licenses" value={String(data.activeLicenses)} accent="signal" />
                <StatCard label="Pending Filings" value={String(data.pendingFilings)} accent="gold" />
                <StatCard label="Avg. Saudization" value={`${data.avgSaudization}%`} accent="signal" />
                <StatCard label="Tracked Entities" value={String(data.entityCount)} accent="gold" />
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                <Reveal className="lg:col-span-2">
                  <div className="rounded-xl border border-ink-line p-6">
                    <h2 className="font-display text-lg">Compliance activity, 8-week trend</h2>
                    <div className="mt-6 flex h-40 items-end gap-2">
                      {data.activity.map((a) => (
                        <div key={a.week} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t bg-signal/70"
                            style={{ height: `${Math.max(6, Number(a.score))}%` }}
                            title={`${a.week}: ${a.score}`}
                          />
                          <span className="text-[10px] text-dune">{a.week}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <div className="rounded-xl border border-ink-line p-6">
                    <h2 className="font-display text-lg">Upcoming filings</h2>
                    <ul className="mt-4 space-y-4">
                      {data.filings.map((f) => (
                        <li key={f.id} className="border-b border-ink-line/60 pb-3 text-sm last:border-0">
                          <p className="text-linen">{f.title}</p>
                          <p className="mt-1 text-xs text-dune">
                            {f.entity_name} · due {new Date(f.due_date).toLocaleDateString()}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                              f.status === "overdue" ? "bg-gold/20 text-gold" : "bg-signal/15 text-signal"
                            }`}
                          >
                            {f.status}
                          </span>
                        </li>
                      ))}
                      {data.filings.length === 0 && (
                        <p className="text-sm text-dune">No pending filings. All caught up.</p>
                      )}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="mt-8">
                <div className="overflow-x-auto rounded-xl border border-ink-line p-6">
                  <h2 className="font-display text-lg">Entities by localization score</h2>
                  <table className="mt-4 w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-line text-left text-dune">
                        <th className="pb-3 font-normal">Entity</th>
                        <th className="pb-3 font-normal">Owner</th>
                        <th className="pb-3 font-normal">Status</th>
                        <th className="pb-3 font-normal">Saudization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.entities.map((e) => (
                        <tr key={e.id} className="border-b border-ink-line/60">
                          <td className="py-3 text-linen">{e.name}</td>
                          <td className="py-3 text-dune">{e.owner}</td>
                          <td className="py-3 text-dune capitalize">{e.status}</td>
                          <td className="py-3 font-mono text-signal">{e.saudization_score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: "signal" | "gold" }) {
  return (
    <div className="rounded-xl border border-ink-line p-6">
      <p className="text-xs uppercase tracking-wide text-dune">{label}</p>
      <p className={`mt-2 font-mono text-3xl ${accent === "signal" ? "text-signal" : "text-gold"}`}>{value}</p>
    </div>
  );
}
