import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";
import { BUSINESS_ACTIVITIES, type BusinessActivity } from "@/lib/documentTypes";
import { flattenJourney, normalizeProfile } from "@/lib/ksaJourney";

export const dynamic = "force-dynamic";

type Classification = {
  business_name: string;
  activity: BusinessActivity;
  summary: string;
};

async function classifyWithAI(message: string): Promise<Classification | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 300,
        system:
          `You classify a business description into one of these activity ids: ` +
          `${BUSINESS_ACTIVITIES.map((a) => a.id).join(", ")}. ` +
          `Respond ONLY with JSON: {"business_name": string, "activity": one of the ids, "summary": one plain-language sentence}. ` +
          `No markdown, no preamble.`,
        messages: [{ role: "user", content: message }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text.trim());
    if (!BUSINESS_ACTIVITIES.some((a) => a.id === parsed.activity)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function classifyWithRules(message: string): Classification {
  const lower = message.toLowerCase();
  let activity: BusinessActivity = "consulting";
  if (/food|restaurant|cafe|catering|kitchen|bakery/.test(lower)) activity = "food";
  else if (/software|app|tech|saas|platform|ai\b/.test(lower)) activity = "tech";
  else if (/trade|retail|shop|store|import|export|sell/.test(lower)) activity = "trade";
  else if (/factory|manufactur|industrial|production/.test(lower)) activity = "industrial";

  const label = BUSINESS_ACTIVITIES.find((a) => a.id === activity)!.label;
  return {
    business_name: "My New Business",
    activity,
    summary: `Classified as a ${label} business based on your description. You can rename it anytime.`,
  };
}

export async function POST(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const message = body?.message;
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please describe your business in a sentence or two." }, { status: 400 });
    }

    const classification = (await classifyWithAI(message)) ?? classifyWithRules(message);

    // Build the branched KSA journey from the captured business profile.
    const profile = normalizeProfile({
      activity: classification.activity,
      ownership: body?.ownership,
      legalStructure: body?.legalStructure,
    });

    const [entity] = await sql`
      insert into entities (name, owner, status, saudization_score, owner_id, activity, description, ownership, legal_structure)
      values (${classification.business_name}, ${auth.user.email ?? ""}, 'pending', 0, ${auth.user.id}, ${classification.activity}, ${message}, ${profile.ownership}, ${profile.legalStructure})
      returning *
    `;

    const journeySteps = flattenJourney(profile);

    for (let i = 0; i < journeySteps.length; i++) {
      const step = journeySteps[i];
      await sql`
        insert into roadmap_steps (entity_id, order_index, title, description, document_type_id, status, step_key, stage)
        values (${entity.id}, ${i}, ${step.title}, ${step.description}, ${step.documentTypeIds[0] ?? null}, ${i === 0 ? "in_progress" : "pending"}, ${step.key}, ${step.stageKey})
      `;
    }

    return NextResponse.json({ entity, stepCount: journeySteps.length, aiUsed: !!process.env.ANTHROPIC_API_KEY });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process your business description." }, { status: 500 });
  }
}
