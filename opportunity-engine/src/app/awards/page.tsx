import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { RENEWAL_LEAD_MONTHS } from "@/lib/renewals";
import { addAward, importAwards } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  rebid_open: "border-good/40 text-good",
  expiring: "border-warn/40 text-warn",
  active: "border-border text-muted",
  closed: "border-border text-subtle",
};

export default async function AwardsPage() {
  const [renewals, recent] = await Promise.all([
    prisma.awardedContract.findMany({
      where: { status: { in: ["expiring", "rebid_open"] } },
      orderBy: { rebidWindow: "asc" },
      take: 50,
    }),
    prisma.awardedContract.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]).catch(() => [[], []] as const);

  return (
    <>
      <PageHeader
        title="Awards & renewals"
        sub={`Awarded contracts and projected re-bid windows (lead time ${RENEWAL_LEAD_MONTHS} months).`}
        action={<Link href="/awards/browse" className="btn-primary">Browse all awards</Link>}
      />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-subtle">Upcoming renewals</h2>
      {renewals.length === 0 ? (
        <div className="card text-sm text-muted">No contracts are in their re-bid window yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Contract</th><th className="th">Incumbent</th><th className="th">Ends</th><th className="th">Re-bid window</th><th className="th">Status</th></tr></thead>
            <tbody>
              {renewals.map((a) => (
                <tr key={a.id}>
                  <td className="td"><Link href={`/awards/${a.id}`} className="text-accent hover:underline">{a.title}</Link><div className="text-xs text-subtle">{a.buyer}{a.jurisdiction ? ` · ${a.jurisdiction}` : ""}</div></td>
                  <td className="td">{a.supplier ?? "n/a"}</td>
                  <td className="td">{fmtDate(a.endDate)}{a.endEstimated && <span className="text-subtle"> (est)</span>}</td>
                  <td className="td">{fmtDate(a.rebidWindow)}</td>
                  <td className="td"><span className={`pill ${STATUS_COLOR[a.status]}`}>{a.status.replace(/_/g, " ")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form action={addAward} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Add awarded contract</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Buyer</label><input name="buyer" className="input" required /></div>
            <div><label className="label">Incumbent / supplier</label><input name="supplier" className="input" /></div>
          </div>
          <div><label className="label">Title</label><input name="title" className="input" required /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Jurisdiction</label><input name="jurisdiction" className="input" placeholder="ON" /></div>
            <div><label className="label">Value</label><input name="value" type="number" className="input" /></div>
            <div><label className="label">Option years</label><input name="optionYears" type="number" className="input" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Award date</label><input name="awardDate" type="date" className="input" /></div>
            <div><label className="label">Start date</label><input name="startDate" type="date" className="input" /></div>
            <div><label className="label">End date</label><input name="endDate" type="date" className="input" /></div>
          </div>
          <div><label className="label">Initial term (months, if no end date)</label><input name="initialTermMonths" type="number" className="input" /></div>
          <button className="btn-primary w-full">Add and forecast</button>
        </form>

        <form action={importAwards} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Import awards (CSV)</h2>
          <p className="text-xs text-muted">One per line: <code>buyer,supplier,title,jurisdiction,value,awardDate,startDate,endDate,initialTermMonths,optionYears</code>. Start with CanadaBuys award exports.</p>
          <textarea name="csv" rows={9} className="input font-mono text-xs" placeholder={"City of Toronto,Acme Clean,Custodial 3 schools,ON,480000,2024-03-01,2024-04-01,,36,2"} />
          <button className="btn-primary w-full">Import</button>
        </form>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">All tracked contracts</h2>
      <div className="card overflow-x-auto p-0">
        {recent.length === 0 ? <p className="p-5 text-sm text-muted">None yet.</p> : (
          <table className="w-full">
            <thead><tr><th className="th">Contract</th><th className="th">Value</th><th className="th">Ends</th><th className="th">Re-bid</th></tr></thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id}>
                  <td className="td"><Link href={`/awards/${a.id}`} className="text-accent hover:underline">{a.title}</Link><div className="text-xs text-subtle">{a.buyer}</div></td>
                  <td className="td">{money(a.value ? Number(a.value) : null, a.currency)}</td>
                  <td className="td">{fmtDate(a.endDate)}{a.endEstimated && <span className="text-subtle"> (est)</span>}</td>
                  <td className="td">{fmtDate(a.rebidWindow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
