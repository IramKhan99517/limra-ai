"use client";

import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { RadarSignature } from "@/components/RadarSignature";
import { Calculator } from "@/components/Calculator";
import { UnlockBlock } from "@/lib/paywall";
import { saudiDomainRecs } from "@/lib/naming";
import { useI18n } from "@/lib/i18n";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";

const DOC_TYPE_COUNT = DOCUMENT_TYPES.length;
const AUTHORITY_COUNT = new Set(DOCUMENT_TYPES.map((d) => d.portalName)).size;

const MODULES = [
  { nameKey: "mod.namestudio", descKey: "mod.namestudio.desc", status: "live", href: "/naming-studio" },
  { nameKey: "mod.domains", descKey: "mod.domains.desc", status: "live", href: "/domain-intelligence" },
  { nameKey: "mod.contract", descKey: "mod.contract.desc", status: "live", href: "/contract-analyzer" },
  { nameKey: "mod.roadmap", descKey: "mod.roadmap.desc", status: "live", href: "/roadmap-builder" },
  { nameKey: "mod.grants", descKey: "mod.grants.desc", status: "live", href: "/grants" },
  { nameKey: "mod.vault", descKey: "mod.vault.desc", status: "live", href: "/vault" },
  { nameKey: "mod.insights", descKey: "mod.insights.desc", status: "live", href: "/insights" },
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
  { step: "01", titleKey: "journey.1.title", descKey: "journey.1.desc" },
  { step: "02", titleKey: "journey.2.title", descKey: "journey.2.desc" },
  { step: "03", titleKey: "journey.3.title", descKey: "journey.3.desc" },
  { step: "04", titleKey: "journey.4.title", descKey: "journey.4.desc" },
];

const NAME_PREVIEWS = [
  { name: "Noora", root: "noora" },
  { name: "Riyadh Roast", root: "riyadhroast" },
  { name: "Sadeem Tech", root: "sadeemtech" },
];

const PLANS = [
  { nameKey: "plan.founder", price: "SAR 0", cadence: "", descKey: "plan.founder.desc", features: ["plan.founder.f1", "plan.founder.f2", "plan.founder.f3", "plan.founder.f4"], ctaKey: "plan.founder.cta", href: "/signup", featured: false },
  { nameKey: "plan.growth", price: "SAR 899", cadence: "pricing.month", descKey: "plan.growth.desc", features: ["plan.growth.f1", "plan.growth.f2", "plan.growth.f3", "plan.growth.f4", "plan.growth.f5", "plan.growth.f6", "plan.growth.f7"], ctaKey: "plan.growth.cta", href: "/subscribe", featured: true },
  { nameKey: "plan.enterprise", price: "Custom", cadence: "", descKey: "plan.enterprise.desc", features: ["plan.enterprise.f1", "plan.enterprise.f2", "plan.enterprise.f3", "plan.enterprise.f4", "plan.enterprise.f5"], ctaKey: "plan.enterprise.cta", href: "/subscribe", featured: false },
];

