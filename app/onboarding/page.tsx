"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import {
  OWNERSHIP_OPTIONS,
  LEGAL_STRUCTURE_OPTIONS,
  type Ownership,
  type LegalStructure,
} from "@/lib/ksaJourney";

const EXAMPLES = [
  "I want to start a food business in Saudi Arabia",
  "I'm opening a software consultancy in Riyadh",
  "I want to import and sell electronics",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [ownership, setOwnership] = useState<Ownership>("saudi_gcc");
  const [legalStructure, setLegalStructure] = useState<LegalStructure>("llc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  // Foreign investors cannot use a sole establishment — keep the form legal.
  useEffect(() => {
    if (ownership === "foreign" && legalStructure === "sole_establishment") {
      setLegalStructure("llc");
    }
  }, [ownership, legalStructure]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ message, ownership, legalStructure }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (checking) return null;

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-2xl px-6 py-20">
        <Reveal>
          <p className="eyebrow">Get started</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">
            Tell LIMRA AI about your business
          </h1>
          <p className="mt-3 text-dune">
            Describe what you want to do in Saudi Arabia in your own words. We&apos;ll classify your
            business, build a personalized setup roadmap, and tell you exactly what documents you
            need — LIMRA doesn&apos;t grant approvals itself; the relevant government authority
            remains the approving body throughout.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I want to start a food business in Saudi Arabia"
              className="w-full rounded-lg border border-ink-line bg-transparent px-4 py-3 text-sm text-linen placeholder:text-dune focus:outline-none focus:ring-2 focus:ring-signal"
            />

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setMessage(ex)}
                  className="rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-dune hover:text-linen"
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="grid gap-4 border-t border-ink-line/60 pt-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ownership" className="mb-1.5 block text-xs uppercase tracking-wide text-dune">
                  Ownership
                </label>
                <select
                  id="ownership"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as Ownership)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {OWNERSHIP_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-dune">
                  {OWNERSHIP_OPTIONS.find((o) => o.id === ownership)?.hint}
                </p>
              </div>
              <div>
                <label htmlFor="legalStructure" className="mb-1.5 block text-xs uppercase tracking-wide text-dune">
                  Legal structure
                </label>
                <select
                  id="legalStructure"
                  value={legalStructure}
                  onChange={(e) => setLegalStructure(e.target.value as LegalStructure)}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-2.5 text-sm text-linen focus:outline-none focus:ring-2 focus:ring-signal"
                >
                  {LEGAL_STRUCTURE_OPTIONS.map((o) => (
                    <option
                      key={o.id}
                      value={o.id}
                      disabled={ownership === "foreign" && !o.foreignAllowed}
                    >
                      {o.label}
                      {ownership === "foreign" && !o.foreignAllowed ? " — Saudi/GCC only" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-dune">
                  {LEGAL_STRUCTURE_OPTIONS.find((o) => o.id === legalStructure)?.hint}
                </p>
              </div>
            </div>

            {error && <p className="text-sm text-gold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft disabled:opacity-60"
            >
              {loading ? "Building your roadmap..." : "Build my roadmap"}
            </button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
