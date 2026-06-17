import Link from "next/link";
import { Panel, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge, MiniScore } from "@/components/oi/ui";
import { ProspectToolbar } from "@/components/oi/prospect-toolbar";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents } from "@/lib/utils";
import { fmtDollars } from "@/lib/oi/constants";
import { ArrowUpRight, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ProspectsPage({ searchParams }: { searchParams: SP }) {
  const user = await requireCurrentUser();

  const tier = one(searchParams.tier);
  const industry = one(searchParams.industry);
  const region = one(searchParams.region);
  const q = one(searchParams.q);
  const gov = one(searchParams.gov) === "1";
  const minScore = one(searchParams.minScore);

  const where: any = { userId: user.id };
  if (tier) where.tier = tier;
  if (industry) where.industry = industry;
  if (region) where.region = { contains: region, mode: "insensitive" };
  if (q) where.companyName = { contains: q, mode: "insensitive" };
  if (gov) where.hasWonGov = true;
  if (minScore) where.score = { gte: Number(minScore) };

  const [prospects, industries] = await Promise.all([
    prisma.prospect.findMany({ where, orderBy: [{ score: "desc" }, { updatedAt: "desc" }], take: 500 }),
    prisma.prospect.findMany({ where: { userId: user.id }, select: { industry: true }, distinct: ["industry"] }),
  ]);

  const industryOpts = industries.map((i) => i.industry).filter(Boolean) as string[];

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Prospects</h1>
          <p className="text-xs text-fg-subtle mt-0.5">{prospects.length} shown · ranked by GOII Index™</p>
        </div>
      </div>

      <ProspectToolbar industries={industryOpts} current={{ tier, industry, region, q, gov, minScore }} />

      <Panel>
        <PanelBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-fg-subtle border-b border-border-subtle">
                  <th className="px-4 py-2.5 font-medium">Index</th>
                  <th className="px-4 py-2.5 font-medium">Company</th>
                  <th className="px-4 py-2.5 font-medium hidden md:table-cell">Industry</th>
                  <th className="px-4 py-2.5 font-medium hidden lg:table-cell">Region</th>
                  <th className="px-4 py-2.5 font-medium hidden lg:table-cell">Awards</th>
                  <th className="px-4 py-2.5 font-medium hidden xl:table-cell">Waste / yr</th>
                  <th className="px-4 py-2.5 font-medium">Tier</th>
                  <th className="px-4 py-2.5 font-medium hidden md:table-cell text-right">Est. LTV</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle/60 hover:bg-bg-hover/40">
                    <td className="px-4 py-2.5"><MiniScore score={p.score} /></td>
                    <td className="px-4 py-2.5">
                      <Link href={`/oi/prospects/${p.id}`} className="group inline-flex items-center gap-1 text-fg hover:text-accent">
                        <span className="truncate max-w-[200px]">{p.companyName}</span>
                        {(p.score ?? 0) >= 80 && <Flame className="h-3 w-3 text-danger" />}
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      </Link>
                      {p.contactName && <div className="text-[11px] text-fg-subtle truncate max-w-[200px]">{p.contactName}</div>}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell text-fg-muted">{p.industry ?? "—"}</td>
                    <td className="px-4 py-2.5 hidden lg:table-cell text-fg-muted">{p.region ?? "—"}</td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      {p.hasWonGov ? <Badge tone="success">{p.awardCount} · {fmtDollars(p.totalWonDollars)}</Badge> : <span className="text-fg-subtle">—</span>}
                    </td>
                    <td className="px-4 py-2.5 hidden xl:table-cell font-mono text-warn">{p.opportunityWasteCents ? fmtCents(p.opportunityWasteCents) : "—"}</td>
                    <td className="px-4 py-2.5"><TierBadge tier={p.tier} /></td>
                    <td className="px-4 py-2.5 hidden md:table-cell text-right font-mono text-success">{p.estLtvCents ? fmtCents(p.estLtvCents) : "—"}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Link href={`/oi/prospects/${p.id}`} className="text-xs text-accent">Open</Link>
                    </td>
                  </tr>
                ))}
                {prospects.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-fg-subtle">No prospects match. Add one or import a list above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}
