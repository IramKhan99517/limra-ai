import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized, forbidden } from "@/lib/authServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();
  if (auth.role !== "admin") return forbidden();

  try {
    const rows = await sql`
      select id, name, owner, status, saudization_score, created_at
      from entities
      order by created_at desc
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch entities" }, { status: 500 });
  }
}
