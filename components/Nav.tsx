const links = [
  { href: "#modules", label: "Intelligence" },
  { href: "#zones", label: "Zones" },
  { href: "#calculator", label: "Calculator" },
  { href: "#marketplace", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Log in" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/70 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg tracking-tight">
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
        </div>
        <a
          href="/signup"
          className="rounded-full border border-gold/60 px-4 py-2 text-sm text-gold transition hover:bg-gold hover:text-ink"
        >
          Get Started
        </a>
      </nav>
    </header>
  );
}
