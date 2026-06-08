import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { upsertSupplierRelationship } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  partner: "border-good/40 text-good", talking: "border-accent/40 text-accent",
  contacted: "border-warn/40 text-warn", declined: "border-bad/40 text-bad", cold: "",
};

export default async function RelationshipsPage() {
  const rels = await prisma.supplierRelationship.findMany({ orderBy: { updatedAt: "desc" } }).catch(() => []);

  // Contract footprint for each tracked supplier.
  const footprint = await Promise.all(
    rels.map((r) =>
      prisma.awardedContract.aggregate({ where: { supplier: r.supplierName }, _sum: { value: true }, _count: { _all: true } }).catch(() => ({ _sum: { value: null }, _count: { _all: 0 } })),
    ),
  );

  // Top suppliers by award value not yet tracked, to start outreach.
  const tracked = new Set(rels.map((r) => r.supplierName));
  const top = (await prisma.awardedContract
    .groupBy({ by: ["supplier"], where: { supplier: { not: null } }, _sum: { value: true }, _count: { _all: true }, orderBy: { _sum: { value: "desc" } }, take: 40 })
    .catch(() => []))
    .filter((s) => s.supplier && !tracked.has(s.supplier))
    .slice(0, 12);

  return (
    <>
      <PageHeader title="Relationships" sub="Track outreach to suppliers actively winning government work." />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Tracked suppliers</h2>
      {rels.length === 0 ? (
        <div className="card text-sm text-muted">None yet. Start one below, or from any supplier on the Incumbents page.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Supplier</th><th className="th">Status</th><th className="th">Last contact</th><th className="th">Contracts</th><th className="th">Notes</th></tr></thead>
            <tbody>
              {rels.map((r, i) => (
                <tr key={r.id}>
                  <td className="td"><Link href={`/incumbents?supplier=${encodeURIComponent(r.supplierName)}`} className="text-accent hover:underline">{r.supplierName}</Link></td>
                  <td className="td"><span className={`pill ${STATUS_COLOR[r.status]}`}>{r.status}</span></td>
                  <td className="td">{fmtDate(r.lastContact)}</td>
                  <td className="td">{footprint[i]._count._all} · {money(footprint[i]._sum.value ? Number(footprint[i]._sum.value) : 0)}</td>
                  <td className="td text-muted">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form action={upsertSupplierRelationship} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Add / update a supplier</h2>
          <div><label className="label">Supplier name (exact)</label><input name="supplierName" className="input" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Status</label><select name="status" className="input"><option>cold</option><option>contacted</option><option>talking</option><option>partner</option><option>declined</option></select></div>
            <div><label className="label">Last contact</label><input name="lastContact" type="date" className="input" /></div>
          </div>
          <div><label className="label">Notes</label><textarea name="notes" rows={2} className="input" /></div>
          <button className="btn-primary w-full">Save</button>
        </form>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Top suppliers to consider</h2>
          <div className="card overflow-x-auto p-0">
            {top.length === 0 ? <p className="p-5 text-sm text-muted">Import awards to populate this.</p> : (
              <table className="w-full">
                <thead><tr><th className="th">Supplier</th><th className="th">Awards</th><th className="th">Value</th></tr></thead>
                <tbody>
                  {top.map((s) => (
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
      </div>
    </>
  );
}
