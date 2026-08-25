import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized, forbidden } from "@/lib/authServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

  const entityId = req.nextUrl.searchParams.get("entityId");
  try {
    const rows = entityId
      ? await sql`
          select f.*, e.name as entity_name
          from filings f join entities e on e.id = f.entity_id
          where f.entity_id = ${entityId}
          order by f.due_date asc
        `
      : await sql`
          select f.*, e.name as entity_name
          from filings f join entities e on e.id = f.entity_id
          order by f.due_date asc
          limit 50
        `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch filings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

  try {
    const body = await req.json();
    const { entity_id, title, due_date, status = "pending" } = body;

    if (!entity_id || !title || !due_date) {
      return NextResponse.json(
        { error: "entity_id, title, and due_date are required" },
        { status: 400 }
      );
    }

    const [row] = await sql`
      insert into filings (entity_id, title, due_date, status)
      values (${entity_id}, ${title}, ${due_date}, ${status})
      returning *
    `;
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create filing" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }
    const [row] = await sql`
      update filings set status = ${status} where id = ${id} returning *
    `;
    if (!row) return NextResponse.json({ error: "Filing not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update filing" }, { status: 500 });
  }
}
