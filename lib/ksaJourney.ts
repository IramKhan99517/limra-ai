// LIMRA AI — KSA Setup Journey Engine (v1)
//
// A pure, dependency-free rules engine that turns a business profile
// (activity + ownership + legal structure) into an ordered, stage-based
// Saudi setup journey with authorities, indicative fees/timelines, document
// links, and step dependencies.
//
// Design notes:
//  - This module is pure TypeScript with NO server-only imports, so it can be
//    imported both on the server (intake seeding) and on the client
//    (dashboard/vault enrichment), mirroring how documentTypes.ts is used.
//  - The database stores per-user STATE (which steps exist + their status).
//    This engine owns the CONTENT (fees, authority, deps, applicability),
//    keyed by a stable `key`, so rules can improve without a migration.
//
// ⚠️  VERIFY BEFORE PRODUCTION USE ⚠️
//  Every fee range, duration, and sequencing rule below is a v1 estimate
//  encoded from public sources. Each step carries `verify: true`. These
//  numbers are indicative orientation only — NOT quotes or legal advice — and
//  must be validated with our KSA partner (Saira) / the relevant authority
//  before being presented as authoritative.

import type { BusinessActivity } from "./documentTypes";

export type Ownership = "foreign" | "saudi_gcc";
export type LegalStructure = "llc" | "branch" | "sole_establishment";

export type BusinessProfile = {
  activity: BusinessActivity;
  ownership: Ownership;
  legalStructure: LegalStructure;
};

export const OWNERSHIP_OPTIONS: { id: Ownership; label: string; hint: string }[] = [
  {
    id: "saudi_gcc",
    label: "Saudi or GCC owned",
    hint: "Owned by Saudi or GCC nationals — no foreign investment license required.",
  },
  {
    id: "foreign",
    label: "Foreign owned / invested",
    hint: "Has non-GCC foreign ownership — a MISA investment license is required first.",
  },
];

export const LEGAL_STRUCTURE_OPTIONS: {
  id: LegalStructure;
  label: string;
  hint: string;
  foreignAllowed: boolean;
}[] = [
  { id: "llc", label: "Limited Liability Company (LLC)", hint: "Most common structure for SMEs and startups.", foreignAllowed: true },
  { id: "branch", label: "Branch of a foreign company", hint: "An extension of an existing overseas parent company.", foreignAllowed: true },
  {
    id: "sole_establishment",
    label: "Sole establishment",
    hint: "Single owner; available to Saudi/GCC nationals.",
    foreignAllowed: false,
  },
];

export type JourneyStage = { key: string; label: string; order: number };

export const JOURNEY_STAGES: JourneyStage[] = [
  { key: "prepare", label: "Prepare & Plan", order: 1 },
  { key: "investment-license", label: "Investment License", order: 2 },
  { key: "commercial-registration", label: "Commercial Registration", order: 3 },
  { key: "address-chamber", label: "Address & Chamber", order: 4 },
  { key: "tax-labor", label: "Tax & Labor", order: 5 },
  { key: "banking-activation", label: "Banking & Activation", order: 6 },
  { key: "ongoing-compliance", label: "Ongoing Compliance", order: 7 },
];

export type JourneyStep = {
  /** Stable key persisted as roadmap_steps.step_key — never renumber. */
  key: string;
  stageKey: string;
  title: string;
  description: string;
  /** Owning government authority / body, e.g. "MISA". */
  authority: string;
  portalUrl: string;
  /** Linked document type ids from documentTypes.ts (may be empty for action-only steps). */
  documentTypeIds: string[];
  /** Keys of steps that should ideally be completed first (soft prerequisites). */
  dependsOn: string[];
  /** Whether this step applies to a given profile. */
  appliesWhen: (p: BusinessProfile) => boolean;
  /** Indicative government fee range in SAR — verify. [0,0] = no government fee. */
  estFeeSar?: [number, number];
  /** Indicative processing time range in days — verify. */
  estDays?: [number, number];
  /** Always true in v1: this rule needs partner/authority validation. */
  verify: boolean;
  /** Optional CTA label for the primary action. */
  actionLabel?: string;
};

// ---- applicability predicate helpers -------------------------------------

const always = () => true;
const foreignOnly = (p: BusinessProfile) => p.ownership === "foreign";
const notSole = (p: BusinessProfile) => p.legalStructure !== "sole_establishment";
const activityIn =
  (...ids: BusinessActivity[]) =>
  (p: BusinessProfile) =>
    ids.includes(p.activity);

// ---- the journey graph ----------------------------------------------------

