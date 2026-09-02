"use client";

import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";

const SECTORS = [
  {
    name: "Technology & SaaS",
    icon: "💻",
    growth: "32%",
    marketSize: "SAR 18B+",
    description: "Saudi's digital economy is the fastest-growing in MENA. Vision 2030 targets 92% cloud adoption by 2030.",
    opportunities: ["AI & Machine Learning", "Fintech & Payments", "EdTech", "HealthTech", "GovTech & Smart Cities"],
    incentives: ["Cloud Computing SEZ (Riyadh)", "MISA tech license fast-track", "Monsha'at digital SME grants"],
    keyAuthority: "MISA",
    avgSetupCost: "SAR 18,000–25,000",
    timeline: "2–4 weeks",
  },
  {
    name: "Tourism & Hospitality",
    icon: "🏨",
    growth: "28%",
    marketSize: "SAR 35B+",
    description: "KSA opened for tourism in 2019 and is investing SAR 1.2T in mega-projects (NEOM, The Red Sea, AMAALA, Qiddiya).",
    opportunities: ["Eco-tourism", "Heritage Tourism", "Medical Tourism", "Adventure Tourism", "MICE & Events"],
    incentives: ["Tourism license fast-track", "SEZ incentives in Red Sea", "HRDF training subsidies for hospitality"],
    keyAuthority: "Saudi Tourism Authority",
    avgSetupCost: "SAR 22,000–35,000",
    timeline: "3–6 weeks",
  },
  {
    name: "Industrial & Manufacturing",
    icon: "🏭",
    growth: "18%",
    marketSize: "SAR 120B+",
    description: "Saudization-heavy sector with strong MODON support. Local manufacturing is a strategic Vision 2030 priority.",
    opportunities: ["Food Processing", "Construction Materials", "Pharmaceuticals", "Renewable Energy", "Aerospace & Defense"],
    incentives: ["MODON industrial cities (subsidized land)", "Local Content (Iktva) program", "Expat levy exemptions for skilled roles"],
    keyAuthority: "MODON / MISA",
    avgSetupCost: "SAR 30,000–50,000",
    timeline: "4–8 weeks",
  },
  {
    name: "Trade & Retail",
    icon: "🛒",
    growth: "15%",
    marketSize: "SAR 90B+",
    description: "E-commerce is booming — 70%+ internet penetration. Traditional retail modernizing rapidly.",
    opportunities: ["E-commerce Platforms", "D2C Brands", "Luxury Retail", "Wholesale & Distribution", "Cross-border Trade"],
    incentives: ["Customs FASAH digital portal", "E-commerce SEZ (Jazan)", "Saudi Post logistics partnerships"],
    keyAuthority: "Ministry of Commerce",
    avgSetupCost: "SAR 20,000–30,000",
    timeline: "2–5 weeks",
  },
  {
    name: "Healthcare & Life Sciences",
    icon: "🏥",
    growth: "22%",
    marketSize: "SAR 60B+",
    description: "Healthcare spending is set to double by 2030. Private sector is a strategic priority.",
    opportunities: ["Telemedicine", "Medical Devices", "Pharma Distribution", "Healthcare AI", "Elder Care"],
    incentives: ["SFDA fast-track for medical devices", "Healthcare SEZ (Jeddah)", "MOH partnership programs"],
    keyAuthority: "MOH / SFDA",
    avgSetupCost: "SAR 25,000–40,000",
    timeline: "4–8 weeks",
  },
  {
    name: "Logistics & Supply Chain",
    icon: "📦",
    growth: "20%",
    marketSize: "SAR 50B+",
    description: "KSA is positioning as a global logistics hub connecting Asia, Africa, and Europe.",
    opportunities: ["Last-mile Delivery", "Cold Chain Logistics", "Warehousing & Fulfillment", "Freight Forwarding", "Maritime Services"],
    incentives: ["Special Integrated Logistics Zone", "MODON industrial land", "FASAH customs digital integration"],
    keyAuthority: "MODON / Saudi Customs",
    avgSetupCost: "SAR 25,000–38,000",
    timeline: "3–6 weeks",
  },
];

const KSA_FACTS = [
  { value: "SAR 4T+", label: "Vision 2030 investment" },
  { value: "#1", label: "Largest economy in MENA" },
  { value: "35M+", label: "Population (2025)" },
  { value: "70%+", label: "Under age 35" },
];

