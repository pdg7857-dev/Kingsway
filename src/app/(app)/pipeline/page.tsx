import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";
import type { DealStage } from "@prisma/client";

export const dynamic = "force-dynamic";

const STAGES: DealStage[] = ["LEAD", "CONTACTED", "QUALIFIED", "TEST_DRIVE", "NEGOTIATION", "WON", "LOST"];

export default async function PipelinePage() {
  const user = await requireCurrentUser();
  const deals = await prisma.deal.findMany({
    where: { userId: user.id },
    orderBy: { valueCents: "desc" },
    include: { business: true, customer: true },
  });

  return (
    <>
      <Topbar title="Sales pipeline" subtitle="Drag-friendly Kanban (read-only MVP)" />
      <div className="px-4 lg:px-6 py-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage) => {
            const items = deals.filter((d) => d.stage === stage);
            const total = items.reduce((s, d) => s + d.valueCents, 0);
            return (
              <Panel key={stage} className="w-[280px] shrink-0">
                <PanelHeader
                  title={stage.replace("_", " ")}
                  hint={`${items.length} · ${fmtCents(total)}`}
                />
                <PanelBody className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-sm text-fg-subtle">—</div>
                  ) : (
                    items.map((d) => (
                      <div key={d.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-3">
                        <div className="flex items-center gap-2">
                          {d.business ? <span className={cn("dot", businessDotBg[d.business.slug])} /> : null}
                          <div className="text-sm text-fg truncate">{d.title}</div>
                        </div>
                        <div className="mt-1 font-mono text-sm">{fmtCents(d.valueCents)}</div>
                        <div className="mt-1 text-[11px] text-fg-subtle truncate">
                          {d.customer?.name ?? "—"} · prob {d.probability}%
                        </div>
                        {d.nextAction ? (
                          <Badge tone="accent" className="mt-2">{d.nextAction}</Badge>
                        ) : null}
                      </div>
                    ))
                  )}
                </PanelBody>
              </Panel>
            );
          })}
        </div>
      </div>
    </>
  );
}
