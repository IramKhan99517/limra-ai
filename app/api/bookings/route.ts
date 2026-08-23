import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await sql`select * from bookings order by created_at desc limit 50`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expert_name, client_name, client_email, message = null, preferred_date = null } = body;

    if (!expert_name || !client_name || !client_email) {
      return NextResponse.json(
        { error: "expert_name, client_name, and client_email are required" },
        { status: 400 }
      );
    }

    const [row] = await sql`
      insert into bookings (expert_name, client_name, client_email, message, preferred_date)
      values (${expert_name}, ${client_name}, ${client_email}, ${message}, ${preferred_date})
      returning *
    `;
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
