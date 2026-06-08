import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, Stat } from "@/components/ui";
import { fmtDate, money } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [clients, opps, awards, rebidSoon, recent, spend] = await Promise.all([
    prisma.client.count(),
    prisma.opportunity.count(),
    prisma.awardedContract.count(),
    prisma.awardedContract.count({ where: { status: { in: ["expiring", "rebid_open"] } } }),
    prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { _count: { select: { matches: true } } },
    }),
    prisma.opportunity.aggregate({ _sum: { analysisCostUsd: true }, _count: { analysisCostUsd: true } }),
  ]).catch(() => [0, 0, 0, 0, [] as never[], { _sum: { analysisCostUsd: 0 }, _count: { analysisCostUsd: 0 } }] as const);

  const totalSpend = spend._sum.analysisCostUsd ?? 0;
  const analyses = spend._count.analysisCostUsd ?? 0;

  return (
    <>
      <PageHeader
        title="Command dashboard"
        sub="Drop a solicitation to analyze and match it, or review renewals coming up."
        action={
          <Link href="/documents" className="btn-primary">
            Analyze a document
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Clients" value={clients} />
        <Stat label="Opportunities analyzed" value={opps} />
        <Stat label="Awarded contracts tracked" value={awards} />
        <Stat label="Renewals in window" value={rebidSoon} hint="Expiring or re-bid open" />
        <Stat label="AI spend" value={money(totalSpend)} hint={`${analyses} analyses`} />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">
        Recent opportunities
      </h2>
      {recent.length === 0 ? (
        <div className="card text-sm text-muted">
          Nothing yet. Head to <Link href="/documents" className="text-accent">Analyze</Link> and paste a solicitation.
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Title</th>
                <th className="th">Jurisdiction</th>
                <th className="th">Closing</th>
                <th className="th">Matches</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <td className="td">
                    <Link href={`/documents/${o.id}`} className="text-accent hover:underline">
                      {o.title}
                    </Link>
                  </td>
                  <td className="td">{o.jurisdiction ?? "n/a"}</td>
                  <td className="td">{fmtDate(o.closingDate)}</td>
                  <td className="td">{o._count.matches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
