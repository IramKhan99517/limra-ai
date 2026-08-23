"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const links = [
  { href: "/#modules", label: "Intelligence" },
  { href: "/#zones", label: "Zones" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#marketplace", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#pricing", label: "Pricing" },
];

export function Nav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? null);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
      setLoaded(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      if (!session?.user) setIsAdmin(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setEmail(null);
    setIsAdmin(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/70 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/#top" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-signal/50 text-sm text-signal">
            L
          </span>
          LIMRA <span className="text-signal">AI</span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-dune md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-linen">
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <a href="/admin" className="text-gold transition hover:text-gold-soft">
              Admin
            </a>
          )}
        </div>

        {!loaded ? (
          <div className="h-9 w-24" />
        ) : email ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-dune sm:inline">{email}</span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-ink-line px-4 py-2 text-sm text-linen transition hover:border-dune"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden text-sm text-dune transition hover:text-linen sm:inline">
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-full border border-gold/60 px-4 py-2 text-sm text-gold transition hover:bg-gold hover:text-ink"
            >
              Get Started
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
