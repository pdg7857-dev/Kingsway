import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents, relTime, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FitnessDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "fitness");
  if (!snap) return null;
  const [clients, checkIns] = await Promise.all([
    prisma.fitnessClient.findMany({ where: { userId: user.id }, orderBy: { renewalAt: "asc" } }),
    prisma.fitnessCheckIn.findMany({ where: { client: { userId: user.id } }, orderBy: { date: "desc" }, take: 10, include: { client: true } }),
  ]);

  const active = clients.filter((c) => c.status === "ACTIVE");
  const churned = clients.filter((c) => c.status === "CHURNED");
  const mrr = active.reduce((s, c) => s + c.mrrCents, 0);
  const churnRate = clients.length ? (churned.length / clients.length) * 100 : 0;

  return (
    <>
      <BusinessHeader
        slug="fitness"
        subtitle={`${active.length} active athletes · MRR ${fmtCents(mrr)}`}
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Clients" hint={`${active.length} active · churn ${churnRate.toFixed(0)}%`} />
          <PanelBody>
            <ul className="divide-y divide-border-subtle">
              {clients.map((c) => {
                const overdue = c.lastCheckInAt && (Date.now() - new Date(c.lastCheckInAt).getTime()) > 7 * 86400000;
                return (
                  <li key={c.id} className="py-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-fg">{c.name}</div>
                        <Badge tone={c.status === "ACTIVE" ? "success" : c.status === "PAUSED" ? "warn" : "muted"}>{c.status}</Badge>
                        {overdue && <Badge tone="danger">check-in overdue</Badge>}
                      </div>
                      <div className="text-[11px] text-fg-subtle">
                        {c.goal ?? "—"} · {c.programName ?? "—"} · last {relTime(c.lastCheckInAt)} · renews {relTime(c.renewalAt)}
                      </div>
                    </div>
                    <div className="font-mono text-sm">{fmtCents(c.mrrCents)}/mo</div>
                  </li>
                );
              })}
            </ul>
          </PanelBody>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Coach action queue" />
            <PanelBody>
              <TaskList tasks={snap.tasks} />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Recent check-ins" />
            <PanelBody>
              {checkIns.length === 0 ? (
                <div className="text-sm text-fg-subtle">No check-ins yet.</div>
              ) : (
                <ul className="space-y-2">
                  {checkIns.map((ci) => (
                    <li key={ci.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">{ci.client.name}</div>
                        <div className="text-[11px] text-fg-subtle">{new Date(ci.date).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-1 grid grid-cols-3 gap-1 text-[11px] text-fg-muted">
                        <div>wt {ci.weightKg?.toFixed(1) ?? "—"}kg</div>
                        <div>bf {ci.bodyFatPct?.toFixed(1) ?? "—"}%</div>
                        <div>energy {ci.energy ?? "—"}/10</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </>
  );
}
