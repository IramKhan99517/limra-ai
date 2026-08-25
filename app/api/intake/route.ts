import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getRequestUser, unauthorized } from "@/lib/authServer";
import { documentsForActivity, BUSINESS_ACTIVITIES, type BusinessActivity } from "@/lib/documentTypes";

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
    const { message } = await req.json();
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please describe your business in a sentence or two." }, { status: 400 });
    }

    const classification = (await classifyWithAI(message)) ?? classifyWithRules(message);

    const [entity] = await sql`
      insert into entities (name, owner, status, saudization_score, owner_id, activity, description)
            values (${classification.business_name}, ${auth.user.email ?? ""}, 'pending', 0, ${auth.user.id}, ${classification.activity}, ${message})
      returning *
    `;

    const requiredDocs = documentsForActivity(classification.activity);
    const steps = [
      {
        title: "Confirm your business activity",
        description: classification.summary,
        document_type_id: null as string | null,
      },
      ...requiredDocs.map((d) => ({
        title: `Prepare: ${d.name}`,
        description: d.description,
        document_type_id: d.id,
      })),
      {
        title: "Book an expert consultation",
        description: "Connect with a vetted legal or PRO specialist to review your setup before submitting applications.",
        document_type_id: null,
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      await sql`
        insert into roadmap_steps (entity_id, order_index, title, description, document_type_id, status)
        values (${entity.id}, ${i}, ${steps[i].title}, ${steps[i].description}, ${steps[i].document_type_id}, ${i === 0 ? "in_progress" : "pending"})
      `;
    }

    return NextResponse.json({ entity, stepCount: steps.length, aiUsed: !!process.env.ANTHROPIC_API_KEY });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process your business description." }, { status: 500 });
  }
}
