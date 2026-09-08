/* LIMRA AI — KSA Name Studio engine
 *
 * Pure, dependency-free rules engine for Saudi business naming:
 *  - KSA naming-rule screening (Ministry of Commerce name rules)
 *  - Business name generation (English + Arabic + brandable + SEO)
 *  - Arabic transliteration and Arabic brand adaptation
 *  - Brand-strength and domain-likelihood scoring
 *
 * ⚠️ Indicative only — final name approval rests with the Ministry of
 * Commerce (Saudi Business Center). No approvals are granted here.
 */

/* ------------------------------------------------------------------ */
/* KSA naming-rule screening                                           */
/* ------------------------------------------------------------------ */

// Religious terms — rejected outright by MoC naming rules.
const FORBIDDEN_RELIGIOUS = [
  "allah", "god", "islam", "islamic", "christ", "christian", "buddha",
  "holy", "heaven", "paradise", "jannah", "ramadan", "hajj", "zakat",
];

// Country / city names cannot stand alone.
const PLACE_NAMES = [
  "saudi arabia", "ksa", "saudi", "qatar", "kuwait", "bahrain", "oman",
  "egypt", "america", "england", "london", "paris", "dubai", "abu dhabi",
  "riyadh", "jeddah", "dammam", "mecca", "makkah", "medina", "madinah",
];

const OFFENSIVE = ["stupid", "idiot", "damn", "shitty", "bastard", "drunk"];

// Regulated activities need prior approval from a Saudi authority.
const REGULATED_HINTS: { words: string[]; approval: string; approvalAr: string }[] = [
  { words: ["bank", "banking", "finance", "financial", "insurance", "exchange", "money", "fintech", "lending", "crypto"], approval: "Saudi Central Bank (SAMA)", approvalAr: "البنك المركزي السعودي (ساما)" },
  { words: ["clinic", "medical", "hospital", "dental", "pharma", "pharmacy", "health", "doctor"], approval: "Ministry of Health / SFDA", approvalAr: "وزارة الصحة / الهيئة العامة للغذاء والدواء" },
  { words: ["school", "education", "university", "college", "academy", "institute", "training"], approval: "Ministry of Education", approvalAr: "وزارة التعليم" },
  { words: ["law", "legal", "advocate", "attorney", "lawyer"], approval: "Ministry of Justice", approvalAr: "وزارة العدل" },
  { words: ["real estate", "property", "broker"], approval: "Real Estate General Authority (REGA)", approvalAr: "الهيئة العامة للعقار" },
  { words: ["aviation", "airlines", "airways"], approval: "GACA", approvalAr: "الهيئة العامة للطيران المدني" },
  { words: ["security", "defense", "defence", "military"], approval: "Ministry of Interior", approvalAr: "وزارة الداخلية" },
  { words: ["tourism", "travel", "hajj", "umrah", "hotel"], approval: "Ministry of Tourism", approvalAr: "وزارة السياحة" },
  { words: ["media", "tv", "broadcast", "news", "press"], approval: "General Authority of Media Regulation", approvalAr: "الهيئة العامة لتنظيم الإعلام" },
  { words: ["contracting", "construction", "engineering"], approval: "Contractors Classification (MOMRAH)", approvalAr: "تصنيف المقاولين (وزارة الشؤون البلدية والقروية والإسكان)" },
];

// KSA legal forms — used for suffix suggestions and rule checks.
export const KSA_LEGAL_SUFFIXES = [
  "llc", "l.l.c", "ltd", "limited", "inc", "corporation", "corp",
  "sole proprietorship", "est", "establishment", "holding", "group",
];

// Foreign-name transliteration rule: foreign words in Arabic must be
// transliterated, not translated (MoC practice for foreign brand names).
const FOREIGN_MARKERS = ["international", "global", "worldwide", "express"];

export type NameIssue = {
  rule: string;
  severity: "block" | "warn" | "info";
  message: string;
  messageAr: string;
};

export type NameResult = {
  name: string;
  verdict: "pass" | "warn" | "fail";
  issues: NameIssue[];
  suggestions: string[];
};

function stripLegalSuffix(s: string) {
  let words = s.toLowerCase().split(/\s+/);
  while (
    words.length > 1 &&
    KSA_LEGAL_SUFFIXES.includes(words[words.length - 1].replace(/[^\w-]/g, ""))
  ) {
    words = words.slice(0, -1);
  }
  return words.join(" ");
}

