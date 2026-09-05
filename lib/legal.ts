/* LIMRA AI — legal helpers: UAE trade-name screening + domain price comparison */

/* ------------------------------------------------------------------ */
/* Domain pricing                                                      */
/* ------------------------------------------------------------------ */

export type Registrar = {
  name: string;
  url: (domain: string) => string;
};

const registrarUrl = (base: string) => (domain: string) =>
  `${base}${encodeURIComponent(domain)}`;

export const registrars: Registrar[] = [
  { name: "Namecheap", url: registrarUrl("https://www.namecheap.com/domains/registration/results/?domain=") },
  { name: "GoDaddy", url: registrarUrl("https://www.godaddy.com/domainsearch/find?domainToCheck=") },
  { name: "Porkbun", url: registrarUrl("https://porkbun.com/checkout/search?q=") },
  { name: "Cloudflare", url: registrarUrl("https://dash.cloudflare.com/?to=/:account/domains/register/") },
  { name: "Etisalat", url: registrarUrl("https://www.etisalat.ae/b2c/domains?domain=") },
];

export type ExtensionPrices = {
  ext: string;
  /** registrar -> indicative first-year retail USD price */
  prices: Record<string, number>;
  renewal: number;
  note?: string;
};

/**
 * Indicative retail prices (USD) reflecting typical registrar list pricing
 * including common first-term promotions. Renewal = standard annual renewal
 * at the cheapest registrar.
 */
export const extensionPrices: ExtensionPrices[] = [
  { ext: ".ae",     prices: { Etisalat: 32, Namecheap: 38, GoDaddy: 41 }, renewal: 38, note: "aeNIC-accredited" },
  { ext: ".com",    prices: { Namecheap: 5.98, Cloudflare: 9.77, Porkbun: 10.37 }, renewal: 10.44 },
  { ext: ".net",    prices: { Namecheap: 6.98, Cloudflare: 10.92, Porkbun: 11.06 }, renewal: 12.98 },
  { ext: ".org",    prices: { Namecheap: 5.98, Porkbun: 9.7, Cloudflare: 11.12 }, renewal: 12.98 },
  { ext: ".io",     prices: { Porkbun: 32.5, Namecheap: 34.98, Cloudflare: 37.02 }, renewal: 38 },
  { ext: ".ai",     prices: { Porkbun: 68.88, Namecheap: 72.98, GoDaddy: 79.99 }, renewal: 79.99 },
  { ext: ".co",     prices: { Namecheap: 6.98, Porkbun: 8.5, GoDaddy: 12.99 }, renewal: 27.98 },
  { ext: ".ae.org", prices: { Porkbun: 24.5, Namecheap: 27.98 }, renewal: 27.98 },
  { ext: ".biz",    prices: { Namecheap: 5.98, Porkbun: 7.5 }, renewal: 14.98 },
  { ext: ".app",    prices: { Porkbun: 13.5, Namecheap: 15.98, Cloudflare: 17.02 }, renewal: 17.98 },
  { ext: ".dev",    prices: { Porkbun: 13.5, Namecheap: 15.98, Cloudflare: 17.02 }, renewal: 17.98 },
  { ext: ".me",     prices: { Namecheap: 4.98, Porkbun: 6.5 }, renewal: 19.98 },
  { ext: ".shop",   prices: { Namecheap: 1.98, Porkbun: 3.16 }, renewal: 29.98 },
  { ext: ".online", prices: { Namecheap: 1.98, Porkbun: 2.48 }, renewal: 32.98 },
  { ext: ".site",   prices: { Namecheap: 1.98, Porkbun: 2.48 }, renewal: 29.98 },
  { ext: ".cloud",  prices: { Namecheap: 1.98, Porkbun: 2.98 }, renewal: 21.98 },
  { ext: ".tech",   prices: { Namecheap: 4.98, Porkbun: 6.88 }, renewal: 49.98 },
  { ext: ".xyz",    prices: { Namecheap: 1.98, Porkbun: 2.98 }, renewal: 13.98 },
  { ext: ".store",  prices: { Namecheap: 1.98, Porkbun: 2.66 }, renewal: 49.98 },
  { ext: ".global", prices: { Porkbun: 29.5, Namecheap: 32.98 }, renewal: 44.98 },
  { ext: ".law",    prices: { Namecheap: 34.98, GoDaddy: 39.99 }, renewal: 69.98 },
  { ext: ".legal",  prices: { Namecheap: 34.98, GoDaddy: 44.99 }, renewal: 64.98 },
];

export type DomainRow = {
  ext: string;
  bestRegistrar: string;
  bestPrice: number;
  renewal: number;
  note?: string;
  buyUrl: string;
};

export function compareDomains(root: string): DomainRow[] {
  const clean = root.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return extensionPrices.map((x) => {
    const entries = Object.entries(x.prices);
    const [bestRegistrar, bestPrice] = entries.reduce((a, b) =>
      b[1] < a[1] ? b : a,
    );
    const domain = `${clean}${x.ext}`;
    const r = registrars.find((rg) => rg.name === bestRegistrar);
    return {
      ext: x.ext,
      bestRegistrar,
      bestPrice,
      renewal: x.renewal,
      note: x.note,
      buyUrl: r ? r.url(domain) : "#",
    };
  });
}

/* ------------------------------------------------------------------ */
/* Trade-name screening (UAE business-law rules)                       */
/* ------------------------------------------------------------------ */

const FORBIDDEN_RELIGIOUS = [
  "allah", "god", "islam", "islamic", "christ", "christian", "buddha",
  "holy", "heaven", "paradise", "jannah",
];

