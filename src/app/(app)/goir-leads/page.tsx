import Link from "next/link";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { prisma } from "@/lib/prisma";
import { relTime } from "@/lib/utils";
import { INDUSTRY_BY_KEY } from "@/lib/goir/industries";
import { ExternalLink, Gauge, Users, CalendarCheck, FileText, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const tierTone: Record<string, "success" | "accent" | "warn" | "danger" | "muted"> = {
  Elite: "success", Advanced: "success", Strong: "accent",
  Developing: "warn", Emerging: "warn", "At Risk": "danger",
};
const statusTone: Record<string, "warn" | "accent" | "success" | "muted"> = {
  SUBMITTED: "warn", DELIVERED: "accent", VIEWED: "success",
};

export default async function GoirLeadsPage() {
  // The public report site is a separate Vercel deployment.
  const siteUrl = (process.env.NEXT_PUBLIC_GOIR_URL ?? "").replace(/\/$/, "");
  const accessLink = (id: string, code: string | null) =>
    siteUrl && code ? `${siteUrl}/report/${id}?code=${encodeURIComponent(code)}` : undefined;

  let reports: Awaited<ReturnType<typeof prisma.goirReport.findMany>> = [];
  try {
    reports = await prisma.goirReport.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch {
    reports = [];
  }

  const total = reports.length;
  const pending = reports.filter((r) => r.status === "SUBMITTED").length;
  const viewed = reports.filter((r) => r.status === "VIEWED").length;
  const avgIndex = total ? Math.round(reports.reduce((s, r) => s + r.index, 0) / total) : 0;

  return (
    <>
      <div className="border-b border-border-subtle px-4 lg:px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">GOIR Leads</h1>
            <p className="text-sm text-fg-subtle">Requests to fulfil — prep each report, then call/text/email the access code.</p>
          </div>
          {siteUrl ? (
            <Link href={siteUrl} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-bg hover:bg-accent-glow">
              <ExternalLink className="h-3.5 w-3.5" /> Open public report site
            </Link>
          ) : (
            <span className="text-[11px] text-fg-subtle">Set <code className="text-fg-muted">NEXT_PUBLIC_GOIR_URL</code> to enable access links</span>
          )}
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total requests" value={total} icon={<FileText className="h-4 w-4" />} tone="accent" />
          <KpiCard label="Awaiting delivery" value={pending} icon={<Clock className="h-4 w-4" />} tone="warn" />
          <KpiCard label="Viewed" value={viewed} icon={<Users className="h-4 w-4" />} tone="success" />
          <KpiCard label="Avg. Index" value={`${avgIndex}/100`} icon={<Gauge className="h-4 w-4" />} tone="violet" />
        </section>

        <Panel>
          <PanelHeader title="All requests" hint={`${total} captured · newest first · ${pending} awaiting your access code`} />
          <PanelBody>
            {total === 0 ? (
              <div className="py-6 text-sm text-fg-subtle">
                No requests yet. Share {siteUrl ? <Link href={siteUrl} target="_blank" className="text-accent hover:underline">your GOIR site</Link> : "your public GOIR site"} to start collecting leads.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-fg-subtle">
                      <th className="pb-2 pr-3 font-medium">Index</th>
                      <th className="pb-2 pr-3 font-medium">Company</th>
                      <th className="pb-2 pr-3 font-medium">Contact</th>
                      <th className="pb-2 pr-3 font-medium">Industry · Region</th>
                      <th className="pb-2 pr-3 font-medium">Access code</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 pr-3 font-medium">When</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {reports.map((r) => {
                      const link = accessLink(r.id, r.accessCode);
                      return (
                        <tr key={r.id} className="hover:bg-bg-hover/40 align-top">
                          <td className="py-2.5 pr-3">
                            <span className="font-mono text-base font-semibold tabular-nums text-fg">{r.index}</span>
                            <span className="ml-1 text-[10px] text-fg-subtle">{r.tier}</span>
                          </td>
                          <td className="py-2.5 pr-3 font-medium text-fg">{r.companyName}</td>
                          <td className="py-2.5 pr-3 text-fg-muted">
                            <div>{r.contactName ?? "—"}</div>
                            <div className="text-[11px] text-fg-subtle">{r.email}</div>
                            {r.phone ? <div className="text-[11px] text-fg-subtle">{r.phone}</div> : null}
                          </td>
                          <td className="py-2.5 pr-3 text-fg-muted">
                            {INDUSTRY_BY_KEY[r.industry]?.label ?? r.industry}
                            <div className="text-[11px] text-fg-subtle">{r.region}</div>
                          </td>
                          <td className="py-2.5 pr-3">
                            <span className="select-all rounded-md bg-bg-raised px-2 py-1 font-mono text-xs text-accent ring-1 ring-border">{r.accessCode ?? "—"}</span>
                          </td>
                          <td className="py-2.5 pr-3">
                            <div className="flex flex-wrap gap-1">
                              <Badge tone={statusTone[r.status] ?? "muted"}>{(r.status ?? "—").toLowerCase()}</Badge>
                              {r.consultationRequested ? <Badge tone="success">consult</Badge> : null}
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-[11px] text-fg-subtle">{relTime(r.createdAt)}</td>
                          <td className="py-2.5">
                            {link ? (
                              <Link href={link} target="_blank" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                                Open <ExternalLink className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className="text-[11px] text-fg-subtle">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {siteUrl ? (
                  <p className="mt-3 text-[11px] text-fg-subtle">Tip: the access link (Open) already includes the code — copy it into an email/text, or read the code aloud on a call.</p>
                ) : null}
              </div>
            )}
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
