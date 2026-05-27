import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { EventList } from "@/components/dashboard/event-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents, cn } from "@/lib/utils";
import type { DealStage } from "@prisma/client";

export const dynamic = "force-dynamic";

const STAGES: DealStage[] = ["LEAD", "CONTACTED", "QUALIFIED", "TEST_DRIVE", "NEGOTIATION", "WON"];

export default async function LexusDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "lexus");
  if (!snap) return null;
  const leads = await prisma.lead.findMany({ where: { userId: user.id, businessId: snap.business.id }, orderBy: { createdAt: "desc" } });
  const wonCount = await prisma.deal.count({ where: { userId: user.id, businessId: snap.business.id, stage: "WON" } });

  return (
    <>
      <BusinessHeader
        slug="lexus"
        subtitle="Leads · test drives · pipeline · commissions"
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Panel>
          <PanelHeader title="Pipeline" hint={`${snap.deals.length} open · ${wonCount} won this period`} />
          <PanelBody>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
              {STAGES.map((stage) => {
                const items = snap.deals.filter((d) => d.stage === stage);
                const total = items.reduce((s, d) => s + d.valueCents, 0);
                return (
                  <div key={stage} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3 min-h-[160px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{stage.replace("_", " ")}</div>
                      <Badge tone="muted">{items.length}</Badge>
                    </div>
                    <div className="font-mono text-sm mb-2">{fmtCents(total)}</div>
                    <ul className="space-y-2">
                      {items.slice(0, 4).map((d) => (
                        <li key={d.id} className="rounded-md bg-bg-panel/70 ring-1 ring-border p-2">
                          <div className="text-xs text-fg truncate">{d.title}</div>
                          <div className="text-[10px] text-fg-subtle truncate">{d.customer?.name ?? "—"} · {d.probability}%</div>
                          <div className="text-[11px] font-mono">{fmtCents(d.valueCents)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </PanelBody>
        </Panel>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel>
            <PanelHeader title="Hot leads" hint={`${leads.length} total`} />
            <PanelBody>
              {leads.length === 0 ? (
                <div className="text-sm text-fg-subtle">No leads yet.</div>
              ) : (
                <ul className="space-y-2">
                  {leads.slice(0, 6).map((l) => (
                    <li key={l.id} className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
                      <div className="min-w-0">
                        <div className="text-sm text-fg truncate">{l.name}</div>
                        <div className="text-[11px] text-fg-subtle truncate">{l.source.toLowerCase()} · {l.status}</div>
                      </div>
                      <Badge tone={l.score && l.score >= 75 ? "success" : "muted"}>score {l.score ?? "—"}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Action queue" />
            <PanelBody>
              <TaskList tasks={snap.tasks} />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Upcoming events" />
            <PanelBody>
              <EventList events={snap.calendarEvents} />
            </PanelBody>
          </Panel>
        </section>
      </div>
    </>
  );
}
