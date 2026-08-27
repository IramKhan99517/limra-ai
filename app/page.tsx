import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { RadarSignature } from "@/components/RadarSignature";
import { Calculator } from "@/components/Calculator";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";

const DOC_TYPE_COUNT = DOCUMENT_TYPES.length;
const AUTHORITY_COUNT = new Set(DOCUMENT_TYPES.map((d) => d.portalName)).size;

const MODULES = [
  { name: "Document Vault", desc: "Store every business document in one private, encrypted vault — with the correct government form and portal for each requirement.", status: "live" },
  { name: "Regulatory Radar", desc: "Real-time monitoring of MISA, ZATCA, and Ministry updates mapped to your entity.", status: "roadmap" },
  { name: "Licensing Engine", desc: "Auto-generated, pre-validated license applications with confidence scoring.", status: "roadmap" },
  { name: "Entity Structuring", desc: "Model LLC, branch, or JV structures with ownership and tax implications.", status: "roadmap" },
  { name: "Incentive Finder", desc: "Surface grants, SEZ benefits, and Vision 2030 incentives you qualify for.", status: "roadmap" },
  { name: "Localization Score", desc: "Track Saudization (Nitaqat) targets and GOSI compliance in one score.", status: "roadmap" },
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
  { step: "02", title: "Get your roadmap", desc: "See a personalized, step-by-step checklist with the correct government form and portal for each requirement." },
  { step: "03", title: "Prepare & store", desc: "Download each official form, complete it, and keep every signed document in one secure vault." },
  { step: "04", title: "Stay organized as you grow", desc: "Track your setup progress and keep licenses, renewals, and documents in one place — with more automation on the way." },
];

const PLANS = [
  { name: "Founder", price: "SAR 0", cadence: "forever", desc: "For solo founders exploring market entry.", features: ["Licensing checklist", "Document Vault", "Personalized setup roadmap", "Community support"], cta: "Start free", href: "/signup", featured: false },
  { name: "Growth", price: "SAR 899", cadence: "month", desc: "For teams actively launching and operating.", features: ["Everything in Founder", "Command Dashboard", "Priority expert matching", "Up to 5 entities"], cta: "Request beta access", href: "/signup", featured: true },
  { name: "Enterprise", price: "Custom", cadence: "", desc: "For multinationals and RHQ operations.", features: ["Unlimited entities", "Dedicated advisor", "API & data feeds", "SLA & audit logs", "Custom integrations"], cta: "Talk to sales", href: "#cta", featured: false },
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
              Launch your business in Saudi Arabia with{" "}
              <span className="italic text-signal">total clarity.</span>
            </h1>
            <p className="mt-6 max-w-md text-dune">
              Describe your business in a sentence. LIMRA AI maps it to the exact Saudi licenses and
              documents you need, builds a personalized setup roadmap, and keeps every file in one
              secure vault.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/signup" className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
                Start your setup
              </a>
              <a href="/dashboard" className="rounded-full border border-ink-line px-6 py-3 text-sm text-linen transition hover:border-dune">
                Explore the platform
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

      {/* Stats */}
      <Reveal>
        <section className="border-y border-ink-line bg-ink-soft/50 px-6 py-10">
          <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 text-center font-mono">
            <Stat value={String(DOC_TYPE_COUNT)} label="Document types mapped" />
            <Stat value={String(AUTHORITY_COUNT)} label="Saudi authorities covered" />
            <Stat value="AI-guided" label="Setup roadmap" />
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
              The Document Vault is live today. The rest are on our near-term roadmap as we integrate
              each Saudi authority.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-ink-line p-6 transition hover:border-signal/40">
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
                </div>
              </Reveal>
            ))}
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
              A live view of your business setup — licenses, documents, and your step-by-step
              roadmap — backed by a real database that updates as you work.
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
            Build your business in the Kingdom with confidence.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dune">
            Map your Saudi business setup, get a personalized document roadmap, and keep every
            file in one secure vault — free while we&apos;re in private beta.
          </p>
          <a href="#top" className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-7 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
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
