"use client";

import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { UNLOCK_FEATURES } from "@/lib/paywall";

const PLANS = [
  {
    name: "Free",
    price: "SAR 0",
    cadence: "forever",
    desc: "Explore the platform and preview every module.",
    features: ["Licensing checklist", "Document Vault", "Limited name previews", "Community support"],
    cta: "Start free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Growth",
    price: "SAR 899",
    cadence: "month",
    desc: "Everything you need to launch and brand your business.",
    features: [
      "Unlimited Name Generation",
      "Arabic Brand Creation",
      "Premium Domain Intelligence",
      "Full Grants Database",
      "AI Business Roadmaps",
      "Priority expert matching",
    ],
    cta: "Subscribe now",
    href: "/signup?returnTo=/subscribe",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "For multinationals and RHQ operations.",
    features: ["Unlimited entities", "Dedicated advisor", "API & data feeds", "SLA & audit logs"],
    cta: "Talk to sales",
    href: "#cta",
    featured: false,
  },
];

export default function SubscribePage() {
  return (
    <main>
      <Nav />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="eyebrow">Subscription</p>
            <h1 className="mt-3 text-balance font-display text-4xl md:text-5xl">
              What You&apos;ll Unlock
            </h1>
            <p className="mt-4 max-w-xl text-dune">
              One subscription unlocks the complete Saudi business intelligence stack — naming,
              branding, domains, grants, and roadmaps.
            </p>
          </Reveal>

          {/* Unlock features */}
          <Reveal delay={0.05} className="mt-10">
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
              <ul className="grid gap-4 md:grid-cols-2">
                {UNLOCK_FEATURES.map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-xs text-signal">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-medium text-linen">{f.title}</p>
                      <p className="text-xs text-dune">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Plans */}
          <Reveal delay={0.1} className="mt-12">
            <div className="grid gap-6 md:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.name}
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
              ))}
            </div>
          </Reveal>

          {/* Strong CTA */}
          <Reveal delay={0.15} className="mt-12 text-center">
            <h2 className="mx-auto max-w-2xl text-balance font-display text-2xl md:text-3xl">
              Subscribe to Unlock Full Business Intelligence
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-dune">
              Join founders across the Kingdom building compliant, well-branded businesses with AI.
            </p>
            <a
              href="/signup?returnTo=/naming-studio"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-8 py-3.5 text-sm font-medium text-ink transition hover:bg-signal-soft"
            >
              Get started now →
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}