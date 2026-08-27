import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";
import { getStep, formatSar, formatDays, type JourneyStep } from "@/lib/ksaJourney";

export const dynamic = "force-dynamic";

// Build the static fallback answer directly from the encoded step metadata.
// Used when no ANTHROPIC_API_KEY is configured or the AI call fails.
function staticAnswer(step: JourneyStep): string {
  const fee = formatSar(step.estFeeSar);
  const days = formatDays(step.estDays);
  const lines = [
    step.description,
    "",
    `Authority: ${step.authority}`,
    `Portal: ${step.portalUrl}`,
  ];
  if (fee) lines.push(`Indicative fee: ${fee}`);
  if (days) lines.push(`Indicative time: ${days}`);
  lines.push("", "Note: figures are indicative and must be verified with the authority. LIMRA doesn't grant approvals — the relevant government body remains the approving authority.");
  return lines.join("\n");
}

async function aiAnswer(step: JourneyStep, entity: any): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const fee = formatSar(step.estFeeSar);
  const days = formatDays(step.estDays);
  const grounding = [
    `Business: ${entity.name} (activity: ${entity.activity}, ownership: ${entity.ownership ?? "unknown"}, structure: ${entity.legal_structure ?? "unknown"}).`,
    `Step: ${step.title}.`,
    `What it is: ${step.description}`,
    `Authority: ${step.authority}. Portal: ${step.portalUrl}.`,
    fee ? `Indicative fee (verify): ${fee}.` : "",
    days ? `Indicative processing time (verify): ${days}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

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
        max_tokens: 500,
        system:
          "You are LIMRA AI, a Saudi Arabia business-setup assistant. Explain how to complete ONE setup step, " +
          "practically and concisely (4–7 short sentences or bullets). Use ONLY the grounding facts provided for " +
          "authority names, fees, and timelines — do NOT invent fees or deadlines. Treat all figures as indicative " +
          "and tell the user to verify them with the authority. Make clear LIMRA does not grant approvals; the " +
          "government authority is always the approving body. If you are unsure, say so rather than guessing.",
        messages: [
          {
            role: "user",
            content: `Grounding facts:\n${grounding}\n\nExplain how to complete this step for my business in Saudi Arabia.`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    return text.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const auth = await getRequestUser(req);
  if (!auth) return unauthorized();

  try {
    const { entityId, stepKey } = await req.json();
    if (!entityId || !stepKey) {
      return NextResponse.json({ error: "entityId and stepKey are required" }, { status: 400 });
    }

    const step = getStep(stepKey);
    if (!step) return NextResponse.json({ error: "Unknown step" }, { status: 404 });

    // Ownership check: the entity must belong to this user (or user is admin).
    const [entity] = await sql`
      select id, name, activity, ownership, legal_structure, owner_id
      from entities where id = ${entityId}
    `;
    if (!entity) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    if (entity.owner_id !== auth.user.id && auth.role !== "admin") {
      return NextResponse.json({ error: "Not your business" }, { status: 403 });
    }

    const answer = (await aiAnswer(step, entity)) ?? staticAnswer(step);
    return NextResponse.json({ answer, aiUsed: !!process.env.ANTHROPIC_API_KEY });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load guidance." }, { status: 500 });
  }
}
