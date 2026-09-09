/* Contract Analyzer engine — lib/contractAnalyzer.ts
 *
 * Deterministic, dependency-free analysis of contract text:
 *  - Plain-language summary built from detected parties, dates, amounts.
 *  - Risk flags from clause-pattern matching (weights → severity).
 *  - Questions to ask before signing, derived from the flagged risks.
 *
 * An optional Anthropic pass (when ANTHROPIC_API_KEY is set) can replace the
 * heuristic summary with an AI-written one; risks always come from the rule
 * engine so behavior is predictable and no clause is missed silently.
 */

export type RiskSeverity = "high" | "medium" | "low";

export type ContractRisk = {
  id: string;          // i18n key suffix, e.g. "autoRenew" → contract.risk.autoRenew
  severity: RiskSeverity;
  /** Verbatim clause snippet that triggered the flag (for context). */
  evidence: string;
};

export type ContractAnalysis = {
  contractType: string | null;
  summary: string;
  keyTerms: string[];
  risks: ContractRisk[];
  questions: string[];
  aiUsed: boolean;
};

type Rule = {
  id: string;
  severity: RiskSeverity;
  patterns: RegExp[];
  /** Max characters of matched text kept as evidence. */
};

const RULES: Rule[] = [
  {
    id: "autoRenew",
    severity: "medium",
    patterns: [
      /auto[-\s]?renew(al|s|ed)?/i,
      /shall (be |automatically )?(renewed|extended) for (successive|additional)/i,
      /renews automatically/i,
      /يُجدد تلقائياً|تجديد تلقائي/i,
    ],
  },
  {
    id: "termination",
    severity: "high",
    patterns: [
      /terminat(e|ion) (this agreement|this contract|at any time)[^.]{0,120}(without cause|without prior notice|for convenience)/i,
      /without cause/i,
      /for convenience/i,
      /may terminate[^.]{0,80}(at any time|immediately)/i,
      /إنهاء (هذا العقد|العقد) في أي وقت/i,
      /دون إبداء الأسباب|دون سبب/i,
    ],
  },
  {
    id: "penalty",
    severity: "medium",
    patterns: [
      /penalt(y|ies)/i,
      /liquidated damages/i,
      /late (fee|charge|payment fee)/i,
      /fine of/i,
      /غرامة/i,
    ],
  },
  {
    id: "exclusivity",
    severity: "medium",
    patterns: [
      /exclusiv(e|ity|ely)/i,
      /shall not (engage|contract|deal|work) with (any )?(other|third|competitor)/i,
      /sole (and exclusive )?(supplier|provider|distributor)/i,
      /حصرية|حصري/i,
    ],
  },
  {
    id: "nonCompete",
    severity: "medium",
    patterns: [
      /non[-\s]?compet(e|ition)/i,
      /shall not (compete|engage in any business)/i,
      /restrictive covenant/i,
      /عدم المنافسة|ألا ينافس/i,
    ],
  },
  {
    id: "ip",
    severity: "medium",
    patterns: [
      /intellectual property/i,
      /assign(s|ment)? (all|any) (right|title|interest)/i,
      /work(s)? made for hire/i,
      /all (IP|patents|copyrights|trademarks)[^.]{0,60}(belong|vest|assign)/i,
      /الملكية الفكرية/i,
    ],
  },
  {
    id: "payment",
    severity: "low",
    patterns: [
      /net (30|45|60|90)/i,
      /payment (is )?due within \d+ (days|business days)/i,
      /within ninety \(?90\)? days/i,
      /شروط الدفع|تستحق المدفوعات/i,
    ],
  },
  {
    id: "governingLaw",
    severity: "medium",
    patterns: [
      /governed by the laws of ([^.]{3,60})/i,
      /governing law/i,
      /arbitration (in|at|seated in) ([A-Z][a-z]+)/i,
      /ICC|LCIA|SIAC|DIAC/i,
      /يخضع هذا العقد لقوانين/i,
    ],
  },
  {
    id: "unilateral",
    severity: "high",
    patterns: [
      /(company|party|landlord|employer|the first party) (may|reserves the right to) (modify|amend|change|alter)[^.]{0,80}(at any time|unilaterally|without (the )?consent)/i,
      /unilaterally/i,
      /at its sole discretion/i,
      /حق تعديل|من طرف واحد/i,
    ],
  },
  {
    id: "indefinite",
    severity: "low",
    patterns: [
      /shall (remain|continue) in (full force|effect) (indefinitely|until terminated)/i,
      /no fixed term/i,
      /perpetual/i,
      /إلى أن يتم إنهاؤه/i,
    ],
  },
  {
    id: "indemnity",
    severity: "high",
    patterns: [
      /indemnif(y|ication)/i,
      /hold harmless/i,
      /تعويض\s+الطرف الآخر عن أي/i,
    ],
  },
  {
    id: "emptyLiability",
    severity: "high",
    patterns: [
      /unlimited liability/i,
      /without (any )?limit(ation)? of liability/i,
      /all damages[^.]{0,60}(howsoever|whatsoever) caused/i,
      /مسؤولية غير محدودة/i,
    ],
  },
];