const COUNTRY_NAMES = [
  "united arab emirates", "uae", "saudi arabia", "qatar", "kuwait",
  "bahrain", "oman", "egypt", "america", "england", "london", "paris",
  "dubai", "abu dhabi",
];

const OFFENSIVE = [
  "stupid", "idiot", "damn", "shitty", "bastard", "drunk",
];

const REGULATED_HINTS: { words: string[]; approval: string; approvalAr: string }[] = [
  { words: ["bank", "banking", "finance", "financial", "insurance", "exchange", "money"], approval: "Central Bank of the UAE", approvalAr: "المركزي الإماراتي" },
  { words: ["clinic", "medical", "hospital", "dental", "pharma", "pharmacy", "health"], approval: "Ministry of Health & Prevention / DHA", approvalAr: "وزارة الصحة ووقاية المجتمع / هيئة الصحة بدبي" },
  { words: ["school", "education", "university", "college", "academy", "institute", "training"], approval: "Ministry of Education / KHDA", approvalAr: "وزارة التعليم / هيئة المعرفة والتنمية البشرية" },
  { words: ["law", "legal", "advocate", "attorney"], approval: "Ministry of Justice", approvalAr: "وزارة العدل" },
  { words: ["real estate", "property", "broker"], approval: "RERA", approvalAr: "مؤسسة التنظيم العقاري" },
  { words: ["aviation", "airlines"], approval: "GCAA", approvalAr: "الهيئة العامة للطيران المدني" },
  { words: ["security", "defense", "defence"], approval: "Ministry of Interior", approvalAr: "وزارة الداخلية" },
];

const LEGAL_SUFFIXES = [
  "llc", "fz-llc", "fze", "fzco", "ltd", "limited", "inc", "gmbh", "dmcc",
  "est", "establishment",
];

export type NameIssue = {
  rule: number;
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
    LEGAL_SUFFIXES.includes(words[words.length - 1].replace(/[^\w-]/g, ""))
  ) {
    words = words.slice(0, -1);
  }
  return words.join(" ");
}

export function checkTradeName(raw: string): NameResult {
  const name = raw.trim();
  const lower = name.toLowerCase();
  const issues: NameIssue[] = [];
  const core = stripLegalSuffix(name);
  const coreLower = core.toLowerCase();

  // Rule 1: characters & length
  if (/[•+@#$%^&*()[\]{}|\\/<>~`"']/.test(name)) {
    issues.push({
      rule: 1,
      severity: "block",
      message: "Symbols such as •, +, @ are not allowed in UAE trade names.",
      messageAr: "لا يُسمح برموز مثل • أو + أو @ في الأسماء التجارية الإماراتية.",
    });
  }

  // Rule 2: religious / country names
  for (const w of FORBIDDEN_RELIGIOUS) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) {
      issues.push({
        rule: 2,
        severity: "block",
        message: `"${w}" (religious term) cannot be used in a trade name.`,
        messageAr: `لا يمكن استخدام "${w}" (مصطلح ديني) في اسم تجاري.`,
      });
    }
  }
  for (const c of COUNTRY_NAMES) {
    if (new RegExp(`(^|\\s)${c}(\\s|$)`).test(lower)) {
      issues.push({
        rule: 2,
        severity: "block",
        message: `"${c}" cannot be used alone as a country/place name.`,
        messageAr: `لا يمكن استخدام "${c}" منفردة كاسم دولة أو مكان.`,
      });
    }
  }

  // Rule 3: offensive meaning
  for (const w of OFFENSIVE) {
    if (lower.includes(w)) {
      issues.push({
        rule: 3,
        severity: "block",
        message: `Contains a word with an offensive meaning ("${w}").`,
        messageAr: `يحتوي على كلمة ذات معنى مسيء ("${w}").`,
      });
    }
  }

  // Rule 4: personal names + legal form
  if (/\b(son|sons|brother|brothers|heirs)\b/.test(lower) && core.split(/\s+/).length < 3) {
    issues.push({
      rule: 4,
      severity: "warn",
      message: "Names of persons require an owner match on the trade licence.",
      messageAr: "الأسماء الشخصية تتطلب مطابقة اسم المالك في الرخصة التجارية.",
    });
  }
  const hasSuffix = LEGAL_SUFFIXES.some((s) => lower.endsWith(s));
  if (!hasSuffix) {
    issues.push({
      rule: 4,
      severity: "info",
      message: "Add a legal-form suffix (LLC, FZ-LLC, FZCO…) at reservation time.",
      messageAr: "أضف لاحقة الشكل القانوني (ذ.م.م، منطقة حرة…) عند الحجز.",
    });
  }

  // Rule 5: regulated activity hints
  for (const r of REGULATED_HINTS) {
    if (r.words.some((w) => new RegExp(`\\b${w}`).test(coreLower))) {
      issues.push({
        rule: 5,
        severity: "warn",
        message: `Name suggests a regulated activity — expect prior approval from ${r.approval}.`,
        messageAr: `يوحي الاسم بنشاط منظّم — توقّع موافقة مسبقة من ${r.approvalAr}.`,
      });
      break;
    }
  }

  const blocks = issues.filter((i) => i.severity === "block").length;
  const verdict = blocks > 0 ? "fail" : issues.length > 0 ? "warn" : "pass";

  // Suggestions keep the brand word and append approved legal forms
  const brand = core.split(/\s+/).filter(Boolean);
  const brandWord = brand.length ? brand[brand.length - 1] : "brand";
  const cap = brandWord.charAt(0).toUpperCase() + brandWord.slice(1);
  const suggestions = [
    `${cap} Gulf Trading LLC`,
    `${cap} Commercial Brokers LLC`,
    `${cap} General Trading FZ-LLC`,
  ];

  return { name, verdict, issues, suggestions };
}
