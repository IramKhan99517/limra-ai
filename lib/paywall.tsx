"use client";

/* LIMRA AI — premium paywall helpers.
 *
 * `useSubscription()` reads the Supabase session + a `subscriptions` row
 * (created by the trigger in lib/subscription.sql) to tell whether the
 * signed-in user has an active premium plan. `PremiumGate` wraps premium
 * UI and shows the "What You'll Unlock" upsell to non-subscribers.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useI18n } from "@/lib/i18n";

export type SubscriptionStatus = {
  /** null = signed out or row missing; otherwise plan id. */
  plan: string | null;
  active: boolean;
  /** ISO date string or null. */
  expiresAt: string | null;
  loading: boolean;
  /** Admins bypass the paywall and see every premium feature. */
  isAdmin: boolean;
};

const Ctx = createContext<SubscriptionStatus>({
  plan: null,
  active: false,
  expiresAt: null,
  loading: true,
  isAdmin: false,
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>({
    plan: null,
    active: false,
    expiresAt: null,
    loading: true,
    isAdmin: false,
  });

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setStatus({ plan: null, active: false, expiresAt: null, loading: false, isAdmin: false });
      return;
    }
    // Admins unlock everything regardless of subscription state.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();
    const isAdmin = profile?.role === "admin";
    if (isAdmin) {
      setStatus({ plan: "admin", active: true, expiresAt: null, loading: false, isAdmin: true });
      return;
    }
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("id", session.user.id)
      .single();
    if (!data) {
      setStatus({ plan: null, active: false, expiresAt: null, loading: false, isAdmin: false });
      return;
    }
    const active = data.status === "active" && (!data.expires_at || new Date(data.expires_at) > new Date());
    setStatus({ plan: data.plan ?? null, active, expiresAt: data.expires_at ?? null, loading: false, isAdmin: false });
  }, []);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const value = useMemo(() => status, [status]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSubscription(): SubscriptionStatus {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/* "What You'll Unlock" — shown before any premium feature             */
/* ------------------------------------------------------------------ */

export const UNLOCK_FEATURES = [
  { title: "Unlimited Name Generation", desc: "Generate and shortlist unlimited Saudi business names for every idea." },
  { title: "Arabic Brand Creation", desc: "Instant Arabic transliteration and natural Arabic brand versions for every name." },
  { title: "Saudi-focused Recommendations", desc: "Names and guidance optimized for Saudi regulations and market practice." },
  { title: "Premium Domain Intelligence", desc: "Live domain availability, brand-domain matching, and Saudi market recommendations." },
  { title: "Full Grants Database", desc: "Complete grant recommendations, eligibility analysis, and action plans." },
  { title: "AI Business Roadmaps", desc: "Personalized setup roadmaps with branding opportunities built in." },
];

export function UnlockBlock() {
  const { t } = useI18n();
  const features = [
    { titleKey: "unlock.f1.title", descKey: "unlock.f1.desc" },
    { titleKey: "unlock.f2.title", descKey: "unlock.f2.desc" },
    { titleKey: "unlock.f3.title", descKey: "unlock.f3.desc" },
    { titleKey: "unlock.f4.title", descKey: "unlock.f4.desc" },
    { titleKey: "unlock.f5.title", descKey: "unlock.f5.desc" },
    { titleKey: "unlock.f6.title", descKey: "unlock.f6.desc" },
    { titleKey: "unlock.f7.title", descKey: "unlock.f7.desc" },
  ];
  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
      <p className="eyebrow">{t("unlock.eyebrow")}</p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl">{t("unlock.title")}</h2>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f.titleKey} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/20 text-xs text-signal">
              ✓
            </span>
            <div>
              <p className="text-sm font-medium text-linen">{t(f.titleKey)}</p>
              <p className="text-xs text-dune">{t(f.descKey)}</p>
            </div>
          </li>
        ))}
      </ul>
      <a
        href="/subscribe"
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
      >
        {t("unlock.cta")}
      </a>
    </div>
  );
}

/**
 * Gate premium content: signed-out users get a login prompt,
 * signed-in non-subscribers get the unlock upsell.
 */
export function PremiumGate({ children }: { children: ReactNode }) {
  const { active, loading } = useSubscription();
  const { t } = useI18n();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session?.user));
  }, []);

  if (loading || signedIn === null) {
    return (
      <div className="rounded-xl border border-ink-line p-8 text-center text-sm text-dune">
        {t("premiumGate.checking")}
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-signal/30 bg-signal/5 p-8 text-center">
        <p className="font-display text-xl text-linen">{t("premiumGate.title")}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-dune">{t("premiumGate.sub")}</p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
        >
          {t("premiumGate.cta")}
        </a>
      </div>
    );
  }

  if (!active) {
    return <UnlockBlock />;
  }

  return <>{children}</>;
}