export default function InsightsPage() {
  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="eyebrow">Market Intelligence</p>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">
              KSA sector insights for <span className="italic text-signal">smarter decisions</span>
            </h1>
            <p className="mt-3 max-w-xl text-dune">
              Data-driven overview of high-growth sectors in Saudi Arabia — market size, growth
              rates, opportunities, and the government incentives available for each.
            </p>
          </Reveal>

          {/* KSA Quick Facts */}
          <Reveal delay={0.05} className="mt-12">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {KSA_FACTS.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-ink-line p-4 text-center">
                  <p className="font-mono text-2xl text-signal">{fact.value}</p>
                  <p className="mt-1 text-xs text-dune">{fact.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Sectors Grid */}
          <div className="mt-12 space-y-8">
            {SECTORS.map((sector, i) => (
              <Reveal key={sector.name} delay={i * 0.05}>
                <div className="rounded-xl border border-ink-line p-6 transition hover:border-signal/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sector.icon}</span>
                      <div>
                        <h2 className="font-display text-xl">{sector.name}</h2>
                        <p className="mt-1 text-sm text-dune">{sector.description}</p>
                      </div>
                    </div>
                    <div className="hidden shrink-0 text-right md:block">
                      <p className="font-mono text-lg text-signal">↑ {sector.growth}</p>
                      <p className="text-xs text-dune">annual growth</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gold">Market size</p>
                      <p className="mt-1 font-mono text-sm text-linen">{sector.marketSize}</p>
                      <p className="mt-1 text-[11px] text-dune">Avg setup: {sector.avgSetupCost}</p>
                      <p className="text-[11px] text-dune">Timeline: {sector.timeline}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gold">Opportunities</p>
                      <ul className="mt-1 space-y-0.5">
                        {sector.opportunities.map((opp) => (
                          <li key={opp} className="text-xs text-dune">— {opp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gold">Incentives & Zones</p>
                      <ul className="mt-1 space-y-0.5">
                        {sector.incentives.map((inc) => (
                          <li key={inc} className="text-xs text-dune">— {inc}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-dune">
                        Key authority: <span className="text-signal">{sector.keyAuthority}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 md:hidden">
                    <p className="font-mono text-lg text-signal">↑ {sector.growth}</p>
                    <p className="text-xs text-dune">annual growth</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Regional Hotspots */}
          <Reveal delay={0.3} className="mt-12">
            <div className="rounded-xl border border-ink-line p-6">
              <h2 className="font-display text-lg">Regional Hotspots</h2>
              <p className="mt-1 text-xs text-dune">
                Where the growth is happening — and which zones to watch.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { city: "Riyadh", focus: "Tech, Finance, Government", note: "KAFD, Cloud Computing SEZ, Riyadh Season" },
                  { city: "Jeddah", focus: "Trade, Tourism, Logistics", note: "Red Sea Gateway, Jeddah Tower, waterfront development" },
                  { city: "NEOM (Tabuk)", focus: "Innovation, Green Energy, Tourism", note: "NEOM Bay, Oxagon industrial city, THE LINE" },
                  { city: "Dammam / Eastern", focus: "Oil & Gas, Petrochemicals, Industry", note: "MODON industrial cities, King Abdullah Port" },
                  { city: "Jazan", focus: "Agriculture, Processing, Logistics", note: "Jazan SEZ, King Salman Energy Park" },
                  { city: "AlUla", focus: "Heritage, Luxury Tourism", note: "Royal Commission for AlUla (RCU), UNESCO sites" },
                ].map((r) => (
                  <div key={r.city} className="rounded-lg border border-ink-line/60 p-4">
                    <p className="font-display text-sm text-linen">{r.city}</p>
                    <p className="mt-1 text-xs text-signal">{r.focus}</p>
                    <p className="mt-1 text-xs text-dune">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Disclaimer */}
          <Reveal delay={0.35} className="mt-8">
            <p className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-dune">
              <span className="font-medium text-gold">⚠ Data orientation only.</span>{" "}
              Market sizes, growth rates, and incentive details are directional estimates from
              public sources (Vision 2030, MISA, STATISTA). Confirm with the relevant authority
              before making investment decisions.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
