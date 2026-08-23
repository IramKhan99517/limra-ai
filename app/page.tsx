import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { RadarSignature } from "@/components/RadarSignature";
import { Calculator } from "@/components/Calculator";

const MODULES = [
  { name: "Regulatory Radar", desc: "Real-time monitoring of MISA, ZATCA, and Ministry updates mapped directly to your entity." },
  { name: "Licensing Engine", desc: "Auto-generated, pre-validated license applications with confidence scoring." },
  { name: "Entity Structuring", desc: "Model LLC, branch, or JV structures with ownership and tax implications." },
  { name: "Compliance Vault", desc: "Every renewal, filing, and obligation tracked with automated reminders." },
  { name: "Incentive Finder", desc: "Surface grants, SEZ benefits, and Vision 2030 incentives you qualify for." },
  { name: "Localization Score", desc: "Track Saudization (Nitaqat) targets and GOSI compliance in one score." },
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
  { step: "01", title: "Discover & qualify", desc: "Answer a short intake and LIMRA AI maps your activity to the exact licenses, ownership rules, and incentives." },
  { step: "02", title: "Structure & apply", desc: "Generate pre-validated MISA and commercial registration filings with confidence scores before you submit." },
  { step: "03", title: "Activate operations", desc: "Open bank accounts, register for ZATCA and GOSI, and onboard staff — tracked in one checklist." },
  { step: "04", title: "Scale & stay compliant", desc: "Continuous monitoring keeps renewals, Saudization, and tax obligations green as you grow." },
];

const PLANS = [
  { name: "Founder", price: "SAR 0", cadence: "forever", desc: "For solo founders exploring market entry.", features: ["Regulatory Radar (1 sector)", "Licensing checklist", "Marketplace access", "Community support"], cta: "Start free", featured: false },
  { name: "Growth", price: "SAR 899", cadence: "month", desc: "For teams actively launching and operating.", features: ["All Intelligence Modules", "Command Dashboard", "Priority expert matching", "Compliance automation", "Up to 5 entities"], cta: "Start 14-day trial", featured: true },
  { name: "Enterprise", price: "Custom", cadence: "", desc: "For multinationals and RHQ operations.", features: ["Unlimited entities", "Dedicated advisor", "API & data feeds", "SLA & audit logs", "Custom integrations"], cta: "Talk to sales", featured: false },
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
              LIMRA AI unifies regulatory intelligence, an expert marketplace, and a live command
              dashboard — so founders and enterprises can license, structure, and scale across the
              Kingdom without the guesswork.
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
              Trusted by 4,200+ founders · 13 regulatory bodies integrated
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
            <Stat value="4,200+" label="Businesses launched" />
            <Stat value="6 days" label="Avg. license approval" />
            <Stat value="98.4%" label="Compliance accuracy" />
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
              Each module runs on live regulatory data, so your decisions are always grounded in the
              current rules — not last year&apos;s.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-ink-line p-6 transition hover:border-signal/40">
                  <h3 className="font-display text-lg">{m.name}</h3>
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
              Compare real setup costs across Saudi economic zones
            </h2>
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
              Know your real Year-1 cost before you talk to anyone
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
              Vetted specialists, on demand
            </h2>
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
              A living cockpit for licenses, compliance, spend, and localization — backed by a real
              database, updated the moment a filing changes.
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
                    href="#cta"
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
            Join thousands of founders and enterprises using LIMRA AI to launch faster and stay
            compliant across Saudi Arabia.
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