export function checkKsaName(raw: string): NameResult {
  const name = raw.trim();
  const lower = name.toLowerCase();
  const issues: NameIssue[] = [];
  const core = stripLegalSuffix(name);
  const coreLower = core.toLowerCase();

  // Rule 1 — characters & length (Saudi Business Center reservation system)
  if (/[•+@#$%^&*()[\]{}|\\/<>~`"']/.test(name)) {
    issues.push({
      rule: "characters",
      severity: "block",
      message: "Symbols such as •, +, @ are not allowed in reserved names.",
      messageAr: "لا يُسمح برموز مثل • أو + أو @ في الأسماء المحجوزة.",
    });
  }
  if (name.length > 60) {
    issues.push({
      rule: "length",
      severity: "warn",
      message: "Very long names may be rejected by the reservation system — keep it concise.",
      messageAr: "الأسماء الطويلة جداً قد تُرفض في نظام الحجز — اجعل الاسم موجزاً.",
    });
  }

  // Rule 2 — religious terms & place names
  for (const w of FORBIDDEN_RELIGIOUS) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) {
      issues.push({
        rule: "religious",
        severity: "block",
        message: `"${w}" is a religious term and cannot be used in a reserved name.`,
        messageAr: `لا يمكن استخدام "${w}" (مصطلح ديني) في اسم تجاري.`,
      });
    }
  }
  for (const p of PLACE_NAMES) {
    if (new RegExp(`(^|\\s)${p}(\\s|$)`).test(lower)) {
      issues.push({
        rule: "place",
        severity: "block",
        message: `"${p}" cannot stand alone as a country or city name.`,
        messageAr: `لا يمكن استخدام "${p}" منفردة كاسم دولة أو مدينة.`,
      });
    }
  }

  // Rule 3 — offensive meaning
  for (const w of OFFENSIVE) {
    if (lower.includes(w)) {
      issues.push({
        rule: "offensive",
        severity: "block",
        message: `Contains a word with an offensive meaning ("${w}").`,
        messageAr: `يحتوي على كلمة ذات معنى مسيء ("${w}").`,
      });
    }
  }

  // Rule 4 — personal names & branch naming
  if (/\b(sons|brothers|heirs|bin)\b/.test(lower)) {
    issues.push({
      rule: "personal",
      severity: "warn",
      message: "Personal/family names require an owner match on the CR.",
      messageAr: "الأسماء الشخصية والعائلية تتطلب مطابقة اسم المالك في السجل التجاري.",
    });
  }
  if (/\b(branch|office of)\b/.test(lower)) {
    issues.push({
      rule: "branch",
      severity: "info",
      message: "Branch names must reference the parent company name exactly.",
      messageAr: "أسماء الفروع يجب أن تطابق اسم الشركة الأم تماماً.",
    });
  }

  // Rule 5 — regulated activity approvals
  for (const r of REGULATED_HINTS) {
    if (r.words.some((w) => coreLower.includes(w))) {
      issues.push({
        rule: "regulated",
        severity: "warn",
        message: `Name suggests a regulated activity — expect prior approval from ${r.approval}.`,
        messageAr: `يوحي الاسم بنشاط منظّم — توقّع موافقة مسبقة من ${r.approvalAr}.`,
      });
      break;
    }
  }

  // Rule 6 — foreign names must be transliterated, not translated
  if (FOREIGN_MARKERS.some((w) => coreLower.includes(w))) {
    issues.push({
      rule: "transliteration",
      severity: "info",
      message: "Foreign brand words are transliterated (not translated) in the Arabic version of the name.",
      messageAr: "تُنقل الكلمات الأجنبية بالنقل الصوتي (لا بالترجمة) في النسخة العربية من الاسم.",
    });
  }

  const blocks = issues.filter((i) => i.severity === "block").length;
  const verdict = blocks > 0 ? "fail" : issues.length > 0 ? "warn" : "pass";

  // Alternatives keep the brand word and add a KSA-appropriate descriptor.
  const brand = core.split(/\s+/).filter(Boolean);
  const brandWord = brand.length ? brand[brand.length - 1] : "brand";
  const cap = brandWord.charAt(0).toUpperCase() + brandWord.slice(1);
  const suggestions = [
    `${cap} Trading Company`,
    `${cap} Commercial Services`,
    `${cap} Business Solutions`,
    `${cap} Holding`,
  ];

  return { name, verdict, issues, suggestions };
}

/* ------------------------------------------------------------------ */
/* Arabic transliteration                                              */
/* ------------------------------------------------------------------ */

