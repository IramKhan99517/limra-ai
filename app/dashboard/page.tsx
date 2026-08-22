import { sql } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const [activeLicenses] = await sql`
      select count(*)::int as count from licenses where status = 'approved'
    `;
    const [pendingFilings] = await sql`
      select count(*)::int as count from filings where status in ('pending', 'overdue')
    `;
    const [avgSaudization] = await sql`
      select coalesce(round(avg(saudization_score), 1), 0) as avg from entities
    `;
    const [entityCount] = await sql`
      select count(*)::int as count from entities
    `;
    const entities = await sql`
      select id, name, owner, status, saudization_score
      from entities
      order by saudization_score desc
      limit 8
    `;
    const filings = await sql`
      select f.id, f.title, f.due_date, f.status, e.name as entity_name
      from filings f
      join entities e on e.id = f.entity_id
      where f.status in ('pending', 'overdue')
      order by f.due_date asc
      limit 6
    `;
    const activity = await sql`
      select to_char(week_start, 'Mon DD') as week, round(avg(score), 1) as score
      from compliance_activity
      group by week_start
      order by week_start asc
    `;

    return {
      ok: true as const,
      activeLicenses: activeLicenses.count as number,
      pendingFilings: pendingFilings.count as number,
      avgSaudization: Number(avgSaudization.avg),
      entityCount: entityCount.count as number,
      entities: entities as any[],
      filings: filings as any[],
      activity: activity as { week: string; score: string }[],
    };
  } catch (error) {
    console.error(error);
    return { ok: false as const };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Command Dashboard</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Live operations overview</h1>
          </Reveal>

          {!data.ok && (
            <div className="mt-10 rounded-xl border border-gold/40 bg-gold/5 p-6 text-sm text-linen">
              <p className="font-medium text-gold">Database not connected yet.</p>
              <p className="mt-2 text-dune">
                Set <code className="rounded bg-ink-soft px-1.5 py-0.5 font-mono">DATABASE_URL</code>{" "}
                in your environment (Vercel → Project Settings → Environment Variables), run{" "}
                <code className="rounded bg-ink-soft px-1.5 py-0.5 font-mono">npm run seed</code>, and
                reload this page. See README.md for the full setup.
              </p>
            </div>
          )}

          {data.ok && (
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

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "signal" | "gold";
}) {
  return (
    <div className="rounded-xl border border-ink-line p-6">
      <p className="text-xs uppercase tracking-wide text-dune">{label}</p>
      <p className={`mt-2 font-mono text-3xl ${accent === "signal" ? "text-signal" : "text-gold"}`}>
        {value}
      </p>
    </div>
  );
}
