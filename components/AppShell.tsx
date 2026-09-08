"use client";

/* AppShell — authenticated app layout with the premium sidebar:
 * Dashboard, Name Studio, Domain Intelligence, Grants & Incentives,
 * Roadmap Builder, Settings. Wraps a client page with the Nav on top
 * and a sticky sidebar on the left (right in RTL).
 */

import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "◧" },
  { href: "/naming-studio", label: "Name Studio", icon: "✦" },
  { href: "/domain-intelligence", label: "Domain Intelligence", icon: "◎" },
  { href: "/grants", label: "Grants & Incentives", icon: "◈" },
  { href: "/roadmap-builder", label: "Roadmap Builder", icon: "↗" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main>
      <Nav />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 md:px-6">
        <aside className="sticky top-24 hidden h-fit w-60 shrink-0 flex-col gap-1 lg:flex">
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.28em] text-dune">
            Workspace
          </p>
          {ITEMS.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-dune transition hover:bg-ink-line/60 hover:text-linen"
            >
              <span className="w-4 text-signal">{it.icon}</span>
              {it.label}
            </a>
          ))}
          <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
            <p className="text-xs font-medium text-gold">KSA Business Launch</p>
            <p className="mt-1 text-[11px] leading-relaxed text-dune">
              Names, domains, grants, and your roadmap — one AI-powered platform.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Mobile sidebar nav */}
      <div className="mx-auto mb-6 flex max-w-7xl flex-wrap gap-2 px-4 md:px-6 lg:hidden">
        {ITEMS.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className="flex items-center gap-2 rounded-full border border-ink-line px-3 py-1.5 text-xs text-dune transition hover:border-dune hover:text-linen"
          >
            <span className="text-signal">{it.icon}</span>
            {it.label}
          </a>
        ))}
      </div>
    </main>
  );
}