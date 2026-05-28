import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { requireCurrentUser } from "@/lib/auth";
import { getAIUsage } from "@/lib/data/ai-usage";
import { fmtCentsPrecise, fmtCompact, cn } from "@/lib/utils";
import { AlertTriangle, Coins, Cpu, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIUsagePage() {
  const user = await requireCurrentUser();
  const u = await getAIUsage(user.id);
  const aiOn = !!process.env.ANTHROPIC_API_KEY;

  return (
    <>
      <Topbar title="AI Usage & Spend" subtitle="Token usage, monthly spend, and low-credit warnings" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        {u.low && (
          <div className="panel ring-1 ring-warn/50 p-4 flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-warn-soft text-warn shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-warn">AI budget running low</div>
              <div className="text-xs text-fg-muted">
                You've used {u.pctUsed.toFixed(0)}% of this month's {fmtCentsPrecise(u.budgetCents)} budget. Top up credits at console.anthropic.com or raise your budget in Settings.
              </div>
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Spend · this month" value={fmtCentsPrecise(u.monthSpendCents)} hint={`of ${fmtCentsPrecise(u.budgetCents)} budget`} tone={u.low ? "danger" : "accent"} icon={<Coins className="h-4 w-4" />} />
          <KpiCard label="Calls · this month" value={u.monthCalls} icon={<Activity className="h-4 w-4" />} />
          <KpiCard label="Tokens · this month" value={fmtCompact(u.monthTokens)} icon={<Cpu className="h-4 w-4" />} />
          <KpiCard label="All-time spend" value={fmtCentsPrecise(u.allSpendCents)} hint={`${u.allCalls} calls`} />
        </section>

        <Panel>
          <PanelHeader title="Monthly budget" hint={aiOn ? "Live tracking" : "AI key not set — no usage yet"} action={<Badge tone={u.low ? "warn" : "success"}>{u.pctUsed.toFixed(0)}% used</Badge>} />
          <PanelBody>
            <Progress value={u.pctUsed} max={100} tone={u.pctUsed >= 100 ? "danger" : u.pctUsed >= 80 ? "warn" : "success"} className="h-2.5" />
            <div className="mt-2 flex justify-between text-xs text-fg-subtle">
              <span>{fmtCentsPrecise(u.monthSpendCents)} spent</span>
              <span>{fmtCentsPrecise(Math.max(0, u.budgetCents - u.monthSpendCents))} remaining</span>
            </div>
            <p className="mt-3 text-[11px] text-fg-subtle">
              Spend is estimated from token counts at list prices and is a guide, not a billing source of truth. Set your budget in Settings. The dashboard will warn you at 80%.
            </p>
          </PanelBody>
        </Panel>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <PanelHeader title="Spend by feature · this month" />
            <PanelBody>
              {u.byFeature.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">No AI usage recorded yet.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {u.byFeature.map((f) => (
                    <li key={f.feature} className="py-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-fg capitalize">{f.feature}</div>
                        <div className="text-[11px] text-fg-subtle">{f.calls} calls</div>
                      </div>
                      <div className="font-mono text-sm">{fmtCentsPrecise(f.costCents)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Recent calls" />
            <PanelBody>
              {u.recent.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">Nothing yet.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {u.recent.map((r) => (
                    <li key={r.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-fg truncate capitalize">{r.feature ?? "call"} <span className="text-fg-subtle">· {r.agent ?? ""}</span></div>
                        <div className="text-[11px] text-fg-subtle">{new Date(r.createdAt).toLocaleString()} · {r.inputTokens + r.outputTokens} tok</div>
                      </div>
                      <div className="font-mono text-xs">{fmtCentsPrecise(r.costCents)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </section>
      </div>
    </>
  );
}
