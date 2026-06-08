import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/ui";
import { INDUSTRY_FILTERS, getIndustryFilter } from "@/lib/industry-filter";
import { importCodes } from "./actions";

export const dynamic = "force-dynamic";

export default async function CodesPage({ searchParams }: { searchParams: { q?: string; sys?: string; ind?: string } }) {
  const q = searchParams.q?.trim();
  const sys = searchParams.sys;
  const ind = getIndustryFilter(searchParams.ind);

  const where: Prisma.ClassificationCodeWhereInput = {};
  if (ind) {
    // UNSPSC is hierarchical, so segment prefixes are an exact industry filter.
    where.system = "UNSPSC";
    where.OR = ind.unspscSegments.map((seg) => ({ code: { startsWith: seg } }));
  } else if (sys) {
    where.system = sys as Prisma.EnumCodeSystemFilter["equals"];
  }
  if (q) {
    const qOr: Prisma.ClassificationCodeWhereInput[] = [{ code: { contains: q } }, { title: { contains: q, mode: "insensitive" } }];
    if (where.OR) { where.AND = [{ OR: where.OR }, { OR: qOr }]; delete where.OR; }
    else where.OR = qOr;
  }

  const codes = await prisma.classificationCode
    .findMany({ where, orderBy: [{ system: "asc" }, { code: "asc" }], take: 200 })
    .catch(() => []);

  const counts = await prisma.classificationCode.groupBy({ by: ["system"], _count: true }).catch(() => []);

  return (
    <>
      <PageHeader title="Classification codes" sub="UNSPSC, NIGP, GSIN, NAICS. Cross-referenced against client profiles when matching." />

      <div className="mb-4 flex flex-wrap gap-2">
        {counts.map((c) => (
          <span key={c.system} className="pill">{c.system}: {c._count}</span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <form className="mb-3 flex flex-wrap gap-2">
            <input name="q" defaultValue={q} className="input min-w-[10rem] flex-1" placeholder="Search code or title" />
            <select name="ind" defaultValue={searchParams.ind} className="input max-w-[12rem]">
              <option value="">Industry (UNSPSC)</option>
              {INDUSTRY_FILTERS.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </select>
            <select name="sys" defaultValue={sys} className="input max-w-[8rem]">
              <option value="">All systems</option><option>UNSPSC</option><option>NIGP</option><option>GSIN</option><option>NAICS</option>
            </select>
            <button className="btn-ghost">Search</button>
          </form>
          <div className="card overflow-x-auto p-0">
            {codes.length === 0 ? (
              <p className="p-5 text-sm text-muted">No codes. Import some on the right.</p>
            ) : (
              <table className="w-full">
                <thead><tr><th className="th">System</th><th className="th">Code</th><th className="th">Title</th></tr></thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id}><td className="td">{c.system}</td><td className="td font-mono">{c.code}</td><td className="td">{c.title}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <form action={importCodes} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Import codes (CSV)</h2>
          <p className="text-xs text-muted">One per line: <code>system,code,title[,parentCode]</code>. System is one of UNSPSC, NIGP, GSIN, NAICS.</p>
          <textarea name="csv" rows={10} className="input font-mono text-xs" placeholder={"UNSPSC,72101500,Building maintenance\nGSIN,J999,Janitorial services"} />
          <button className="btn-primary w-full">Import</button>
        </form>
      </div>
    </>
  );
}