export const JOURNEY_STEPS: JourneyStep[] = [
  // --- Prepare & Plan ---
  {
    key: "identity-docs",
    stageKey: "prepare",
    title: "Prepare owner identity documents",
    description: "Gather a passport or Iqama copy for each owner or authorized signatory.",
    authority: "Absher",
    portalUrl: "https://www.absher.sa",
    documentTypeIds: ["passport-iqama"],
    dependsOn: [],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 3],
    verify: true,
    actionLabel: "Store in Vault",
  },
  {
    key: "activity-description",
    stageKey: "prepare",
    title: "Write your business activity description",
    description: "A short, clear description of your intended activity — used for license classification.",
    authority: "MISA",
    portalUrl: "https://misa.gov.sa",
    documentTypeIds: ["business-plan"],
    dependsOn: [],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 2],
    verify: true,
  },
  {
    key: "reserve-trade-name",
    stageKey: "prepare",
    title: "Reserve your trade name",
    description: "Check availability and reserve your company name through the Saudi Business Center.",
    authority: "Saudi Business Center",
    portalUrl: "https://business.sa",
    documentTypeIds: [],
    dependsOn: [],
    appliesWhen: always,
    estFeeSar: [0, 100],
    estDays: [1, 2],
    verify: true,
  },
  {
    key: "draft-aoa",
    stageKey: "prepare",
    title: "Draft your Articles of Association",
    description: "Prepare the founding document defining ownership, structure, and governance (notarized).",
    authority: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
    documentTypeIds: ["articles-of-association"],
    dependsOn: ["reserve-trade-name"],
    appliesWhen: notSole,
    estFeeSar: [0, 2000],
    estDays: [2, 5],
    verify: true,
  },

  // --- Investment License (foreign only) ---
  {
    key: "misa-license",
    stageKey: "investment-license",
    title: "Obtain your MISA investment license",
    description: "Foreign-owned companies must secure an investment license before registering.",
    authority: "MISA",
    portalUrl: "https://misa.gov.sa",
    documentTypeIds: ["misa-license"],
    dependsOn: ["activity-description"],
    appliesWhen: foreignOnly,
    estFeeSar: [2000, 12000],
    estDays: [5, 15],
    verify: true,
  },

  // --- Commercial Registration ---
  {
    key: "commercial-registration",
    stageKey: "commercial-registration",
    title: "Issue your Commercial Registration (CR)",
    description: "Register the company with the Ministry of Commerce to obtain its core legal identity.",
    authority: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
    documentTypeIds: ["commercial-registration"],
    // MISA (foreign) or trade-name reservation (local) precede this — deps are
    // intersected with the applicable journey at render time.
    dependsOn: ["misa-license", "reserve-trade-name", "draft-aoa"],
    appliesWhen: always,
    estFeeSar: [200, 1200],
    estDays: [1, 3],
    verify: true,
  },

  // --- Address & Chamber ---
  {
    key: "national-address",
    stageKey: "address-chamber",
    title: "Register your National Address",
    description: "Register the company's official National Address with Saudi Post (Sole).",
    authority: "Saudi Post (Sole)",
    portalUrl: "https://splonline.com.sa",
    documentTypeIds: [],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [0, 100],
    estDays: [1, 2],
    verify: true,
  },
  {
    key: "chamber-membership",
    stageKey: "address-chamber",
    title: "Activate Chamber of Commerce membership",
    description: "Register with your local Chamber of Commerce to authenticate company documents.",
    authority: "Chamber of Commerce",
    portalUrl: "https://www.saudichambers.org.sa",
    documentTypeIds: [],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [800, 2000],
    estDays: [1, 3],
    verify: true,
  },
  {
    key: "municipal-license",
    stageKey: "address-chamber",
    title: "Get your municipal license (Baladiya)",
    description: "Obtain the local municipal permit required to operate from your premises.",
    authority: "Balady",
    portalUrl: "https://balady.gov.sa",
    documentTypeIds: ["municipal-license"],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [500, 5000],
    estDays: [3, 10],
    verify: true,
  },
  {
    key: "civil-defense",
    stageKey: "address-chamber",
    title: "Pass the Civil Defense safety inspection",
    description: "Confirm your premises meet fire and safety requirements to receive the Civil Defense permit.",
    authority: "Civil Defense",
    portalUrl: "https://www.998.gov.sa",
    documentTypeIds: ["civil-defense-permit"],
    dependsOn: ["municipal-license"],
    appliesWhen: activityIn("food", "trade", "industrial"),
    estFeeSar: [0, 1000],
    estDays: [5, 15],
    verify: true,
  },

  // --- Tax & Labor ---
  {
    key: "zatca-registration",
    stageKey: "tax-labor",
    title: "Register with ZATCA (VAT & tax)",
    description: "Register for VAT and tax with the Zakat, Tax and Customs Authority.",
    authority: "ZATCA",
    portalUrl: "https://zatca.gov.sa",
    documentTypeIds: ["zatca-registration"],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 3],
    verify: true,
  },
  {
    key: "gosi-registration",
    stageKey: "tax-labor",
    title: "Register with GOSI (social insurance)",
    description: "Register the company and its employees with the General Organization for Social Insurance.",
    authority: "GOSI",
    portalUrl: "https://www.gosi.gov.sa",
    documentTypeIds: ["gosi-registration"],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 2],
    verify: true,
  },
  {
    key: "qiwa-file",
    stageKey: "tax-labor",
    title: "Open your Qiwa labor file",
    description: "Establish your labor file with the Ministry of Human Resources via Qiwa.",
    authority: "Qiwa (MHRSD)",
    portalUrl: "https://qiwa.sa",
    documentTypeIds: [],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 2],
    verify: true,
  },
  {
    key: "nitaqat",
    stageKey: "tax-labor",
    title: "Meet Saudization (Nitaqat) requirements",
    description: "Confirm your Saudi-employee ratio meets Nitaqat requirements for your sector and size.",
    authority: "Qiwa (MHRSD)",
    portalUrl: "https://qiwa.sa",
    documentTypeIds: ["nitaqat-certificate"],
    dependsOn: ["qiwa-file"],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [1, 5],
    verify: true,
  },
  {
    key: "muqeem-visas",
    stageKey: "tax-labor",
    title: "Set up Muqeem & issue work visas",
    description: "Register on Muqeem and process residency/work visas for foreign staff.",
    authority: "Muqeem (Absher Business)",
    portalUrl: "https://muqeem.sa",
    documentTypeIds: [],
    dependsOn: ["qiwa-file"],
    appliesWhen: foreignOnly,
    estFeeSar: [2000, 7000],
    estDays: [5, 20],
    verify: true,
  },

  // --- Banking & Activation ---
  {
    key: "corporate-bank",
    stageKey: "banking-activation",
    title: "Open a corporate bank account",
    description: "Open a business account with a SAMA-licensed bank to receive capital and transact.",
    authority: "SAMA-licensed bank",
    portalUrl: "https://www.sama.gov.sa",
    documentTypeIds: [],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estFeeSar: [0, 0],
    estDays: [3, 15],
    verify: true,
  },
  {
    key: "import-export",
    stageKey: "banking-activation",
    title: "Obtain your Import/Export license & customs code",
    description: "Register with Saudi Customs (FASAH) to import or export goods.",
    authority: "Saudi Customs (FASAH)",
    portalUrl: "https://www.fasah.sa",
    documentTypeIds: ["import-export-license"],
    dependsOn: ["commercial-registration"],
    appliesWhen: activityIn("trade", "industrial"),
    estFeeSar: [0, 2000],
    estDays: [3, 10],
    verify: true,
  },
  {
    key: "sfda-food",
    stageKey: "banking-activation",
    title: "Register your food facility with SFDA",
    description: "Register your food-handling facility for hygiene and safety compliance.",
    authority: "SFDA",
    portalUrl: "https://www.sfda.gov.sa",
    documentTypeIds: ["sfda-food-facility"],
    dependsOn: ["municipal-license"],
    appliesWhen: activityIn("food"),
    estFeeSar: [0, 3000],
    estDays: [5, 20],
    verify: true,
  },
  {
    key: "food-health-certs",
    stageKey: "banking-activation",
    title: "Get food-handler health certificates",
    description: "Obtain health certification for each staff member who handles food directly.",
    authority: "Ministry of Health",
    portalUrl: "https://www.moh.gov.sa",
    documentTypeIds: ["food-handler-health-certs"],
    dependsOn: [],
    appliesWhen: activityIn("food"),
    estFeeSar: [0, 500],
    estDays: [2, 7],
    verify: true,
  },
  {
    key: "municipal-food-permit",
    stageKey: "banking-activation",
    title: "Get your municipal food establishment permit",
    description: "Secure the Balady permit specific to restaurants, cafes, and food outlets.",
    authority: "Balady",
    portalUrl: "https://balady.gov.sa",
    documentTypeIds: ["municipal-food-permit"],
    dependsOn: ["municipal-license"],
    appliesWhen: activityIn("food"),
    estFeeSar: [0, 2000],
    estDays: [3, 10],
    verify: true,
  },

  // --- Ongoing Compliance (recurring, informational) ---
  {
    key: "vat-filing",
    stageKey: "ongoing-compliance",
    title: "File VAT returns on schedule",
    description: "File periodic VAT returns with ZATCA to stay compliant once registered.",
    authority: "ZATCA",
    portalUrl: "https://zatca.gov.sa",
    documentTypeIds: [],
    dependsOn: ["zatca-registration"],
    appliesWhen: always,
    estDays: undefined,
    verify: true,
  },
  {
    key: "cr-renewal",
    stageKey: "ongoing-compliance",
    title: "Renew your Commercial Registration annually",
    description: "Keep your CR active by renewing it each year with the Ministry of Commerce.",
    authority: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
    documentTypeIds: [],
    dependsOn: ["commercial-registration"],
    appliesWhen: always,
    estDays: undefined,
    verify: true,
  },
  {
    key: "nitaqat-maintenance",
    stageKey: "ongoing-compliance",
    title: "Maintain your Saudization ratio",
    description: "Keep your Saudi-employee ratio within your Nitaqat band as you hire.",
    authority: "Qiwa (MHRSD)",
    portalUrl: "https://qiwa.sa",
    documentTypeIds: [],
    dependsOn: ["nitaqat"],
    appliesWhen: always,
    estDays: undefined,
    verify: true,
  },
];

