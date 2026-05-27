import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents, cn } from "@/lib/utils";
import type { RepairStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const COLUMNS: RepairStatus[] = ["RECEIVED", "DIAGNOSED", "IN_REPAIR", "AWAITING_PARTS", "READY", "DELIVERED"];

export default async function PhoneRepairDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "phone_repair");
  if (!snap) return null;
  const [tickets, lowParts] = await Promise.all([
    prisma.repairTicket.findMany({ where: { userId: user.id }, orderBy: { receivedAt: "desc" }, include: { customer: true } }),
    prisma.inventoryItem.findMany({ where: { userId: user.id, businessId: snap.business.id, quantity: { lte: prisma.inventoryItem.fields.reorderAt as any } } }).catch(() => snap.inventory.filter(i => i.quantity <= i.reorderAt)),
  ]);
  const lowStock = snap.inventory.filter((i) => i.quantity <= i.reorderAt);

  return (
    <>
      <BusinessHeader
        slug="phone_repair"
        subtitle="Repair tickets · mail-in & pickup · IMEI tracking · buyback margins"
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Panel>
          <PanelHeader title="Repair board" hint={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`} />
          <PanelBody>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
              {COLUMNS.map((col) => {
                const list = tickets.filter((t) => t.status === col);
                return (
                  <div key={col} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3 min-h-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{col.replace("_", " ")}</div>
                      <Badge tone="muted">{list.length}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {list.map((t) => (
                        <li key={t.id} className="rounded-md bg-bg-panel/70 ring-1 ring-border p-2">
                          <div className="text-xs font-medium text-fg">{t.device}</div>
                          <div className="text-[10px] text-fg-subtle truncate">{t.issue}</div>
                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            <span className="text-fg-subtle">{t.channel}</span>
                            <span className="font-mono">{fmtCents(t.quotedCents)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </PanelBody>
        </Panel>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <PanelHeader title="Parts inventory" hint={`${lowStock.length} below reorder`} />
            <PanelBody>
              <ul className="divide-y divide-border-subtle">
                {snap.inventory.map((i) => {
                  const low = i.quantity <= i.reorderAt;
                  return (
                    <li key={i.id} className="py-2 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-fg">{i.name}</div>
                        <div className="text-[11px] text-fg-subtle">{i.sku ?? "—"} · reorder at {i.reorderAt}</div>
                      </div>
                      <div className={cn("font-mono text-sm", low && "text-warn")}>{i.quantity}</div>
                    </li>
                  );
                })}
              </ul>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Shop tasks" />
            <PanelBody>
              <TaskList tasks={snap.tasks} />
            </PanelBody>
          </Panel>
        </section>
      </div>
    </>
  );
}