/** Detect contract type from common title/subject patterns. */
function detectType(text: string): string | null {
  const t = text.slice(0, 3000).toLowerCase();
  const table: [RegExp, string][] = [
    [/employment|employee|job offer|عقد عمل|توظيف/, "employment"],
    [/lease|tenancy|landlord|rental|إيجار|عقد إيجار/, "lease"],
    [/supplier|supply|vendor|purchase order|توريد/, "supply"],
    [/partnership|shareholders|joint venture|شراكة/, "partnership"],
    [/nda|non[- ]disclosure|سرية/, "nda"],
    [/services? agreement|consultancy|consulting|خدمات|استشارات/, "services"],
    [/franchise|امتياز/, "franchise"],
    [/loan|finance|قرض|تمويل/, "loan"],
  ];
  for (const [re, type] of table) {
    if (re.test(t)) return type;
  }
  return null;
}

function extractParties(text: string): string[] {
  const parties: string[] = [];
  const between = text.match(/between\s+(.{3,80}?)\s+(?:\(|and|و)\s+(.{3,80}?)(?:\.|\n)/i);
  if (between) {
    parties.push(between[1].trim(), between[2].trim());
  }
  if (parties.length === 0) {
    const firstParty = text.match(/(?:first party|party of the first part|الطرف الأول)[:\s]+([^\n.]{3,80})/i);
    const secondParty = text.match(/(?:second party|party of the second part|الطرف الثاني)[:\s]+([^\n.]{3,80})/i);
    if (firstParty) parties.push(firstParty[1].trim());
    if (secondParty) parties.push(secondParty[1].trim());
  }
  return parties.slice(0, 2);
}

function extractDates(text: string): string[] {
  const dates = new Set<string>();
  const effective = text.match(/(?:effective|commencement|start) date[:\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}\s+\w+\s+[0-9]{4})/i);
  if (effective) dates.add(effective[1]);
  const term = text.match(/term\s+(?:of|shall be for)?[:\s]*([^.]{3,60})/i);
  if (term) dates.add(term[1].trim());
  return Array.from(dates).slice(0, 3);
}

function extractAmounts(text: string): string[] {
  const amounts = new Set<string>();
  const re = /(?:SAR|SR|USD|AED|\$)\s?([\d,]+(?:\.\d{1,2})?)/gi;
  let m: RegExpExecArray | null;
  let count = 0;
  while ((m = re.exec(text)) && count < 4) {
    amounts.add(m[0].trim());
    count++;
  }
  return Array.from(amounts);
}

function buildKeyTerms(text: string): string[] {
  const terms: string[] = [];
  const parties = extractParties(text);
  const dates = extractDates(text);
  const amounts = extractAmounts(text);
  if (parties[0]) terms.push(`Parties: ${parties[0]}${parties[1] ? ` ↔ ${parties[1]}` : ""}`);
  for (const d of dates) terms.push(`Term/date: ${d}`);
  for (const a of amounts) terms.push(`Amount: ${a}`);
  return terms.slice(0, 6);
}