// ---- derived lookups & builders ------------------------------------------

const STAGE_ORDER = new Map(JOURNEY_STAGES.map((s) => [s.key, s.order]));
const STEP_BY_KEY = new Map(JOURNEY_STEPS.map((s) => [s.key, s]));
const STAGE_BY_KEY = new Map(JOURNEY_STAGES.map((s) => [s.key, s]));

export function getStep(key: string | null | undefined): JourneyStep | undefined {
  return key ? STEP_BY_KEY.get(key) : undefined;
}

export function getStage(key: string | null | undefined): JourneyStage | undefined {
  return key ? STAGE_BY_KEY.get(key) : undefined;
}

/**
 * Ordered list of steps that apply to the profile — grouped by stage order,
 * preserving declaration order within a stage (which already respects deps).
 * Used to seed roadmap_steps in order.
 */
export function flattenJourney(profile: BusinessProfile): JourneyStep[] {
  return JOURNEY_STEPS.map((step, i) => ({ step, i }))
    .filter((x) => x.step.appliesWhen(profile))
    .sort((a, b) => {
      const sa = STAGE_ORDER.get(a.step.stageKey) ?? 999;
      const sb = STAGE_ORDER.get(b.step.stageKey) ?? 999;
      if (sa !== sb) return sa - sb;
      return a.i - b.i;
    })
    .map((x) => x.step);
}

