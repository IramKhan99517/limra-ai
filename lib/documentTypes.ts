export type BusinessActivity = "food" | "tech" | "trade" | "consulting" | "industrial";

export const BUSINESS_ACTIVITIES: { id: BusinessActivity; label: string }[] = [
  { id: "food", label: "Food & Beverage" },
  { id: "tech", label: "Technology & SaaS" },
  { id: "trade", label: "Trading & Retail" },
  { id: "consulting", label: "Consulting & Services" },
  { id: "industrial", label: "Industrial & Manufacturing" },
];

export type DocumentType = {
  id: string;
  category: "Before You Start" | "Registration" | "Tax & Social Insurance" | "Operating Permits";
  name: string;
  description: string;
  portalName: string;
  portalUrl: string;
  /** Which business activities require this document. "all" = every business. */
  activities: BusinessActivity[] | "all";
};

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "passport-iqama",
    category: "Before You Start",
    name: "Owner Passport / Iqama Copy",
    description: "Identity document for each owner or authorized signatory on the company.",
    portalName: "Absher",
    portalUrl: "https://www.absher.sa",
    activities: "all",
  },
  {
    id: "business-plan",
    category: "Before You Start",
    name: "Business Activity Description",
    description: "A short description of your intended business activity — required for license classification.",
    portalName: "MISA",
    portalUrl: "https://misa.gov.sa",
    activities: "all",
  },
  {
    id: "misa-license",
    category: "Registration",
    name: "MISA Investment License",
    description: "Required for any foreign-owned or foreign-invested company operating in Saudi Arabia.",
    portalName: "MISA",
    portalUrl: "https://misa.gov.sa",
    activities: "all",
  },
  {
    id: "commercial-registration",
    category: "Registration",
    name: "Commercial Registration (CR)",
    description: "Your company's core legal registration with the Ministry of Commerce.",
    portalName: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
    activities: "all",
  },
  {
    id: "articles-of-association",
    category: "Registration",
    name: "Articles of Association",
    description: "The company's founding legal document defining ownership, structure, and governance.",
    portalName: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
    activities: "all",
  },
  {
    id: "zatca-registration",
    category: "Tax & Social Insurance",
    name: "ZATCA Tax Registration",
    description: "VAT and tax registration with the Zakat, Tax and Customs Authority.",
    portalName: "ZATCA",
    portalUrl: "https://zatca.gov.sa",
    activities: "all",
  },
  {
    id: "gosi-registration",
    category: "Tax & Social Insurance",
    name: "GOSI Registration",
    description: "Social insurance registration for you and any employees.",
    portalName: "GOSI",
    portalUrl: "https://gosi.gov.sa",
    activities: "all",
  },
  {
    id: "nitaqat-certificate",
    category: "Tax & Social Insurance",
    name: "Saudization (Nitaqat) Certificate",
    description: "Confirms your company's Saudi-employee ratio meets Ministry of Labor requirements.",
    portalName: "Qiwa",
    portalUrl: "https://qiwa.sa",
    activities: "all",
  },
  {
    id: "municipal-license",
    category: "Operating Permits",
    name: "Municipal License (Baladiya)",
    description: "Local municipal permit required to legally operate from your business premises.",
    portalName: "Balady",
    portalUrl: "https://balady.gov.sa",
    activities: "all",
  },
  {
    id: "civil-defense-permit",
    category: "Operating Permits",
    name: "Civil Defense Permit",
    description: "Confirms your premises meet fire and safety requirements.",
    portalName: "Civil Defense",
    portalUrl: "https://966.gov.sa",
    activities: ["food", "trade", "industrial"],
  },
  {
    id: "import-export-license",
    category: "Operating Permits",
    name: "Import/Export License",
    description: "Only required if your business imports or exports goods.",
    portalName: "Saudi Customs",
    portalUrl: "https://customs.gov.sa",
    activities: ["trade", "industrial"],
  },
  {
    id: "sfda-food-facility",
    category: "Operating Permits",
    name: "SFDA Food Facility Registration",
    description: "Required for any facility that prepares, handles, or sells food — covers hygiene and safety compliance.",
    portalName: "SFDA",
    portalUrl: "https://sfda.gov.sa",
    activities: ["food"],
  },
  {
    id: "food-handler-health-certs",
    category: "Operating Permits",
    name: "Food Handler Health Certificates",
    description: "Health certification for each staff member who handles food directly.",
    portalName: "Ministry of Health",
    portalUrl: "https://moh.gov.sa",
    activities: ["food"],
  },
  {
    id: "municipal-food-permit",
    category: "Operating Permits",
    name: "Municipal Food Establishment Permit",
    description: "Municipal approval specific to restaurants, cafes, and food outlets, on top of the general municipal license.",
    portalName: "Balady",
    portalUrl: "https://balady.gov.sa",
    activities: ["food"],
  },
];

export const DOCUMENT_CATEGORIES = [
  "Before You Start",
  "Registration",
  "Tax & Social Insurance",
  "Operating Permits",
] as const;

export function documentsForActivity(
  activity: string | null | undefined,
  ownership?: string | null,
): DocumentType[] {
  let docs = !activity
    ? DOCUMENT_TYPES
    : DOCUMENT_TYPES.filter(
        (dt) => dt.activities === "all" || dt.activities.includes(activity as BusinessActivity),
      );
  // The MISA investment license is a foreign-ownership requirement only.
  if (ownership === "saudi_gcc") docs = docs.filter((dt) => dt.id !== "misa-license");
  return docs;
}
