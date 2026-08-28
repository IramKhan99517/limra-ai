import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";
import type { BusinessActivity } from "@/lib/documentTypes";
import { flattenJourney, normalizeProfile } from "@/lib/ksaJourney";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/profile
 * Updates a business's activity / ownership / legal structure and regenerates
 * its roadmap from the KSA journey engine. Steps the user already marked done
 * are preserved by their stable step_key so progress survives a rebuild.
 */
export async function PATCH(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const entityId = body?.entityId;
    if (!entityId) {
      return NextResponse.json({ error: "Missing entityId." }, { status: 400 });
    }

    const [entity] = await sql`
      select id, owner_id, activity from entities where id = ${entityId}
    `;
    if (!entity) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }
    if (entity.owner_id !== auth.user.id && auth.role !== "admin") {
      return NextResponse.json({ error: "You can only update your own business." }, { status: 403 });
    }

    const profile = normalizeProfile({
      activity: (body?.activity ?? entity.activity) as BusinessActivity,
      ownership: body?.ownership,
      legalStructure: body?.legalStructure,
    });

    // Remember which steps were completed, keyed by the engine's stable step_key.
    const doneRows = await sql`
      select step_key from roadmap_steps
      where entity_id = ${entityId} and status = 'done' and step_key is not null
    `;
    const doneKeys = new Set(
      (doneRows as unknown as { step_key: string }[]).map((r) => r.step_key),
    );

    await sql`
      update entities
      set activity = ${profile.activity},
          ownership = ${profile.ownership},
          legal_structure = ${profile.legalStructure}
      where id = ${entityId}
    `;

    // Rebuild the roadmap for the new profile.
    await sql`delete from roadmap_steps where entity_id = ${entityId}`;

    const steps = flattenJourney(profile);
    let firstPendingAssigned = false;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      let status: "done" | "in_progress" | "pending";
      if (doneKeys.has(step.key)) {
        status = "done";
      } else if (!firstPendingAssigned) {
        status = "in_progress";
        firstPendingAssigned = true;
      } else {
        status = "pending";
      }
      await sql`
        insert into roadmap_steps
          (entity_id, order_index, title, description, document_type_id, status, step_key, stage)
        values
          (${entityId}, ${i}, ${step.title}, ${step.description},
           ${step.documentTypeIds[0] ?? null}, ${status}, ${step.key}, ${step.stageKey})
      `;
    }

    return NextResponse.json({ ok: true, stepCount: steps.length });
  } catch (err) {
    console.error("[api/profile] PATCH failed:", err);
    return NextResponse.json(
      { error: "Couldn't update your business profile. Check that the journey migration has been applied." },
      { status: 500 },
    );
  }
}
