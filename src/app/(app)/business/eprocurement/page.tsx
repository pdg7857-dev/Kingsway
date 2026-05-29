import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { ProcurementClients } from "@/components/procurement/client-actions";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents, relTime, cn } from "@/lib/utils";
import type { ProcurementStatus } from "@prisma/client";
import { Building2, FileText, Repeat, Target } from "lucide-react";

export const dynamic = "force-dynamic";

const PIPELINE: ProcurementStatus[] = ["LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON"];
const ACTIVE_STATUSES: ProcurementStatus[] = ["WON", "ACTIVE"];

export default async function EProcurementDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "eprocurement");
  if (!snap) return null;

  const [clients, contracts] = await Promise.all([
    prisma.procurementClient.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
    prisma.govContract.findMany({ where: { userId: user.id }, orderBy: { responseDueAt: "asc" }, include: { client: true } }),
  ]);

  const activeClients = clients.filter((c) => ACTIVE_STATUSES.includes(c.status));
  const lostClients = clients.filter((c) => c.status === "LOST");
  const signedClients = clients.filter((c) => c.signedAt);
  const mrrCents = activeClients.reduce((s, c) => s + c.monthlyFeeCents, 0);
  const decided = signedClients.length + lostClients.length;
  const winRate = decided ? (signedClients.length / decided) * 100 : 0;
  const avgTouches = signedClients.length
    ? signedClients.reduce((s, c) => s + (c.touchesToSign ?? c.touchCount), 0) / signedClients.length
    : 0;

  // Target industry = the industry with the most active/pipeline clients.
  const industryCount = new Map<string, number>();
  clients.forEach((c) => { if (c.industry) industryCount.set(c.industry, (industryCount.get(c.industry) ?? 0) + 1); });
  const targetIndustry = [...industryCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <>
      <BusinessHeader
        slug="eprocurement"
        subtitle={`Target industry: ${targetIndustry} · ${activeClients.length} retainers · MRR ${fmtCents(mrrCents)}`}
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="panel p-4 ring-1 ring-success/40">
            <div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-fg-subtle">MRR</span><Repeat className="h-4 w-4 text-success" /></div>
            <div className="mt-2 stat-value text-success">{fmtCents(mrrCents)}</div>
            <div className="mt-1 text-xs text-fg-subtle">{activeClients.length} × retainers</div>
          </div>
          <div className="panel p-4 ring-1 ring-border">
            <div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-fg-subtle">Win rate</span><Target className="h-4 w-4 text-fg-muted" /></div>
            <div className="mt-2 stat-value">{winRate.toFixed(0)}%</div>
            <div className="mt-1 text-xs text-fg-subtle">{signedClients.length} won · {lostClients.length} lost</div>
          </div>
          <div className="panel p-4 ring-1 ring-border">
            <div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-fg-subtle">Avg touches to sign</span><Building2 className="h-4 w-4 text-fg-muted" /></div>
            <div className="mt-2 stat-value">{avgTouches ? avgTouches.toFixed(1) : "—"}</div>
            <div className="mt-1 text-xs text-fg-subtle">across signed clients</div>
          </div>
          <div className="panel p-4 ring-1 ring-accent/40">
            <div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-widest text-fg-subtle">Contracts tracked</span><FileText className="h-4 w-4 text-accent" /></div>
            <div className="mt-2 stat-value">{contracts.length}</div>
            <div className="mt-1 text-xs text-fg-subtle">{contracts.filter((c) => c.summary).length} summarized</div>
          </div>
        </section>

        <Panel>
          <PanelHeader title="Client pipeline" hint="Touch count shown per card · usually several touches to sign" />
          <PanelBody>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
              {PIPELINE.map((stage) => {
                const items = clients.filter((c) => c.status === stage);
                const value = items.reduce((s, c) => s + c.monthlyFeeCents, 0);
                return (
                  <div key={stage} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3 min-h-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{stage}</div>
                      <Badge tone="muted">{items.length}</Badge>
                    </div>
                    <div className="font-mono text-xs text-fg-subtle mb-2">{fmtCents(value)}/mo</div>
                    <ul className="space-y-2">
                      {items.map((c) => (
                        <li key={c.id} className="rounded-md bg-bg-panel/70 ring-1 ring-border p-2">
                          <div className="text-xs font-medium text-fg truncate">{c.company ?? c.name}</div>
                          <div className="text-[10px] text-fg-subtle truncate">{c.industry ?? "—"}</div>
                          <div className="mt-1 flex items-center justify-between text-[10px]">
                            <span className="text-fg-subtle">{c.touchCount} touches</span>
                            <span className="font-mono">{fmtCents(c.monthlyFeeCents)}</span>
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

        <Panel>
          <PanelHeader title="All clients" hint="Log touches and move stage inline" />
          <PanelBody>
            <ProcurementClients
              clients={clients.map((c) => ({
                id: c.id,
                name: c.name,
                company: c.company,
                industry: c.industry,
                status: c.status,
                touchCount: c.touchCount,
                monthlyFeeCents: c.monthlyFeeCents,
              }))}
            />
          </PanelBody>
        </Panel>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-2">
            <PanelHeader title="Gov contract feed" hint="Summarize each before a client commits" />
            <PanelBody>
              {contracts.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">No contracts tracked yet.</div>
              ) : (
                <ul className="space-y-2">
                  {contracts.map((c) => (
                    <li key={c.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-fg">{c.title}</div>
                          <div className="text-[11px] text-fg-subtle truncate">
                            {c.agency ?? "—"} · {c.industry ?? "—"}
                            {c.solicitationNumber ? ` · ${c.solicitationNumber}` : ""}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {c.valueCents != null ? <div className="font-mono text-sm">{fmtCents(c.valueCents)}</div> : null}
                          <Badge tone={c.status === "SUMMARIZED" || c.status === "SENT" ? "accent" : c.status === "PURCHASED" ? "success" : "muted"}>
                            {c.status.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                      {c.responseDueAt ? (
                        <div className="mt-1 text-[11px] text-warn">Response due {relTime(c.responseDueAt)}</div>
                      ) : null}
                      {c.summary ? (
                        <div className="mt-2 rounded-md bg-bg-panel/60 ring-1 ring-border p-2 text-xs text-fg-muted whitespace-pre-wrap">{c.summary}</div>
                      ) : (
                        <div className="mt-1 text-[11px] text-fg-subtle">No summary yet — use the eProcurement agent or POST /api/procurement/contracts/{"{id}"}/summarize</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          <div className="space-y-4">
            <Panel>
              <PanelHeader title="Active retainers" hint={`${fmtCents(mrrCents)}/mo`} />
              <PanelBody>
                {activeClients.length === 0 ? (
                  <div className="text-sm text-fg-subtle">No active clients yet.</div>
                ) : (
                  <ul className="divide-y divide-border-subtle">
                    {activeClients.map((c) => (
                      <li key={c.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm text-fg truncate">{c.company ?? c.name}</div>
                          <div className="text-[11px] text-fg-subtle truncate">{c.industry ?? "—"} · renews {relTime(c.renewalAt)}</div>
                        </div>
                        <div className="font-mono text-sm">{fmtCents(c.monthlyFeeCents)}</div>
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
          </div>
        </section>
      </div>
    </>
  );
}
