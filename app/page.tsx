import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { RadarSignature } from "@/components/RadarSignature";
import { Calculator } from "@/components/Calculator";
import { UnlockBlock } from "@/lib/paywall";
import { saudiDomainRecs } from "@/lib/naming";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";

const DOC_TYPE_COUNT = DOCUMENT_TYPES.length;
const AUTHORITY_COUNT = new Set(DOCUMENT_TYPES.map((d) => d.portalName)).size;

const BENEFITS = [
  "AI Business Setup Roadmap",
  "Saudi Business Name Studio",
  "Arabic Brand Generation",
  "Domain Intelligence",
  "Grants & Incentive Discovery",
  "Business Planning Assistant",
  "Localized Saudi Market Insights",
  "Brand, Domain & Compliance Guidance",
];

const MODULES = [
  { name: "Name Studio", desc: "Generate brand-ready Saudi business names, check naming rules, and get Arabic brand versions.", status: "live", href: "/naming-studio" },
  { name: "Domain Intelligence", desc: "Domain availability, brand-domain matching, and Saudi market recommendations.", status: "live", href: "/domain-intelligence" },
  { name: "Roadmap Builder", desc: "Personalized Saudi setup roadmaps with recommended business names built in.", status: "live", href: "/roadmap-builder" },
  { name: "Grants & Incentives", desc: "Curated government grants, salary subsidies, and funding programs for SMEs.", status: "live", href: "/grants" },
  { name: "Document Vault", desc: "Store every business document in one private, encrypted vault — with the correct government form and portal for each requirement.", status: "live", href: "/vault" },
  { name: "Market Insights", desc: "Data-driven sector analysis — growth rates, market sizes, opportunities, and regional hotspots.", status: "live", href: "/insights" },
];

const ZONES = [
  { name: "Cloud Computing SEZ", region: "Riyadh · SEZ", cost: "18,500", bank: 92, time: "2-4 days" },
  { name: "MODON Dammam 2nd City", region: "Eastern Province · City", cost: "19,500", bank: 82, time: "4-7 days" },
  { name: "King Abdullah Economic City", region: "Makkah · SEZ", cost: "21,000", bank: 90, time: "3-5 days" },
  { name: "Jazan SEZ", region: "Jazan · SEZ", cost: "22,500", bank: 84, time: "4-8 days" },
  { name: "Special Integrated Logistics Zone", region: "Riyadh · Logistics", cost: "24,500", bank: 88, time: "3-6 days" },
  { name: "NEOM Oxagen", region: "Tabuk · SEZ", cost: "34,000", bank: 91, time: "5-10 days" },
];

const EXPERTS = [
  { initials: "NL", name: "Najd Legal Partners", city: "Riyadh", rating: "4.9", reviews: 212, tag: "Foreign ownership", price: "From SAR 4,500" },
  { initials: "TA", name: "Tadween Accounting", city: "Jeddah", rating: "4.8", reviews: 168, tag: "ZATCA e-invoicing", price: "From SAR 1,200/mo" },
  { initials: "MP", name: "Mustaqbal PRO", city: "Riyadh", rating: "5.0", reviews: 341, tag: "Iqama & visas", price: "From SAR 900" },
  { initials: "VA", name: "Vision Advisory Co.", city: "Dammam", rating: "4.9", reviews: 97, tag: "Market entry", price: "From SAR 12,000" },
];

const JOURNEY = [
  { step: "01", title: "Describe your business", desc: "Answer a short intake and LIMRA AI maps your activity to the exact licenses and documents you need in Saudi Arabia." },
  { step: "02", title: "Get your roadmap & names", desc: "See a personalized, step-by-step checklist with the correct government form and portal — plus recommended brand-ready business names." },
  { step: "03", title: "Prepare & store", desc: "Download each official form, complete it, and keep every signed document in one secure vault." },
  { step: "04", title: "Stay organized as you grow", desc: "Track your setup progress and keep licenses, renewals, and documents in one place — with more automation on the way." },
];

const NAME_PREVIEWS = [
  { name: "Noora", root: "noora" },
  { name: "Riyadh Roast", root: "riyadhroast" },
  { name: "Sadeem Tech", root: "sadeemtech" },
];

