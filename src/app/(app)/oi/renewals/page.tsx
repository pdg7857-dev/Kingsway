import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RenewalActions } from "@/components/oi/renewal-actions";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { relTime } from "@/lib/utils";
import { fmtDollars, ALERT_WINDOW_META, ALERT_WINDOWS, type AlertWindow } from "@/lib/oi/constants";
import { CalendarClock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RenewalsPage() {
  const user = await requireCurrentUser();
  const renewals = await prisma.renewal.findMany({
    where: { userId: user.id },
    include: { buyer: true, incumbent: true },
    orderBy: { likelyRebidStart: "asc" },
  });

  const byWindow = new Map<string, typeof renewals>();
  for (const r of renewals) {
    const key = r.alertWindow ?? "FUTURE";
    if (!byWindow.has(key)) byWindow.set(key, []);
    byWindow.get(key)!.push(r);
  }
  const order = [...ALERT_WINDOWS, "FUTURE"];

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Renewal Intelligence</h1>
        <p className="text-xs text-fg-subtle mt-0.5">Predict opportunities before they post · {renewals.length} contracts on watch</p>
      </div>

      {renewals.length === 0 ? (
        <Panel><PanelBody><div className="text-sm text-fg-subtle">No renewals yet. Ingest awards with end dates, or add a contract via the API to start predicting rebid windows.</div></PanelBody></Panel>
      ) : (
        order.filter((w) => byWindow.has(w)).map((w) => {
          const items = byWindow.get(w)!;
          const meta = w in ALERT_WINDOW_META ? ALERT_WINDOW_META[w as AlertWindow] : { label: "Beyond 12 months", tone: "muted" };
          return (
            <Panel key={w}>
              <PanelHeader
                title={<span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-fg-subtle" /> {meta.label} window</span>}
                hint={`${items.length} contract(s)`}
              />
              <PanelBody className="p-0">
                <ul className="divide-y divide-border-subtle">
                  {items.map((r) => (
                    <li key={r.id} className="px-5 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm text-fg flex items-center gap-2">{r.title} <Badge tone={(meta.tone as any) ?? "muted"}>{meta.label}</Badge></div>
                          <div className="text-[11px] text-fg-subtle truncate">
                            {r.buyer?.organization ?? r.agency ?? "—"}
                            {r.category ? ` · ${r.category}` : ""}
                            {r.region ? ` · ${r.region}` : ""}
                            {r.incumbent ? ` · incumbent: ${r.incumbent.companyName}` : ""}
                          </div>
                          <div className="text-[11px] text-fg-subtle mt-0.5">
                            Ends {r.endDate ? new Date(r.endDate).toLocaleDateString() : "—"} · rebid {relTime(r.likelyRebidStart)} · {r.likelyPlatform ?? "platform tbd"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {r.expectedValueDollars != null && <div className="font-mono text-sm">{fmtDollars(r.expectedValueDollars)}</div>}
                          {r.incumbentAdvantage != null && <div className="text-[10px] text-fg-subtle">incumbent adv. {r.incumbentAdvantage}%</div>}
                        </div>
                      </div>
                      {(r.opportunityBrief || r.monitoringPlan) && (
                        <div className="mt-2 grid md:grid-cols-2 gap-2">
                          {r.opportunityBrief && <div className="rounded-md bg-bg-raised/40 ring-1 ring-border p-2 text-xs text-fg-muted whitespace-pre-wrap"><div className="text-[10px] uppercase text-fg-subtle mb-1">Opportunity brief</div>{r.opportunityBrief}</div>}
                          {r.monitoringPlan && <div className="rounded-md bg-bg-raised/40 ring-1 ring-border p-2 text-xs text-fg-muted whitespace-pre-wrap"><div className="text-[10px] uppercase text-fg-subtle mb-1">Monitoring plan</div>{r.monitoringPlan}</div>}
                        </div>
                      )}
                      <div className="mt-2"><RenewalActions id={r.id} hasBrief={!!r.opportunityBrief} /></div>
                    </li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          );
        })
      )}
    </div>
  );
}
