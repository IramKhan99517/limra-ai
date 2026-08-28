// LIMRA AI — external resource directory (v1)
//
// Honest, verify-flagged pointers to REAL official Saudi portals and to
// licensed-provider directories. No invented firms and nothing asserted as
// authoritative: URLs and eligibility rules change, so every link is
// indicative and must be confirmed. This mirrors the "verify before
// production" stance of lib/ksaJourney.ts.

export type ResourceLink = {
  name: string;
  url: string;
  note: string;
};

// Core government portals behind the setup journey. These authorities also
// appear on individual journey steps in lib/ksaJourney.ts.
export const OFFICIAL_PORTALS: ResourceLink[] = [
  { name: "MISA", url: "https://misa.gov.sa", note: "Foreign investment licenses" },
  { name: "Ministry of Commerce", url: "https://mc.gov.sa", note: "Commercial Registration & Articles of Association" },
  { name: "Saudi Business Center", url: "https://business.sa", note: "Trade-name reservation & unified setup" },
  { name: "ZATCA", url: "https://zatca.gov.sa", note: "VAT, Zakat, tax & customs" },
  { name: "Qiwa (MHRSD)", url: "https://qiwa.sa", note: "Labor file & Saudization (Nitaqat)" },
  { name: "GOSI", url: "https://www.gosi.gov.sa", note: "Social insurance registration" },
  { name: "Balady", url: "https://balady.gov.sa", note: "Municipal licenses & permits" },
  { name: "SFDA", url: "https://www.sfda.gov.sa", note: "Food, drug & medical-device compliance" },
  { name: "SAMA", url: "https://www.sama.gov.sa", note: "Central bank — official list of licensed banks" },
];

// Major SAMA-licensed banks that offer corporate/SME accounts. Business
// banking in Saudi Arabia is national, not zone-restricted — any of these can
// open an account for a company registered in any city or economic zone.
// Confirm the current portal and account requirements with the bank.
export const SAUDI_BANKS: ResourceLink[] = [
  { name: "Saudi National Bank (SNB)", url: "https://www.snb.com", note: "Corporate & SME accounts" },
  { name: "Al Rajhi Bank", url: "https://www.alrajhibank.com.sa", note: "Corporate & SME accounts" },
  { name: "Riyad Bank", url: "https://www.riyadbank.com", note: "Corporate & SME accounts" },
  { name: "Saudi Awwal Bank (SAB)", url: "https://www.sab.com", note: "Corporate & SME accounts" },
  { name: "Alinma Bank", url: "https://www.alinma.com", note: "Corporate & SME accounts" },
  { name: "Banque Saudi Fransi", url: "https://www.alfransi.com.sa", note: "Corporate & SME accounts" },
  { name: "Arab National Bank (ANB)", url: "https://www.anb.com.sa", note: "Corporate & SME accounts" },
];

export type ZoneResource = ResourceLink & { region: string };

// Economic zones / cities and their governing authorities. Setup, incentives,
// and land within a zone are handled by its authority — start there.
export const ECONOMIC_ZONES: ZoneResource[] = [
  { name: "Economic Cities & Special Zones Authority (ECZA)", region: "National regulator", url: "https://eczasa.gov.sa", note: "Regulator for Saudi Special Economic Zones (SEZs)" },
  { name: "King Abdullah Economic City (KAEC)", region: "Makkah · Rabigh", url: "https://www.kaec.net", note: "Industrial Valley & KAEC SEZ" },
  { name: "MODON Industrial Cities", region: "Nationwide", url: "https://www.modon.gov.sa", note: "Industrial land & factory setup" },
  { name: "King Abdullah Financial District (KAFD)", region: "Riyadh", url: "https://www.kafd.sa", note: "Financial & business district" },
  { name: "NEOM", region: "Tabuk", url: "https://www.neom.com", note: "Greenfield region & Oxagon industrial city" },
];

// Where to find LICENSED providers — official directories/regulators, not a
// LIMRA-vetted list. A curated expert marketplace is on the roadmap; until
// then these are the authoritative places to verify a provider's license.
export const EXPERT_DIRECTORIES: ResourceLink[] = [
  { name: "Lawyers & notaries", url: "https://www.moj.gov.sa", note: "Ministry of Justice — licensed legal professionals" },
  { name: "Accountants & auditors", url: "https://socpa.org.sa", note: "SOCPA — VAT/Zakat & audit professionals" },
  { name: "Business setup & PRO services", url: "https://business.sa", note: "Saudi Business Center — unified setup services" },
  { name: "HR & Saudization advisors", url: "https://qiwa.sa", note: "Qiwa (MHRSD) — labor & Nitaqat guidance" },
];
