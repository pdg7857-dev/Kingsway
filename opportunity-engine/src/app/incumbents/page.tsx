import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink } from "@/components/ui";
import { money } from "@/lib/text";
import { abbrsFromText } from "@/lib/jurisdictions";
import { upsertSupplierRelationship } from "@/app/relationships/actions";

export const dynamic = "force-dynamic";

type SP = { buyer?: string; code?: string; jurisdiction?: string; supplier?: string };

function buildWhere(sp: SP) {
  const where: Record<string, unknown> = {};
  if (sp.buyer) where.buyer = { contains: sp.buyer, mode: "insensitive" };
  if (sp.jurisdiction) where.jurisdiction = { contains: sp.jurisdiction, mode: "insensitive" };
  if (sp.code) where.codes = { has: sp.code };
  return where;
}

export default async function IncumbentsPage({ searchParams }: { searchParams: SP }) {
  if (searchParams.supplier) return <SupplierDrilldown supplier={searchParams.supplier} />;

  const where = { ...buildWhere(searchParams), supplier: { not: null } };

  const [suppliers, buyers] = await Promise.all([
    prisma.awardedContract.groupBy({
      by: ["supplier"], where, _sum: { value: true }, _count: { _all: true },
      orderBy: { _sum: { value: "desc" } }, take: 30,
    }).catch(() => []),
    prisma.awardedContract.groupBy({
      by: ["buyer"], where: buildWhere(searchParams), _sum: { value: true }, _count: { _all: true },
      orderBy: { _sum: { value: "desc" } }, take: 15,
    }).catch(() => []),
  ]);

  return (
    <>
      <PageHeader title="Incumbent intelligence" sub="Who is winning the work, by buyer, code and region. Drill into a supplier to see which of your clients could compete." />

      <form className="mb-5 flex flex-wrap gap-2">
        <input name="buyer" defaultValue={searchParams.buyer} className="input max-w-[16rem]" placeholder="Buyer contains..." />
        <input name="jurisdiction" defaultValue={searchParams.jurisdiction} className="input max-w-[12rem]" placeholder="Region contains..." />
        <input name="code" defaultValue={searchParams.code} className="input max-w-[12rem]" placeholder="GSIN / code exact" />
        <button className="btn-ghost">Filter</button>
        {(searchParams.buyer || searchParams.code || searchParams.jurisdiction) && (
          <Link href="/incumbents" className="btn-ghost">Clear</Link>
        )}
      </form>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Top suppliers</h2>
          <div className="card overflow-x-auto p-0">
            {suppliers.length === 0 ? <p className="p-5 text-sm text-muted">No award data yet. Import CanadaBuys or DCC awards.</p> : (
              <table className="w-full">
                <thead><tr><th className="th">Supplier</th><th className="th">Contracts</th><th className="th">Total value</th></tr></thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.supplier}>
                      <td className="td"><Link href={`/incumbents?supplier=${encodeURIComponent(s.supplier ?? "")}`} className="text-accent hover:underline">{s.supplier}</Link></td>
                      <td className="td">{s._count._all}</td>
                      <td className="td">{money(s._sum.value ? Number(s._sum.value) : 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Top buyers</h2>
          <div className="card overflow-x-auto p-0">
            {buyers.length === 0 ? <p className="p-5 text-sm text-muted">No data.</p> : (
              <table className="w-full">
                <thead><tr><th className="th">Buyer</th><th className="th">Value</th></tr></thead>
                <tbody>
                  {buyers.map((b) => (
                    <tr key={b.buyer}>
                      <td className="td"><Link href={`/incumbents?buyer=${encodeURIComponent(b.buyer ?? "")}`} className="text-accent hover:underline">{b.buyer}</Link></td>
                      <td className="td">{money(b._sum.value ? Number(b._sum.value) : 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

async function SupplierDrilldown({ supplier }: { supplier: string }) {
  const [contracts, rel] = await Promise.all([
    prisma.awardedContract.findMany({ where: { supplier }, orderBy: { value: "desc" }, take: 200 }).catch(() => []),
    prisma.supplierRelationship.findUnique({ where: { supplierName: supplier } }).catch(() => null),
  ]);

  const total = contracts.reduce((s, c) => s + (c.value ? Number(c.value) : 0), 0);
  const codeSet = Array.from(new Set(contracts.flatMap((c) => c.codes))).filter(Boolean);
  const jurAbbrs = Array.from(new Set(contracts.flatMap((c) => abbrsFromText(c.jurisdiction))));

  // Clients who could realistically compete: overlap on codes or coverage.
  const competitors = (codeSet.length || jurAbbrs.length)
    ? await prisma.client.findMany({
        where: {
          status: { in: ["active", "prospect"] },
          OR: [
            ...(codeSet.length ? [{ codes: { some: { code: { code: { in: codeSet } } } } }] : []),
            ...(jurAbbrs.length ? [{ jurisdictions: { hasSome: jurAbbrs } }] : []),
          ],
        },
        include: { codes: { include: { code: true } } },
      }).catch(() => [])
    : [];

  return (
    <>
      <div className="mb-2"><BackLink href="/incumbents">← Incumbents</BackLink></div>
      <PageHeader title={supplier} sub={`${contracts.length} contracts on record · ${money(total)} total`} />

      <form action={upsertSupplierRelationship} className="card mb-6 grid gap-3 sm:grid-cols-[10rem_10rem_1fr_auto] sm:items-end">
        <input type="hidden" name="supplierName" value={supplier} />
        <div><label className="label">Relationship</label>
          <select name="status" defaultValue={rel?.status ?? "cold"} className="input">
            <option>cold</option><option>contacted</option><option>talking</option><option>partner</option><option>declined</option>
          </select>
        </div>
        <div><label className="label">Last contact</label><input name="lastContact" type="date" defaultValue={rel?.lastContact ? rel.lastContact.toISOString().slice(0, 10) : ""} className="input" /></div>
        <div><label className="label">Notes</label><input name="notes" defaultValue={rel?.notes ?? ""} className="input" placeholder="e.g. met at trade show, open to subbing" /></div>
        <button className="btn-ghost">Save</button>
      </form>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Clients who could compete</h2>
      {competitors.length === 0 ? (
        <div className="card text-sm text-muted">No clients overlap this supplier&apos;s codes or regions yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Client</th><th className="th">Coverage</th><th className="th">Shared signal</th></tr></thead>
            <tbody>
              {competitors.map((c) => {
                const sharedCodes = c.codes.map((cc) => cc.code.code).filter((x) => codeSet.includes(x));
                const sharedJur = c.jurisdictions.filter((j) => jurAbbrs.includes(j));
                return (
                  <tr key={c.id}>
                    <td className="td"><Link href={`/clients/${c.id}`} className="text-accent hover:underline">{c.name}</Link></td>
                    <td className="td">{c.jurisdictions.join(", ") || "n/a"}</td>
                    <td className="td text-muted">{[sharedCodes.length ? `codes ${sharedCodes.join(", ")}` : "", sharedJur.length ? `regions ${sharedJur.join(", ")}` : ""].filter(Boolean).join("; ") || "broad"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Contracts</h2>
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead><tr><th className="th">Title</th><th className="th">Buyer</th><th className="th">Value</th><th className="th">Ends</th></tr></thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id}>
                <td className="td">{c.title}</td>
                <td className="td">{c.buyer}</td>
                <td className="td">{money(c.value ? Number(c.value) : 0)}</td>
                <td className="td">{c.endDate ? c.endDate.toISOString().slice(0, 10) : "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
