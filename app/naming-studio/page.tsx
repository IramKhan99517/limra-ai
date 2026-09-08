"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { PremiumGate, useSubscription } from "@/lib/paywall";
import { AppShell } from "@/components/AppShell";
import { Reveal } from "@/components/Reveal";
import NameStudioPremium from "@/components/NameStudioPremium";

export default function NamingStudioPage() {
  const router = useRouter();
  const { loading } = useSubscription();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/login?returnTo=/naming-studio");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  if (checking || loading) return null;

  return (
    <AppShell>
      <Reveal>
        <p className="eyebrow">Name Studio</p>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Brand Name Intelligence for Saudi Arabia
        </h1>
        <p className="mt-3 max-w-xl text-dune">
          Generate business names, check suitability against Saudi naming rules, get alternatives,
          and receive Arabic transliterations and brand versions for every option.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <PremiumGate>
          <NameStudioPremium />
        </PremiumGate>
      </Reveal>
    </AppShell>
  );
}