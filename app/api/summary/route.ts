import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const entities = await sql`
      select id, name, owner, status, activity, saudization_score, created_at
      from entities
      where owner_id = ${auth.user.id}
      order by created_at desc
    `;

    if (entities.length === 0) {
      return NextResponse.json({ hasEntity: false });
    }

    const entity = entities[0];

    const roadmap = await sql`
      select id, order_index, title, description, document_type_id, status
      from roadmap_steps
      where entity_id = ${entity.id}
      order by order_index asc
    `;

    const [activeLicenses] = await sql`
      select count(*)::int as count from licenses where entity_id = ${entity.id} and status = 'approved'
    `;
    const [pendingFilings] = await sql`
      select count(*)::int as count from filings where entity_id = ${entity.id} and status in ('pending', 'overdue')
    `;
    const licensesExpiringSoon = await sql`
      select type, expiry_date from licenses
      where entity_id = ${entity.id} and expiry_date is not null
        and expiry_date <= now() + interval '30 days' and expiry_date >= now()
    `;

    const nextAction = roadmap.find((s: any) => s.status !== "done") ?? null;

    return NextResponse.json({
      hasEntity: true,
      entity,
      roadmap,
      nextAction,
      activeLicenses: activeLicenses.count,
      pendingFilings: pendingFilings.count,
      licensesExpiringSoon,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load dashboard summary." },
      { status: 500 }
    );
  }
}