const PLANS = [
  { name: "Founder", price: "SAR 0", cadence: "forever", desc: "For solo founders exploring market entry.", features: ["Licensing checklist", "Document Vault", "Personalized setup roadmap", "Name Studio previews"], cta: "Start free", href: "/signup", featured: false },
  { name: "Growth", price: "SAR 899", cadence: "month", desc: "For teams actively launching and branding in KSA.", features: ["Everything in Founder", "Unlimited Name Generation", "Arabic Brand Creation", "Premium Domain Intelligence", "Full Grants Database", "AI Business Roadmaps"], cta: "Subscribe now", href: "/subscribe", featured: true },
  { name: "Enterprise", price: "Custom", cadence: "", desc: "For multinationals and RHQ operations.", features: ["Unlimited entities", "Dedicated advisor", "API & data feeds", "SLA & audit logs", "Custom integrations"], cta: "Talk to sales", href: "/subscribe", featured: false },
];

export default function Home() {
  return (
    <main id="top">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Powering Vision 2030</p>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.08] md:text-6xl">
              Launch Your Saudi Business{" "}
              <span className="italic text-signal">Faster with AI</span>
            </h1>
            <p className="mt-6 max-w-md text-dune">
              From business name to bank account — LIMRA AI generates brand-ready names, checks
              Saudi naming rules, produces Arabic brand versions, matches your domains, finds grants,
              and builds your personalized setup roadmap.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/signup" className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
                Start your setup
              </a>
              <a href="/naming-studio" className="rounded-full border border-ink-line px-6 py-3 text-sm text-linen transition hover:border-dune">
                Explore Name Studio
              </a>
            </div>
            <p className="mt-8 font-mono text-xs text-dune">
              Now in private beta · Built for founders entering Saudi Arabia
            </p>
          </Reveal>

          <Reveal delay={0.15} className="relative mx-auto w-full max-w-md">
            <RadarSignature className="w-full" />
          </Reveal>
        </div>
      </section>

      {/* Benefits — premium value props */}
      <section className="border-y border-ink-line bg-ink-soft/50 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Everything you need to launch</p>
            <h2 className="mt-3 max-w-2xl font-display text-2xl md:text-3xl">
              One AI platform for the complete Saudi launch journey
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <Reveal key={b} delay={i * 0.03}>
                <div className="flex items-center gap-3 rounded-xl border border-ink-line bg-ink/40 px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/15 text-sm text-signal">
                    ✓
                  </span>
                  <span className="text-sm text-linen">{b}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <Reveal>
        <section className="border-b border-ink-line px-6 py-10">
          <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 text-center font-mono">
            <Stat value={String(DOC_TYPE_COUNT)} label="Document types mapped" />
            <Stat value={String(AUTHORITY_COUNT)} label="Saudi authorities covered" />
            <Stat value="AI-guided" label="Setup roadmap" />
          </div>
        </section>
      </Reveal>

      {/* Vision 2030 Identity */}
      <Reveal>
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8 md:p-12">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <p className="eyebrow">Built for Vision 2030</p>
                  <h2 className="mt-3 font-display text-2xl md:text-3xl">
                    Supporting Saudi Arabia&apos;s transformation from day one
                  </h2>
                  <p className="mt-3 text-sm text-dune">
                    LIMRA AI is built in alignment with Vision 2030 goals — empowering both local and
                    foreign founders to build compliant, well-structured businesses across the Kingdom.
                    From SMEs in Riyadh to startups in NEOM, we map your path through every Saudi authority.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  <a
                    href="/insights"
                    className="rounded-full border border-signal/40 px-5 py-2.5 text-sm text-signal transition hover:bg-signal hover:text-ink"
                  >
                    Explore sector insights →
                  </a>
                  <a
                    href="/grants"
                    className="rounded-full border border-gold/40 px-5 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-ink"
                  >
                    Find funding programs →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Modules */}
      <section id="modules" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Intelligence Modules</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Six engines that turn Saudi red tape into a clear path
            </h2>
            <p className="mt-3 max-w-xl text-dune">
              Name Studio, Domain Intelligence, Roadmap Builder, and Grants are premium —
              log in and subscribe to unlock the full stack.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <a
                  href={m.href}
                  className={`h-full block rounded-xl border p-6 transition hover:border-signal/40 ${
                    m.status === "live" ? "border-signal/20 hover:bg-signal/5" : "border-ink-line"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg">{m.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        m.status === "live" ? "bg-signal/15 text-signal" : "bg-ink-line text-dune"
                      }`}
                    >
                      {m.status === "live" ? "Live" : "Roadmap"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dune">{m.desc}</p>
                  {m.status === "live" && (
                    <p className="mt-3 text-xs text-signal">Explore →</p>
                  )}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Name Studio teaser (premium) */}
      <section className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">Name Studio · Premium</p>
              <h2 className="mt-3 text-balance font-display text-3xl md:text-4xl">
                Brand Name Intelligence for Saudi Arabia
              </h2>
              <p className="mt-4 max-w-md text-dune">
                Generate business names, check suitability against Saudi naming rules, explore
                alternatives, and get an Arabic transliteration and natural Arabic brand version
                for every option — optimized for Saudi regulations and market practice.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-linen">
                {[
                  "Unlimited name generation",
                  "Saudi naming-rule suitability checks",
                  "Arabic transliteration & brand versions",
                  "Premium brandable & SEO-friendly sets",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="text-signal">✦</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/naming-studio"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
              >
                Unlock Name Studio
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <p className="eyebrow">Preview — sample Arabic conversion</p>
                <div className="mt-4 space-y-3">
                  {[
                    { en: "FutureEdge Consulting", ar: "فيوتشر إيدج كونسلتنج", brand: "حافة المستقبل للاستشارات" },
                    { en: "Noora Trading Co.", ar: "نورا للتجارة", brand: "نورا التجارية" },
                    { en: "Sadeem Tech Labs", ar: "سديم تك لابس", brand: "مختبرات سديم التقنية" },
                  ].map((r) => (
                    <div key={r.en} className="rounded-xl border border-ink-line bg-ink/40 p-4">
                      <p className="font-display text-base text-linen">{r.en}</p>
                      <div className="mt-2 space-y-0.5 text-sm">
                        <p dir="rtl" className="text-dune">{r.ar} <span className="text-[10px] uppercase tracking-wide text-dune/70">· transliteration</span></p>
                        <p dir="rtl" className="font-display text-gold">{r.brand} <span className="text-[10px] uppercase tracking-wide text-gold/70">· brand version</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Domain Intelligence teaser (premium) */}
      <section className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal delay={0.1} className="order-2 lg:order-1">
              <div className="glass rounded-2xl p-6">
                <p className="eyebrow">Preview — Saudi market domains</p>
                <div className="mt-4 grid gap-3">
                  {NAME_PREVIEWS.map((ex) => (
                    <div key={ex.name} className="rounded-xl border border-ink-line bg-ink/40 p-4">
                      <p className="text-sm text-linen">{ex.name}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {saudiDomainRecs(ex.root)
                          .slice(0, 4)
                          .map((r) => (
                            <span
                              key={r.domain}
                              dir="ltr"
                              className="rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[11px] text-signal"
                            >
                              {r.domain}
                              {r.premium && <span className="ms-1 text-gold">premium</span>}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <p className="eyebrow">Domain Intelligence · Premium</p>
              <h2 className="mt-3 text-balance font-display text-3xl md:text-4xl">
                Brand-domain matching for the Saudi market
              </h2>
              <p className="mt-4 max-w-md text-dune">
                Check live domain availability, match domains to your brand, discover alternatives,
                and get premium and Saudi-market recommendations built for KSA.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-linen">
                {[
                  "Domain availability across 20+ extensions",
                  "Brand-domain matching & alternatives",
                  "Premium domain suggestions",
                  ".sa & .com.sa Saudi market recommendations",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="text-signal">◎</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/domain-intelligence"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-signal/50 px-6 py-3 text-sm text-signal transition hover:bg-signal hover:text-ink"
              >
                Unlock Domain Intelligence
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Zones */}
      <section id="zones" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Zone Intelligence</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Compare setup costs across Saudi economic zones
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">
              Illustrative sample figures for orientation — live, zone-verified cost and
              processing data is being integrated with each authority.
            </p>
          </Reveal>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-dune">
                  <th className="pb-3 font-normal">Zone</th>
                  <th className="pb-3 font-normal">Year 1 Cost</th>
                  <th className="pb-3 font-normal">Bank Approval</th>
                  <th className="pb-3 font-normal">Processing</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr key={z.name} className="border-b border-ink-line/60">
                    <td className="py-4">
                      <p className="text-linen">{z.name}</p>
                      <p className="text-xs text-dune">{z.region}</p>
                    </td>
                    <td className="py-4 font-mono text-linen">SAR {z.cost}</td>
                    <td className="py-4 font-mono text-signal">{z.bank}%</td>
                    <td className="py-4 text-dune">{z.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Setup Calculator</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Estimate your Year-1 cost before you talk to anyone
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <Calculator />
          </Reveal>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Expert Marketplace</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Specialists, on demand
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">
              Sample partner profiles for illustration — our vetted marketplace and booking
              flow are launching soon.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {EXPERTS.map((e, i) => (
              <Reveal key={e.name} delay={i * 0.06}>
                <div className="flex items-center justify-between rounded-xl border border-ink-line p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 font-mono text-sm text-gold">
                      {e.initials}
                    </div>
                    <div>
                      <p className="text-linen">{e.name}</p>
                      <p className="text-xs text-dune">
                        {e.city} · ★ {e.rating} ({e.reviews}) · {e.tag}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-linen">{e.price}</p>
                    <a href={`/book?expert=${encodeURIComponent(e.name)}`} className="text-xs text-signal hover:underline">Book</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard teaser */}
      <section id="dashboard" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Command Dashboard</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Your entire Saudi operation, one glass surface
            </h2>
            <p className="mt-3 max-w-xl text-dune">
              A live view of your business setup — licenses, documents, recommended names, and your
              step-by-step roadmap — backed by a real database that updates as you work.
            </p>
            <a
              href="/dashboard"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-signal/50 px-6 py-3 text-sm text-signal transition hover:bg-signal hover:text-ink"
            >
              Open live dashboard →
            </a>
          </Reveal>
        </div>
      </section>

      {/* Setup Journey */}
      <section className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Setup Journey</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              From idea to operating entity in four guided stages
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.step} delay={i * 0.08}>
                <p className="font-mono text-2xl text-gold">{j.step}</p>
                <h3 className="mt-3 font-display text-lg">{j.title}</h3>
                <p className="mt-2 text-sm text-dune">{j.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Unlock — before subscription */}
      <section id="unlock" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <UnlockBlock />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              Plans that scale from first license to full RHQ
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">
              LIMRA is in private beta — pricing below is indicative, and beta access is free while we build.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    p.featured ? "border-signal bg-signal/5" : "border-ink-line"
                  }`}
                >
                  {p.featured && <p className="mb-2 text-xs uppercase tracking-wide text-signal">Most popular</p>}
                  <h3 className="font-display text-xl">{p.name}</h3>
                  <p className="mt-2 font-mono text-3xl">
                    {p.price}
                    {p.cadence && <span className="text-sm text-dune"> / {p.cadence}</span>}
                  </p>
                  <p className="mt-2 text-sm text-dune">{p.desc}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-dune">
                    {p.features.map((f) => (
                      <li key={f}>— {f}</li>
                    ))}
                  </ul>
                  <a
                    href={p.href}
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                      p.featured ? "bg-signal text-ink hover:bg-signal-soft" : "border border-ink-line text-linen hover:border-dune"
                    }`}
                  >
                    {p.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="border-t border-ink-line px-6 py-24 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl md:text-4xl">
            Launch your Saudi business faster with AI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dune">
            Names, Arabic brands, domains, grants, and your setup roadmap — one AI-powered platform
            built for the Kingdom.
          </p>
          <a href="/signup" className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-7 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
            Start your setup
          </a>
        </Reveal>
      </section>

      <footer className="border-t border-ink-line px-6 py-10 text-center text-xs text-dune">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4">
          <a href="/about" className="hover:text-linen">About</a>
          <a href="/privacy" className="hover:text-linen">Privacy Policy</a>
          <a href="/terms" className="hover:text-linen">Terms of Service</a>
        </div>
        © 2026 LIMRA AI Intelligence. All rights reserved. · Riyadh, KSA
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl text-signal md:text-3xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-dune">{label}</p>
    </div>
  );
}