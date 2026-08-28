"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const links = [
  { href: "/#modules", label: "Intelligence" },
  { href: "/#zones", label: "Zones" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#marketplace", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vault", label: "Vault" },
  { href: "/#pricing", label: "Pricing" },
];

export function Nav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Gate the nav on the LOCAL session (instant) — not getUser() (network round-trip
    // that can hang and leave the login control hidden behind the placeholder).
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      setEmail(user?.email ?? null);
      setLoaded(true);
      if (user) {
        // Enrich in the background; a slow/failed profile fetch must not block the UI.
        supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === "admin");
            setFullName(profile?.full_name ?? null);
          });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setFullName(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setEmail(null);
    setIsAdmin(false);
    setFullName(null);
    setMenuOpen(false);
    router.push("/");
  }

  const initials = (fullName || email || "?").trim().charAt(0).toUpperCase();

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-linen transition hover:border-dune md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        {!loaded ? (
          <div className="h-9 w-24" />
        ) : email ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-ink-line py-1.5 pl-1.5 pr-3 transition hover:border-dune"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-signal/15 font-mono text-xs text-signal">
                {initials}
              </span>
              <span className="hidden text-sm text-linen sm:inline">{fullName || email}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-ink-line bg-ink-soft shadow-xl">
                <div className="flex items-center gap-3 border-b border-ink-line p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal/15 font-mono text-sm text-signal">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-linen">{fullName || "Your account"}</p>
                    <p className="truncate text-xs text-dune">{email}</p>
                  </div>
                </div>
                <div className="p-1.5 text-sm">
                  <a href="/account" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    View Profile
                  </a>
                  <a href="/vault" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    Document Vault
                  </a>
                  <a href="/dashboard" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </a>
                  {isAdmin && (
                    <a href="/admin" className="block rounded-lg px-3 py-2 text-gold transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                      Admin Panel
                    </a>
                  )}
                </div>
                <div className="border-t border-ink-line p-1.5">
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-dune transition hover:bg-ink-line hover:text-linen"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
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
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-line bg-ink px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-dune transition hover:bg-ink-line hover:text-linen"
              >
                {l.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-gold transition hover:bg-ink-line"
              >
                Admin
              </a>
            )}
            {!email && (
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-dune transition hover:bg-ink-line hover:text-linen"
              >
                Log in
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
