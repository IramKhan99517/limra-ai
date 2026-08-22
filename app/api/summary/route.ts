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

    return NextResponse.json({
      activeLicenses: activeLicenses.count,
      pendingFilings: pendingFilings.count,
      avgSaudization: Number(avgSaudization.avg),
      entityCount: entityCount.count,
      activity,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load dashboard summary. Is DATABASE_URL configured?" },
      { status: 500 }
    );
  }
}
