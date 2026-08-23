import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
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
    const activity = await sql`
      select to_char(week_start, 'Mon DD') as week, round(avg(score), 1) as score
      from compliance_activity
      group by week_start
      order by week_start asc
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

    return NextResponse.json({
      activeLicenses: activeLicenses.count,
      pendingFilings: pendingFilings.count,
      avgSaudization: Number(avgSaudization.avg),
      entityCount: entityCount.count,
      activity,
      entities,
      filings,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load dashboard summary. Is DATABASE_URL configured?" },
      { status: 500 }
    );
  }
}