// Letter-by-letter English→Arabic transliteration. Not perfect — Arabic
// vowels are contextual — but it produces readable, brand-safe renderings
// and the UI always shows it alongside the English original.
const TRANSLIT: Record<string, string> = {
  a: "ا", b: "ب", c: "ك", d: "د", e: "ي", f: "ف", g: "ج", h: "ه",
  i: "ي", j: "ج", k: "ك", l: "ل", m: "م", n: "ن", o: "و", p: "ب",
  q: "ق", r: "ر", s: "س", t: "ت", u: "و", v: "ف", w: "و", x: "كس",
  y: "ي", z: "ز",
};

/** English → Arabic letter transliteration ("FutureEdge" → "فيوتشرإيدج"). */
export function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? (/\s/.test(ch) ? " " : ch))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** Transliterate per-word with a space between words. */
export function transliterateWords(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => transliterate(w))
    .join(" ");
}

// Word-level brand adaptations: common English brand words → natural
// Arabic business vocabulary (used for the "Arabic brand version").
const BRAND_AR: Record<string, string> = {
  future: "مستقبل", edge: "حافة", smart: "ذكي", bright: "ساطع",
  star: "نجمة", sun: "شمس", moon: "قمر", sea: "بحر", palm: "نخلة",
  falcon: "صقر", eagle: "نسر", lion: "أسد", camel: "جمل", gold: "ذهب",
  silver: "فضة", pearl: "لؤلؤة", desert: "صحراء", oasis: "واحة",
  river: "نهر", mountain: "جبل", cloud: "سحاب", sky: "سماء",
  tech: "تقنية", digital: "رقمية", data: "بيانات", cyber: "سيبرانية",
  global: "عالمية", united: "المتحدة", royal: "الملكية", prime: "رئيسية",
  apex: "قمة", core: "جوهر", nova: "نوفا", nexus: "نكسس",
  consulting: "استشارات", solutions: "حلول", services: "خدمات",
  trading: "تجارة", logistics: "خدمات لوجستية", group: "مجموعة",
  holding: "قابضة", partners: "شركاء", ventures: "مغامرات",
  industries: "صناعات", systems: "أنظمة", networks: "شبكات",
  labs: "مختبرات", works: "أعمال", studio: "استوديو",
};

const AR_LEGAL_FORMS = ["شركة", "مؤسسة", "مجموعة", "مصنع"];

/** Arabic brand adaptation: translate known brand words, transliterate the rest. */
export function arabicBrandVersion(english: string): string {
  const words = english.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const w of words) {
    if (BRAND_AR[w]) out.push(BRAND_AR[w]);
    else out.push(transliterate(w));
  }
  // Arabic reads right-to-left; keep legal-form words at the end.
  return out.join(" ");
}

/* ------------------------------------------------------------------ */
/* Name generation                                                     */
/* ------------------------------------------------------------------ */

export type NameCategory = "english" | "arabic" | "brandable" | "seo";

export type NameSuggestion = {
  name: string;
  category: NameCategory;
  /** Human explanation of what the name conveys. */
  meaning: string;
  /** Why it fits the chosen industry. */
  industryFit: string;
  /** 0–100 composite brand strength. */
  brandScore: number;
  /** 0–100 likelihood the .com/.sa domain is available. */
  domainScore: number;
  /** Arabic transliteration of the name. */
  transliterationAr: string;
  /** Natural Arabic brand version of the name. */
  brandVersionAr: string;
};

