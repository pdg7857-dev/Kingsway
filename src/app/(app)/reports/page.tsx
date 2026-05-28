import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportGenerator } from "@/components/reports/report-generator";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireCurrentUser();
  const reports = await prisma.report.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 });

  return (
    <>
      <Topbar title="Reports" subtitle="On-demand summaries written by the Kingsway agents" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <ReportGenerator />

        <Panel>
          <PanelHeader title="Recent reports" hint={`${reports.length} saved`} />
          <PanelBody>
            {reports.length === 0 ? (
              <div className="text-sm text-fg-subtle">No reports yet — tap Generate on any type above.</div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {reports.map((r) => (
                  <li key={r.id} className="py-3">
                    <details>
                      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                        <div className="min-w-0">
                          <div className="text-sm text-fg truncate">{r.title}</div>
                          <div className="text-[11px] text-fg-subtle">{r.kind} · {new Date(r.createdAt).toLocaleString()}</div>
                        </div>
                        <Badge tone="muted">open</Badge>
                      </summary>
                      <div className="mt-2 rounded-lg border border-border-subtle bg-bg-raised/30 p-3 text-sm text-fg-muted whitespace-pre-wrap">
                        {r.body}
                      </div>
                    </details>
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
