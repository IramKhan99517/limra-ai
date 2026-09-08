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

export type SubscriptionStatus = {
  /** null = signed out or row missing; otherwise plan id. */
  plan: string | null;
  active: boolean;
  /** ISO date string or null. */
  expiresAt: string | null;
  loading: boolean;
};

const Ctx = createContext<SubscriptionStatus>({
  plan: null,
  active: false,
  expiresAt: null,
  loading: true,
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>({
    plan: null,
    active: false,
    expiresAt: null,
    loading: true,
  });

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setStatus({ plan: null, active: false, expiresAt: null, loading: false });
      return;
    }
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("id", session.user.id)
      .single();
    if (!data) {
      setStatus({ plan: null, active: false, expiresAt: null, loading: false });
      return;
    }
    const active = data.status === "active" && (!data.expires_at || new Date(data.expires_at) > new Date());
    setStatus({ plan: data.plan ?? null, active, expiresAt: data.expires_at ?? null, loading: false });
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
  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
      <p className="eyebrow">Premium</p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl">What You&apos;ll Unlock</h2>
      <ul className="mt-6 space-y-3">
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
      <a
        href="/subscribe"
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
      >
        Subscribe to Unlock Full Business Intelligence
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
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session?.user));
  }, []);

  if (loading || signedIn === null) {
    return (
      <div className="rounded-xl border border-ink-line p-8 text-center text-sm text-dune">
        Checking your access…
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-signal/30 bg-signal/5 p-8 text-center">
        <p className="font-display text-xl text-linen">This is a premium feature</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-dune">
          Log in to unlock Name Studio, Domain Intelligence, Grants, and your AI Roadmap Builder.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:bg-signal-soft"
        >
          Log in to continue
        </a>
      </div>
    );
  }

  if (!active) {
    return <UnlockBlock />;
  }

  return <>{children}</>;
}