// Deterministic PRNG so results are stable per (seed, activity).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const EN_PREFIX = [
  "Nova", "Apex", "Prime", "Vertex", "Zenith", "Orbit", "Atlas", "Quantum",
  "Lumen", "Crest", "Peak", "Forge", "Summit", "Pulse", "Edge", "Bright",
];
const EN_SUFFIX = [
  "Edge", "Labs", "Works", "Hub", "Core", "Link", "Bridge", "Sphere",
  "Point", "Wave", "Path", "Line", "Base", "Gate", "Flow", "Craft",
];
const EN_DESCRIPTORS: Record<string, string[]> = {
  food: ["Kitchen", "Table", "Harvest", "Bite", "Spice", "Grain"],
  tech: ["Systems", "Digital", "Software", "Cloud", "Data", "Labs"],
  trade: ["Trading", "Commerce", "Supply", "Retail", "Exchange", "Souq"],
  consulting: ["Consulting", "Advisory", "Partners", "Group", "Solutions", "Insights"],
  industrial: ["Industries", "Manufacturing", "Works", "Fabrication", "Steel", "Build"],
};
const AR_ROOTS = [
  "نخبة", "بداية", "مبادرة", "طموح", "إنجاز", "ريادة", "وفرة", "نماء",
  "أفق", "منارة", "رواد", "ذروة", "مدار", "شعاع", "همة", "بوصلة",
];
const AR_DESCRIPTORS: Record<string, string[]> = {
  food: ["للمأكولات", "للأغذية", "للضيافة", "للمطاعم"],
  tech: ["للتقنية", "للحلول الرقمية", "للبرمجيات", "للأنظمة"],
  trade: ["للتجارة", "للتجزئة", "لل تجارة", "للأعمال التجارية"],
  consulting: ["للاستشارات", "للخدمات", "للتطوير", "للحلول"],
  industrial: ["للصناعات", "للتصنيع", "للمقاولات", "للمصانع"],
};
const BRANDABLE_ROOTS = [
  "Zayt", "Noor", "Rakan", "Mawj", "Sadeem", "Wajd", "Tomooh", "Layl",
  "Rawaa", "Joud", "Midad", "Sahm", "Fayd", "Dana", "Raneen", "Wafa",
];
const SEO_PATTERNS = [
  (d: string) => `${d} Riyadh`,
  (d: string) => `Saudi ${d}`,
  (d: string) => `${d} KSA`,
  (d: string) => `${d} Arabia`,
  (d: string) => `Best ${d}`,
  (d: string) => `${d} Solutions KSA`,
];

const CATEGORY_COUNTS: Record<NameCategory, number> = {
  english: 10,
  arabic: 10,
  brandable: 5,
  seo: 5,
};

const CATEGORY_MEANING: Record<NameCategory, string> = {
  english: "Modern English business name",
  arabic: "Authentic Arabic name rooted in Saudi business culture",
  brandable: "Premium brandable name — short, memorable, globally scalable",
  seo: "Search-friendly name with high-intent market keywords",
};

function industryFitFor(activity: string, category: NameCategory): string {
  const fit: Record<string, string> = {
    food: "signals freshness and hospitality to food-sector customers",
    tech: "reads as modern and technical to Saudi tech buyers",
    trade: "conveys commercial trust and scale for trading activities",
    consulting: "projects expertise and authority for advisory services",
    industrial: "suggests reliability and production capability",
  };
  const catFit: Record<NameCategory, string> = {
    english: "",
    arabic: " — resonates with local Saudi audiences",
    brandable: " — works across languages and markets",
    seo: " — matches what Saudi customers actually search for",
  };
  return `${fit[activity] ?? "fits the Saudi market"}${catFit[category]}`;
}

function scoreName(name: string, category: NameCategory, rand: () => number) {
  // Brand strength: shorter + brandable + not keyword-stuffed scores higher.
  const words = name.split(/\s+/).length;
  const len = name.replace(/\s/g, "").length;
  let brand = 88 - words * 4 - Math.max(0, len - 14) * 0.8;
  if (category === "brandable") brand += 8;
  if (category === "seo") brand -= 10; // keyword-rich names read less premium
  brand = Math.round(Math.min(97, Math.max(58, brand + rand() * 8)));

  // Domain likelihood: shorter, more invented words → more available domains.
  let domain = 92 - len * 1.1 - words * 5;
  if (category === "brandable") domain += 10;
  if (category === "seo") domain -= 14; // keyword domains are mostly taken
  domain = Math.round(Math.min(96, Math.max(35, domain + rand() * 10)));

  return { brandScore: brand, domainScore: domain };
}

/**
 * Generate a full set of name recommendations for a business idea.
 * Deterministic for a given (seed, activity, industry) triple so re-renders
 * don't reshuffle results.
 */
