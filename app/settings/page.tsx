"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AppShell } from "@/components/AppShell";
import { Reveal } from "@/components/Reveal";
import MfaWizard from "@/components/MfaWizard";
import { useSubscription } from "@/lib/paywall";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const { plan, active, loading: subLoading } = useSubscription();
  const { lang, setLang } = useI18n();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login?returnTo=/settings");
        return;
      }
      setEmail(session.user.email ?? "");
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => setFullName(profile?.full_name ?? ""));
      setChecking(false);
    });
  }, [router]);

  async function saveProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", session.user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (checking) return null;

  return (
    <AppShell>
      <Reveal>
        <p className="eyebrow">Settings</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">Account & security</h1>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Profile */}
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-ink-line p-6">
              <p className="eyebrow">Profile</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Email</span>
                  <input value={email} disabled className="w-full rounded-lg border border-ink-line bg-ink px-4 py-2.5 text-sm text-dune opacity-60" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-dune">Full name</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-ink-line bg-ink px-4 py-2.5 text-sm text-linen focus:border-signal/50 focus:outline-none"
                  />
                </label>
                <button
                  onClick={saveProfile}
                  className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft"
                >
                  {saved ? "Saved ✓" : "Save profile"}
                </button>
              </div>
            </div>
          </Reveal>

          {/* Subscription */}
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-ink-line p-6">
              <p className="eyebrow">Subscription</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-linen">
                    Plan: <span className="capitalize text-signal">{subLoading ? "…" : plan === "free" ? "Free" : plan}</span>
                  </p>
                  <p className="mt-1 text-xs text-dune">
                    {active ? "Premium features unlocked ✓" : "You're on the free plan."}
                  </p>
                </div>
                {!active && (
                  <a
                    href="/subscribe"
                    className="rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-signal-soft"
                  >
                    Upgrade
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          {/* Language */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink-line p-6">
              <p className="eyebrow">Language</p>
              <p className="mt-2 text-sm text-dune">
                Switch between English and Arabic. Arabic enables full RTL layout.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-full px-5 py-2.5 text-sm transition ${
                    lang === "en" ? "bg-signal text-ink" : "border border-ink-line text-dune hover:border-dune"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("ar")}
                  className={`rounded-full px-5 py-2.5 text-sm transition ${
                    lang === "ar" ? "bg-signal text-ink" : "border border-ink-line text-dune hover:border-dune"
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* MFA */}
        <Reveal delay={0.06}>
          <MfaWizard />
        </Reveal>
      </div>
    </AppShell>
  );
}