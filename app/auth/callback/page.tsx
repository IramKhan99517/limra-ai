"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Nav } from "@/components/Nav";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const returnTo = params.get("returnTo") || "/dashboard";
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) router.replace(returnTo);
        else setError("Sign-in didn't complete. Please try again.");
      })
      .catch(() => setError("Sign-in didn't complete. Please try again."));
  }, [params, router]);

  return (
    <main>
      <Nav />
      <section className="mx-auto flex max-w-md flex-col px-6 py-20 text-center">
        {error ? (
          <>
            <p className="eyebrow">Sign-in issue</p>
            <p className="mt-3 text-dune">{error}</p>
            <Link href="/login" className="mt-6 text-signal hover:underline">
              Back to login
            </Link>
          </>
        ) : (
          <p className="text-sm text-dune">Completing sign-in…</p>
        )}
      </section>
    </main>
  );
}