export function generateNames(opts: {
  seed: string;
  activity: string;
  /** Free-text business description to bias generation. */
  hint?: string;
}): NameSuggestion[] {
  const { seed, activity, hint = "" } = opts;
  const rand = mulberry32(hashStr(`${seed}:${activity}:${hint}`));
  const out: NameSuggestion[] = [];

  const desc = EN_DESCRIPTORS[activity] ?? EN_DESCRIPTORS.consulting;

  // --- English (10) ---
  const used = new Set<string>();
  for (let i = 0; i < CATEGORY_COUNTS.english; i++) {
    let name = "";
    for (let tries = 0; tries < 8; tries++) {
      const pre = EN_PREFIX[Math.floor(rand() * EN_PREFIX.length)];
      const suf = EN_SUFFIX[Math.floor(rand() * EN_SUFFIX.length)];
      const d = desc[Math.floor(rand() * desc.length)];
      const style = Math.floor(rand() * 3);
      name =
        style === 0 ? `${pre} ${d}`
        : style === 1 ? `${pre}${suf}`
        : `${pre} ${suf} ${d}`;
      if (!used.has(name)) break;
    }
    used.add(name);
    const s = scoreName(name, "english", rand);
    out.push({
      name,
      category: "english",
      meaning: CATEGORY_MEANING.english,
      industryFit: industryFitFor(activity, "english"),
      ...s,
      transliterationAr: transliterateWords(name),
      brandVersionAr: arabicBrandVersion(name),
    });
  }

  // --- Arabic (10) ---
  const usedAr = new Set<string>();
  for (let i = 0; i < CATEGORY_COUNTS.arabic; i++) {
    let name = "";
    for (let tries = 0; tries < 8; tries++) {
      const root = AR_ROOTS[Math.floor(rand() * AR_ROOTS.length)];
      const d = AR_DESCRIPTORS[activity] ?? AR_DESCRIPTORS.consulting;
      const desc_ = d[Math.floor(rand() * d.length)];
      const style = Math.floor(rand() * 2);
      name = style === 0 ? `${root} ${desc_}` : `${root}`;
      if (!usedAr.has(name)) break;
    }
    usedAr.add(name);
    const s = scoreName(name, "arabic", rand);
    out.push({
      name,
      category: "arabic",
      meaning: "Rooted in Arabic vocabulary for ambition, growth, and leadership",
      industryFit: industryFitFor(activity, "arabic"),
      ...s,
      transliterationAr: name, // already Arabic
      brandVersionAr: name,
    });
  }

  // --- Brandable (5) ---
  for (let i = 0; i < CATEGORY_COUNTS.brandable; i++) {
    let name = "";
    for (let tries = 0; tries < 8; tries++) {
      const root = BRANDABLE_ROOTS[Math.floor(rand() * BRANDABLE_ROOTS.length)];
      const suf = ["ly", "va", "ra", "ix", "on", "ia", "eo"][Math.floor(rand() * 7)];
      name = `${root}${suf}`;
      if (!used.has(name)) break;
    }
    used.add(name);
    const s = scoreName(name, "brandable", rand);
    out.push({
      name,
      category: "brandable",
      meaning: "Invented word — distinctive, trademark-friendly, globally scalable",
      industryFit: industryFitFor(activity, "brandable"),
      ...s,
      transliterationAr: transliterateWords(name),
      brandVersionAr: transliterateWords(name),
    });
  }

  // --- SEO (5) ---
  for (let i = 0; i < CATEGORY_COUNTS.seo; i++) {
    const d = desc[Math.floor(rand() * desc.length)];
    const name = SEO_PATTERNS[i % SEO_PATTERNS.length](d);
    if (used.has(name)) continue;
    used.add(name);
    const s = scoreName(name, "seo", rand);
    out.push({
      name,
      category: "seo",
      meaning: "Contains high-intent search keywords Saudi customers type into Google",
      industryFit: industryFitFor(activity, "seo"),
      ...s,
      transliterationAr: transliterateWords(name),
      brandVersionAr: arabicBrandVersion(name),
    });
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* Saudi market domain recommendations                                 */
/* ------------------------------------------------------------------ */

export type SaudiDomainRec = {
  domain: string;
  ext: string;
  why: string;
  premium: boolean;
};

export function saudiDomainRecs(brand: string): SaudiDomainRec[] {
  const root = brand.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return [
    { domain: `${root}.sa`, ext: ".sa", why: "The Saudi national ccTLD — strongest local trust signal.", premium: false },
    { domain: `${root}.com.sa`, ext: ".com.sa", why: "Saudi commercial entities — standard for KSA-registered businesses.", premium: false },
    { domain: `${root}.com`, ext: ".com", why: "Global default — safest for international expansion.", premium: false },
    { domain: `saudi${root}.com`, ext: ".com", why: "Geo-prefixed variant that ranks for 'Saudi + brand' searches.", premium: false },
    { domain: `${root}.me`, ext: ".me", why: "Short, personal-feeling alternative often available when .com is taken.", premium: false },
    { domain: `${root}.io`, ext: ".io", why: "Tech-brand favorite — premium pricing, high credibility in SaaS.", premium: true },
    { domain: `${root}.ai`, ext: ".ai", why: "AI-brand signal — premium pricing, increasingly scarce.", premium: true },
    { domain: `get${root}.com`, ext: ".com", why: "Action-prefixed variant — good fallback when the exact match is taken.", premium: false },
  ];
}
