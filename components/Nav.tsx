"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useI18n } from "@/lib/i18n";

const links = [
  { href: "/naming-studio", key: "nav.namestudio" },
  { href: "/domain-intelligence", key: "nav.domains" },
  { href: "/contract-analyzer", key: "nav.contract" },
  { href: "/roadmap-builder", key: "nav.roadmap" },
  { href: "/grants", key: "nav.grants" },
  { href: "/insights", key: "nav.insights" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/#pricing", key: "nav.pricing" },
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
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
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
      })
      .catch(() => setLoaded(true)); // never leave the nav stuck on the placeholder

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
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/70 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/#top" className="flex shrink-0 items-center gap-2 font-display text-lg tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-signal/50 text-sm text-signal">
            L
          </span>
          LIMRA <span className="text-signal">AI</span>
        </a>
        {/* Desktop nav: compact set at md–lg, full set at xl+ so links never
            crowd the brand or wrap onto two lines. */}
        <div className="mx-auto hidden min-w-0 flex-1 items-center justify-center gap-5 whitespace-nowrap text-sm text-dune lg:flex xl:gap-7">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`transition hover:text-linen ${i > 2 ? "hidden xl:inline" : ""}`}
            >
              {t(l.key)}
            </a>
          ))}
          {isAdmin && (
            <a href="/admin" className="shrink-0 text-gold transition hover:text-gold-soft">
              {t("nav.admin")}
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language dropdown — English / العربية (whole page switches + RTL) */}
          <select
            aria-label={t("nav.lang")}
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "ar")}
            className="hidden h-9 rounded-full border border-ink-line bg-ink px-3 text-sm text-dune transition hover:border-dune focus:outline-none sm:block"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-linen transition hover:border-dune lg:hidden"
            aria-label={t("nav.menu")}
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
                    <p className="truncate text-sm text-linen">{fullName || t("nav.yourAccount")}</p>
                    <p className="truncate text-xs text-dune">{email}</p>
                  </div>
                </div>
                <div className="p-1.5 text-sm">
                  <a href="/account" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.account")}
                  </a>
                  <a href="/naming-studio" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.namestudio")}
                  </a>
                  <a href="/domain-intelligence" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.domains")}
                  </a>
                  <a href="/contract-analyzer" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.contract")}
                  </a>
                  <a href="/settings" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.settings")}
                  </a>
                  <a href="/dashboard" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.dashboard")}
                  </a>
                  <a href="/vault" className="block rounded-lg px-3 py-2 text-linen transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                    {t("nav.vault")}
                  </a>
                  {isAdmin && (
                    <a href="/admin" className="block rounded-lg px-3 py-2 text-gold transition hover:bg-ink-line" onClick={() => setMenuOpen(false)}>
                      {t("nav.adminPanel")}
                    </a>
                  )}
                </div>
                <div className="border-t border-ink-line p-1.5">                    <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-dune transition hover:bg-ink-line hover:text-linen"
                  >
                    {t("nav.signout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden text-sm text-dune transition hover:text-linen sm:inline">
              {t("nav.login")}
            </a>
            <a
              href="/signup"
              className="rounded-full border border-gold/60 px-4 py-2 text-sm text-gold transition hover:bg-gold hover:text-ink"
            >
              {t("nav.signup")}
            </a>
          </div>
        )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-line bg-ink px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-dune transition hover:bg-ink-line hover:text-linen"
              >
                {t(l.key)}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-gold transition hover:bg-ink-line"
              >
                {t("nav.admin")}
              </a>
            )}
            {!email && (
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-dune transition hover:bg-ink-line hover:text-linen"
              >
                {t("nav.login")}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
