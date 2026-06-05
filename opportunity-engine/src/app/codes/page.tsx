import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { importCodes } from "./actions";

export const dynamic = "force-dynamic";

export default async function CodesPage({ searchParams }: { searchParams: { q?: string; sys?: string } }) {
  const q = searchParams.q?.trim();
  const sys = searchParams.sys;
  const codes = await prisma.classificationCode
    .findMany({
      where: {
        ...(sys ? { system: sys as never } : {}),
        ...(q ? { OR: [{ code: { contains: q } }, { title: { contains: q, mode: "insensitive" } }] } : {}),
      },
      orderBy: [{ system: "asc" }, { code: "asc" }],
      take: 200,
    })
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
          <form className="mb-3 flex gap-2">
            <input name="q" defaultValue={q} className="input" placeholder="Search code or title" />
            <select name="sys" defaultValue={sys} className="input max-w-[10rem]">
              <option value="">All</option><option>UNSPSC</option><option>NIGP</option><option>GSIN</option><option>NAICS</option>
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
