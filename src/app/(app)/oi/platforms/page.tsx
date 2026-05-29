import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLATFORMS } from "@/lib/oi/platforms";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

const regionLabel: Record<string, string> = { CA: "Canada", US: "United States", BOTH: "CA + US" };

export default async function PlatformsPage() {
  const user = await requireCurrentUser();
  const prospects = await prisma.prospect.findMany({ where: { userId: user.id }, select: { primaryPlatforms: true, secondaryPlatforms: true } });

  const freq = new Map<string, number>();
  for (const p of prospects) {
    for (const n of p.primaryPlatforms) freq.set(n, (freq.get(n) ?? 0) + 2);
    for (const n of p.secondaryPlatforms) freq.set(n, (freq.get(n) ?? 0) + 1);
  }

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Platform Intelligence</h1>
        <p className="text-xs text-fg-subtle mt-0.5">The procurement ecosystem Phil monitors · weighted by relevance across your book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {PLATFORMS.map((pl) => {
          const score = freq.get(pl.name) ?? 0;
          return (
            <Panel key={pl.key}>
              <PanelHeader
                title={<span className="inline-flex items-center gap-2"><Layers className="h-4 w-4 text-accent" /> {pl.name}</span>}
                hint={`${regionLabel[pl.region]} · ${pl.kind}`}
                action={score > 0 ? <Badge tone="accent">relevance {score}</Badge> : undefined}
              />
              <PanelBody>
                <p className="text-xs text-fg-muted">{pl.note}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pl.industries.slice(0, 4).map((i) => <span key={i} className="pill bg-bg-raised text-fg-subtle ring-1 ring-border text-[10px]">{i}</span>)}
                </div>
                <div className="mt-1.5 text-[11px] text-fg-subtle">Buyers: {pl.govLevels.join(", ")}</div>
              </PanelBody>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
