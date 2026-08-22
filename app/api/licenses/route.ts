import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const entityId = req.nextUrl.searchParams.get("entityId");
  try {
    const rows = entityId
      ? await sql`
          select l.*, e.name as entity_name
          from licenses l join entities e on e.id = l.entity_id
          where l.entity_id = ${entityId}
          order by l.id desc
        `
      : await sql`
          select l.*, e.name as entity_name
          from licenses l join entities e on e.id = l.entity_id
          order by l.id desc
          limit 50
        `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entity_id, type, status = "in_review", issue_date = null, expiry_date = null } = body;

    if (!entity_id || !type) {
      return NextResponse.json(
        { error: "entity_id and type are required" },
        { status: 400 }
      );
    }

    const [row] = await sql`
      insert into licenses (entity_id, type, status, issue_date, expiry_date)
      values (${entity_id}, ${type}, ${status}, ${issue_date}, ${expiry_date})
      returning *
    `;
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }
    const [row] = await sql`
      update licenses set status = ${status} where id = ${id} returning *
    `;
    if (!row) return NextResponse.json({ error: "License not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update license" }, { status: 500 });
  }
}
