import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    // Ownership check: the step's entity must belong to this user (or user is admin)
    const [step] = await sql`
      select rs.id, e.owner_id from roadmap_steps rs
      join entities e on e.id = rs.entity_id
      where rs.id = ${id}
    `;
    if (!step) return NextResponse.json({ error: "Step not found" }, { status: 404 });
    if (step.owner_id !== auth.user.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Not your business" }, { status: 403 });
    }

    const [updated] = await sql`
      update roadmap_steps set status = ${status} where id = ${id} returning *
    `;
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update step" }, { status: 500 });
  }
}
