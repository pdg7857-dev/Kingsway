import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const KINDS = [
  { kind: "daily", label: "Daily report", body: "Auto-generated each morning by the Master CEO Agent." },
  { kind: "weekly", label: "Weekly CEO report", body: "Sundays at 5pm: progress, wins, risks, next-week plan." },
  { kind: "monthly", label: "Monthly financial report", body: "P&L by business, cash flow, taxes-to-date." },
  { kind: "business", label: "Business performance", body: "Per-business health and KPIs." },
  { kind: "pipeline", label: "Sales pipeline report", body: "Stage velocity, win rates, top deals." },
  { kind: "content", label: "Content performance", body: "Views, engagement, follow gain by platform." },
  { kind: "retention", label: "Client retention", body: "Coaching churn and renewal pipeline." },
  { kind: "inventory", label: "Inventory report", body: "Low stock, value on hand, turnover." },
];

export default async function ReportsPage() {
  const user = await requireCurrentUser();
  const reports = await prisma.report.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 });

  return (
    <>
      <Topbar title="Reports" subtitle="On-demand summaries powered by the CEO agents" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {KINDS.map((k) => (
            <Panel key={k.kind}>
              <PanelBody>
                <Badge tone="violet" className="mb-2 capitalize">{k.kind}</Badge>
                <div className="text-sm font-medium text-fg">{k.label}</div>
                <div className="text-xs text-fg-muted mt-1">{k.body}</div>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <Panel>
          <PanelHeader title="Recent reports" hint={`${reports.length} saved`} />
          <PanelBody>
            {reports.length === 0 ? (
              <div className="text-sm text-fg-subtle">No reports generated yet — trigger one from any automation or run the CEO agent.</div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {reports.map((r) => (
                  <li key={r.id} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-fg truncate">{r.title}</div>
                      <div className="text-[11px] text-fg-subtle">{r.kind} · {new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                    <Badge tone="muted">view</Badge>
                  </li>
                ))}
              </ul>
            )}
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
