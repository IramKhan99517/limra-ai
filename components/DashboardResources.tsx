import {
  OFFICIAL_PORTALS,
  SAUDI_BANKS,
  ECONOMIC_ZONES,
  EXPERT_DIRECTORIES,
  type ResourceLink,
} from "@/lib/resources";

function hostOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function LinkCard({ item }: { item: ResourceLink }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-ink-line p-4 transition hover:border-signal/50 hover:bg-ink-soft/30"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-linen">{item.name}</p>
        <span className="text-dune transition group-hover:text-signal">↗</span>
      </div>
      <p className="mt-1 text-xs text-dune">{item.note}</p>
      <p className="mt-2 font-mono text-[11px] text-signal/80">{hostOf(item.url)}</p>
    </a>
  );
}

function Group({
  order,
  title,
  blurb,
  children,
}: {
  order: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-gold">{order}</span>
        <h3 className="font-display text-sm uppercase tracking-wide text-linen">{title}</h3>
      </div>
      <p className="mt-1 text-xs text-dune">{blurb}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export function DashboardResources() {
  return (
    <div className="rounded-xl border border-ink-line p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg">Portals &amp; experts</h2>
        <span
          className="rounded-full border border-gold/40 px-2 py-0.5 text-[11px] text-gold"
          title="Links to official Saudi authorities and licensed-provider directories. Confirm the current URL and requirements before you rely on them."
        >
          official links · verify
        </span>
      </div>
      <p className="mt-1 text-xs text-dune">
        Direct routes to the authorities behind your roadmap, business banking, economic zones, and
        where to find licensed help.
      </p>

      <div className="mt-6 space-y-8">
        <Group
          order="01"
          title="Government portals"
          blurb="The authorities that issue your licenses and registrations."
        >
          {OFFICIAL_PORTALS.map((p) => (
            <LinkCard key={p.url} item={p} />
          ))}
        </Group>

        <Group
          order="02"
          title="Bank portals"
          blurb="SAMA-licensed banks for your corporate account. Business banking is national — usable from any city or zone. Confirm current requirements with the bank."
        >
          {SAUDI_BANKS.map((b) => (
            <LinkCard key={b.url} item={b} />
          ))}
        </Group>

        <Group
          order="03"
          title="Economic zones"
          blurb="Zone authorities handle setup, land, and incentives inside their zone — start with the authority."
        >
          {ECONOMIC_ZONES.map((z) => (
            <a
              key={z.url}
              href={z.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-ink-line p-4 transition hover:border-signal/50 hover:bg-ink-soft/30"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-linen">{z.name}</p>
                <span className="text-dune transition group-hover:text-signal">↗</span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-gold/80">{z.region}</p>
              <p className="mt-1 text-xs text-dune">{z.note}</p>
              <p className="mt-2 font-mono text-[11px] text-signal/80">{hostOf(z.url)}</p>
            </a>
          ))}
        </Group>

        <Group
          order="04"
          title="Find an expert"
          blurb="A LIMRA-vetted marketplace is on the roadmap. Until then, verify any provider's license through the official directory for their field."
        >
          {EXPERT_DIRECTORIES.map((e) => (
            <LinkCard key={e.url} item={e} />
          ))}
        </Group>
      </div>
    </div>
  );
}