function buildQuestions(risks: ContractRisk[], contractType: string | null): string[] {
  const perRisk: Record<string, string> = {
    autoRenew: "What is the exact cancellation deadline to avoid automatic renewal?",
    termination: "What notice period and compensation apply if the contract is ended early?",
    penalty: "Are the penalties mutual, and is there a cap on them?",
    exclusivity: "Can the exclusivity scope be narrowed to specific products or regions?",
    nonCompete: "How long and how wide is the non-compete, and is it enforceable in KSA?",
    ip: "Who owns work I create before and independently of this contract?",
    payment: "When exactly is payment due, and what happens if it is late?",
    governingLaw: "Why is the governing law or arbitration seat outside Saudi Arabia?",
    unilateral: "Can we agree that all changes need mutual written consent?",
    indefinite: "What is the maximum duration, and what is the exit mechanism?",
    indemnity: "Can the indemnity be limited to losses caused by my own negligence?",
    emptyLiability: "Can liability be capped at a fixed amount (e.g. contract value)?",
  };
  const qs = risks.map((r) => perRisk[r.id]).filter(Boolean);
  if (qs.length === 0) {
    qs.push("What happens if either party wants to exit early?");
    qs.push("Who pays for dispute costs if something goes wrong?");
  }
  if (contractType === "employment") {
    qs.push("How are end-of-service benefits calculated under this contract?");
  }
  return qs.slice(0, 6);
}

export function analyzeText(text: string): ContractAnalysis {
  const contractType = detectType(text);

  const risks: ContractRisk[] = [];
  for (const rule of RULES) {
    for (const re of rule.patterns) {
      const m = text.match(re);
      if (m) {
        risks.push({ id: rule.id, severity: rule.severity, evidence: m[0].slice(0, 140) });
        break;
      }
    }
  }

  const parties = extractParties(text);
  const typeLabel = contractType ? contractType : "business";
  const summaryLines: string[] = [];
  summaryLines.push(
    `This appears to be a ${typeLabel} contract` +
      (parties.length >= 2 ? ` between ${parties[0]} and ${parties[1]}.` : "."),
  );
  if (risks.length > 0) {
    const high = risks.filter((r) => r.severity === "high").length;
    const medium = risks.filter((r) => r.severity === "medium").length;
    const low = risks.filter((r) => r.severity === "low").length;
    const parts: string[] = [];
    if (high) parts.push(`${high} high`);
    if (medium) parts.push(`${medium} medium`);
    if (low) parts.push(`${low} low`);
    summaryLines.push(`We flagged ${parts.join(", ")} risk item(s) to review before you sign.`);
  } else {
    summaryLines.push("No obvious red-flag clauses were detected, but always read the full document.");
  }
  summaryLines.push(
    "Review each risk flag below and the suggested questions, then confirm anything unclear with the other party in writing.",
  );

  return {
    contractType,
    summary: summaryLines.join(" "),
    keyTerms: buildKeyTerms(text),
    risks: risks.slice(0, 8),
    questions: buildQuestions(risks, contractType),
    aiUsed: false,
  };
}

/* ------------------------------------------------------------------ */
/* Optional AI pass: a plain-language summary that reads more naturally */
/* ------------------------------------------------------------------ */

export async function analyzeWithAI(
  text: string,
  lang: "en" | "ar" = "en",
): Promise<ContractAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const base = analyzeText(text);
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
        max_tokens: 800,
        system:
          "You are LIMRA AI's contract explainer for SMEs in Saudi Arabia. " +
          (lang === "ar"
            ? "Write ALL output in natural, simple Arabic (فصحى مبسطة). "
            : "Write all output in simple English. ") +
          "You receive contract text and MUST respond ONLY with JSON: " +
          '{"contractType": string|null, "summary": string, "keyTerms": string[]}. ' +
          "summary: 2-4 very short sentences a non-lawyer can understand (what the contract is, who it binds, what to watch). " +
          "keyTerms: max 6 short strings — parties, dates/duration, amounts, renewal, notice periods. " +
          "contractType: one of employment|lease|supply|partnership|nda|services|franchise|loan or null. " +
          "Do NOT invent terms that are not in the text. No markdown, no preamble.",
        messages: [
          {
            role: "user",
            content: text.slice(0, 30000),
          },
        ],
      }),
    });
    if (!res.ok) return base;
    const data = await res.json();
    const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(raw.trim());
    if (typeof parsed.summary !== "string" || parsed.summary.length < 10) return base;
    return {
      ...base,
      contractType: parsed.contractType ?? base.contractType,
      summary: parsed.summary,
      keyTerms: Array.isArray(parsed.keyTerms) && parsed.keyTerms.length > 0
        ? parsed.keyTerms.slice(0, 6).map(String)
        : base.keyTerms,
      aiUsed: true,
    };
  } catch {
    return base;
  }
}