/** The applicable journey grouped into non-empty stages, in stage order. */
export function buildJourney(profile: BusinessProfile): { stage: JourneyStage; steps: JourneyStep[] }[] {
  const ordered = flattenJourney(profile);
  return JOURNEY_STAGES.map((stage) => ({
    stage,
    steps: ordered.filter((s) => s.stageKey === stage.key),
  })).filter((g) => g.steps.length > 0);
}

// ---- display helpers ------------------------------------------------------

export function formatSar(range?: [number, number]): string | null {
  if (!range) return null;
  const [lo, hi] = range;
  if (lo === 0 && hi === 0) return "No government fee";
  if (lo === hi) return `SAR ${lo.toLocaleString()}`;
  return `SAR ${lo.toLocaleString()}–${hi.toLocaleString()}`;
}

export function formatDays(range?: [number, number]): string | null {
  if (!range) return null;
  const [lo, hi] = range;
  if (lo === hi) return `~${lo} day${lo === 1 ? "" : "s"}`;
  return `${lo}–${hi} days`;
}

/** Coerce arbitrary input into a valid profile, applying legality rules. */
export function normalizeProfile(input: {
  activity: BusinessActivity;
  ownership?: unknown;
  legalStructure?: unknown;
}): BusinessProfile {
  const ownership: Ownership = input.ownership === "foreign" ? "foreign" : "saudi_gcc";
  let legalStructure: LegalStructure =
    input.legalStructure === "branch" || input.legalStructure === "sole_establishment"
      ? input.legalStructure
      : "llc";
  // Foreign investors cannot use a sole establishment.
  if (ownership === "foreign" && legalStructure === "sole_establishment") {
    legalStructure = "llc";
  }
  return { activity: input.activity, ownership, legalStructure };
}