export default function Home() {
  const { t } = useI18n();
  const benefitKeys = [
    "benefit.1", "benefit.2", "benefit.3", "benefit.4", "benefit.5", "benefit.6", "benefit.7", "benefit.8", "benefit.9",
  ];
  const nameFeatures = ["teaser.names.f1", "teaser.names.f2", "teaser.names.f3", "teaser.names.f4"];
  const domainFeatures = ["teaser.domains.f1", "teaser.domains.f2", "teaser.domains.f3", "teaser.domains.f4"];

  return (
    <main id="top">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.08] md:text-6xl">
              {t("hero.title1")}{" "}
              <span className="italic text-signal">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-6 max-w-md text-dune">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/signup" className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
                {t("hero.cta1")}
              </a>
              <a href="/naming-studio" className="rounded-full border border-ink-line px-6 py-3 text-sm text-linen transition hover:border-dune">
                {t("hero.cta2")}
              </a>
            </div>
            <p className="mt-8 font-mono text-xs text-dune">{t("hero.beta")}</p>
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
            <p className="eyebrow">{t("benefits.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-2xl md:text-3xl">
              {t("benefits.title")}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefitKeys.map((key, i) => (
              <Reveal key={key} delay={i * 0.03}>
                <div className="flex items-center gap-3 rounded-xl border border-ink-line bg-ink/40 px-4 py-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/15 text-sm text-signal">
                    ✓
                  </span>
                  <span className="text-sm text-linen">{t(key)}</span>
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
            <Stat value={String(DOC_TYPE_COUNT)} label={t("stat.docs")} />
            <Stat value={String(AUTHORITY_COUNT)} label={t("stat.authorities")} />
            <Stat value={t("stat.ai")} label={t("stat.aiLabel")} />
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
                  <p className="eyebrow">{t("vision.eyebrow")}</p>
                  <h2 className="mt-3 font-display text-2xl md:text-3xl">
                    {t("vision.title")}
                  </h2>
                  <p className="mt-3 text-sm text-dune">{t("vision.body")}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  <a
                    href="/insights"
                    className="rounded-full border border-signal/40 px-5 py-2.5 text-sm text-signal transition hover:bg-signal hover:text-ink"
                  >
                    {t("vision.cta1")}
                  </a>
                  <a
                    href="/grants"
                    className="rounded-full border border-gold/40 px-5 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-ink"
                  >
                    {t("vision.cta2")}
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
            <p className="eyebrow">{t("modules.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("modules.title")}
            </h2>
            <p className="mt-3 max-w-xl text-dune">{t("modules.sub")}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m, i) => (
              <Reveal key={m.nameKey} delay={i * 0.06}>
                <a
                  href={m.href}
                  className={`h-full block rounded-xl border p-6 transition hover:border-signal/40 ${
                    m.status === "live" ? "border-signal/20 hover:bg-signal/5" : "border-ink-line"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg">{t(m.nameKey)}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                        m.status === "live" ? "bg-signal/15 text-signal" : "bg-ink-line text-dune"
                      }`}
                    >
                      {t("modules.live")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dune">{t(m.descKey)}</p>
                  {m.status === "live" && (
                    <p className="mt-3 text-xs text-signal">{t("modules.explore")}</p>
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
              <p className="eyebrow">{t("teaser.names.eyebrow")}</p>
              <h2 className="mt-3 text-balance font-display text-3xl md:text-4xl">
                {t("teaser.names.title")}
              </h2>
              <p className="mt-4 max-w-md text-dune">{t("teaser.names.sub")}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-linen">
                {nameFeatures.map((key) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <span className="text-signal">✦</span> {t(key)}
                  </li>
                ))}
              </ul>
              <a
                href="/naming-studio"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
              >
                {t("teaser.names.cta")}
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <p className="eyebrow">{t("teaser.names.preview")}</p>
                <div className="mt-4 space-y-3">
                  {[
                    { en: "FutureEdge Consulting", ar: "فيوتشر إيدج كونسلتنج", brand: "حافة المستقبل للاستشارات" },
                    { en: "Noora Trading Co.", ar: "نورا للتجارة", brand: "نورا التجارية" },
                    { en: "Sadeem Tech Labs", ar: "سديم تك لابس", brand: "مختبرات سديم التقنية" },
                  ].map((r) => (
                    <div key={r.en} className="rounded-xl border border-ink-line bg-ink/40 p-4">
                      <p className="font-display text-base text-linen">{r.en}</p>
                      <div className="mt-2 space-y-0.5 text-sm">
                        <p dir="rtl" className="text-dune">{r.ar} <span className="text-[10px] uppercase tracking-wide text-dune/70">{t("teaser.transliteration")}</span></p>
                        <p dir="rtl" className="font-display text-gold">{r.brand} <span className="text-[10px] uppercase tracking-wide text-gold/70">{t("teaser.brandVersion")}</span></p>
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
                <p className="eyebrow">{t("teaser.domains.preview")}</p>
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
              <p className="eyebrow">{t("teaser.domains.eyebrow")}</p>
              <h2 className="mt-3 text-balance font-display text-3xl md:text-4xl">
                {t("teaser.domains.title")}
              </h2>
              <p className="mt-4 max-w-md text-dune">{t("teaser.domains.sub")}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-linen">
                {domainFeatures.map((key) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <span className="text-signal">◎</span> {t(key)}
                  </li>
                ))}
              </ul>
              <a
                href="/domain-intelligence"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-signal/50 px-6 py-3 text-sm text-signal transition hover:bg-signal hover:text-ink"
              >
                {t("teaser.domains.cta")}
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Zones */}
      <section id="zones" className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">{t("zones.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("zones.title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">{t("zones.sub")}</p>
          </Reveal>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-dune">
                  <th className="pb-3 font-normal">{t("zones.col.zone")}</th>
                  <th className="pb-3 font-normal">{t("zones.col.cost")}</th>
                  <th className="pb-3 font-normal">{t("zones.col.bank")}</th>
                  <th className="pb-3 font-normal">{t("zones.col.time")}</th>
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
            <p className="eyebrow">{t("calc.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("calc.title")}
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
            <p className="eyebrow">{t("market.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("market.title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">{t("market.sub")}</p>
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
                    <a href={`/book?expert=${encodeURIComponent(e.name)}`} className="text-xs text-signal hover:underline">{t("market.book")}</a>
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
            <p className="eyebrow">{t("dashTeaser.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("dashTeaser.title")}
            </h2>
            <p className="mt-3 max-w-xl text-dune">{t("dashTeaser.sub")}</p>
            <a
              href="/dashboard"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-signal/50 px-6 py-3 text-sm text-signal transition hover:bg-signal hover:text-ink"
            >
              {t("dashTeaser.cta")}
            </a>
          </Reveal>
        </div>
      </section>

      {/* Setup Journey */}
      <section className="border-t border-ink-line px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">{t("journey.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("journey.title")}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.step} delay={i * 0.08}>
                <p className="font-mono text-2xl text-gold">{j.step}</p>
                <h3 className="mt-3 font-display text-lg">{t(j.titleKey)}</h3>
                <p className="mt-2 text-sm text-dune">{t(j.descKey)}</p>
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
            <p className="eyebrow">{t("pricing.eyebrow")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
              {t("pricing.title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-dune">{t("pricing.sub")}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.nameKey} delay={i * 0.06}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    p.featured ? "border-signal bg-signal/5" : "border-ink-line"
                  }`}
                >
                  {p.featured && <p className="mb-2 text-xs uppercase tracking-wide text-signal">{t("pricing.popular")}</p>}
                  <h3 className="font-display text-xl">{t(p.nameKey)}</h3>
                  <p className="mt-2 font-mono text-3xl">
                    {p.price}
                    {p.cadence && <span className="text-sm text-dune"> / {t(p.cadence)}</span>}
                  </p>
                  <p className="mt-2 text-sm text-dune">{t(p.descKey)}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-dune">
                    {p.features.map((f) => (
                      <li key={f}>— {t(f)}</li>
                    ))}
                  </ul>
                  <a
                    href={p.href}
                    className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                      p.featured ? "bg-signal text-ink hover:bg-signal-soft" : "border border-ink-line text-linen hover:border-dune"
                    }`}
                  >
                    {t(p.ctaKey)}
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
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-dune">{t("cta.sub")}</p>
          <a href="/signup" className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-7 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft">
            {t("cta.button")}
          </a>
        </Reveal>
      </section>

      <footer className="border-t border-ink-line px-6 py-10 text-center text-xs text-dune">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4">
          <a href="/about" className="hover:text-linen">{t("footer.about")}</a>
          <a href="/privacy" className="hover:text-linen">{t("footer.privacy")}</a>
          <a href="/terms" className="hover:text-linen">{t("footer.terms")}</a>
        </div>
        {t("footer.rights")}
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