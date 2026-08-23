export type DocumentType = {
  id: string;
  category: "Before You Start" | "Registration" | "Tax & Social Insurance" | "Operating Permits";
  name: string;
  description: string;
  portalName: string;
  portalUrl: string;
};

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "passport-iqama",
    category: "Before You Start",
    name: "Owner Passport / Iqama Copy",
    description: "Identity document for each owner or authorized signatory on the company.",
    portalName: "Absher",
    portalUrl: "https://www.absher.sa",
  },
  {
    id: "business-plan",
    category: "Before You Start",
    name: "Business Activity Description",
    description: "A short description of your intended business activity — required for license classification.",
    portalName: "MISA",
    portalUrl: "https://misa.gov.sa",
  },
  {
    id: "misa-license",
    category: "Registration",
    name: "MISA Investment License",
    description: "Required for any foreign-owned or foreign-invested company operating in Saudi Arabia.",
    portalName: "MISA",
    portalUrl: "https://misa.gov.sa",
  },
  {
    id: "commercial-registration",
    category: "Registration",
    name: "Commercial Registration (CR)",
    description: "Your company's core legal registration with the Ministry of Commerce.",
    portalName: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
  },
  {
    id: "articles-of-association",
    category: "Registration",
    name: "Articles of Association",
    description: "The company's founding legal document defining ownership, structure, and governance.",
    portalName: "Ministry of Commerce",
    portalUrl: "https://mc.gov.sa",
  },
  {
    id: "zatca-registration",
    category: "Tax & Social Insurance",
    name: "ZATCA Tax Registration",
    description: "VAT and tax registration with the Zakat, Tax and Customs Authority.",
    portalName: "ZATCA",
    portalUrl: "https://zatca.gov.sa",
  },
  {
    id: "gosi-registration",
    category: "Tax & Social Insurance",
    name: "GOSI Registration",
    description: "Social insurance registration for you and any employees.",
    portalName: "GOSI",
    portalUrl: "https://gosi.gov.sa",
  },
  {
    id: "nitaqat-certificate",
    category: "Tax & Social Insurance",
    name: "Saudization (Nitaqat) Certificate",
    description: "Confirms your company's Saudi-employee ratio meets Ministry of Labor requirements.",
    portalName: "Qiwa",
    portalUrl: "https://qiwa.sa",
  },
  {
    id: "municipal-license",
    category: "Operating Permits",
    name: "Municipal License (Baladiya)",
    description: "Local municipal permit required to legally operate from your business premises.",
    portalName: "Balady",
    portalUrl: "https://balady.gov.sa",
  },
  {
    id: "civil-defense-permit",
    category: "Operating Permits",
    name: "Civil Defense Permit",
    description: "Confirms your premises meet fire and safety requirements.",
    portalName: "Civil Defense",
    portalUrl: "https://966.gov.sa",
  },
  {
    id: "import-export-license",
    category: "Operating Permits",
    name: "Import/Export License",
    description: "Only required if your business imports or exports goods.",
    portalName: "Saudi Customs",
    portalUrl: "https://customs.gov.sa",
  },
];

export const DOCUMENT_CATEGORIES = [
  "Before You Start",
  "Registration",
  "Tax & Social Insurance",
  "Operating Permits",
] as const;
