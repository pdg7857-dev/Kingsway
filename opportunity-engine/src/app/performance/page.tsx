import { prisma } from "@/lib/db";
import { PageHeader, Stat } from "@/components/ui";
import { money } from "@/lib/text";
import { recordOutcome } from "./actions";

export const dynamic = "force-dynamic";

function pct(n: number, d: number) {
  return d === 0 ? "0%" : `${Math.round((n / d) * 100)}%`;
}

export default async function PerformancePage() {
  const [outcomes, opps, clients] = await Promise.all([
    prisma.clientOutcome.findMany({ include: { client: true, opportunity: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.opportunity.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, title: true } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]).catch(() => [[], [], []] as const);

  const surfaced = outcomes.length;
  const bid = outcomes.filter((o) => o.didBid).length;
  const won = outcomes.filter((o) => o.didWin).length;
  const displaced = outcomes.filter((o) => o.incumbentDisplaced).length;
  const valueWon = outcomes.filter((o) => o.didWin).reduce((s, o) => s + (o.awardValue ? Number(o.awardValue) : 0), 0);

  return (
    <>
      <PageHeader title="Performance" sub="Track what you surfaced, what clients bid, and what they won." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Surfaced" value={surfaced} />
        <Stat label="Surfaced → bid" value={pct(bid, surfaced)} hint={`${bid} bids`} />
        <Stat label="Bid → win" value={pct(won, bid)} hint={`${won} wins`} />
        <Stat label="Value won" value={money(valueWon)} />
        <Stat label="Incumbents displaced" value={displaced} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <form action={recordOutcome} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Log an outcome</h2>
          <div>
            <label className="label">Opportunity</label>
            <select name="opportunityId" className="input" required>
              <option value="">Select</option>
              {opps.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Client</label>
            <select name="clientId" className="input" required>
              <option value="">Select</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <label className="flex items-center gap-1"><input type="checkbox" name="didBid" /> bid</label>
            <label className="flex items-center gap-1"><input type="checkbox" name="didWin" /> won</label>
            <label className="flex items-center gap-1"><input type="checkbox" name="incumbentDisplaced" /> displaced incumbent</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Awarded supplier</label><input name="awardedSupplier" className="input" /></div>
            <div><label className="label">Award value</label><input name="awardValue" type="number" className="input" /></div>
          </div>
          <div><label className="label">Notes</label><input name="notes" className="input" /></div>
          <button className="btn-primary w-full">Save outcome</button>
        </form>

        <div className="card overflow-x-auto p-0">
          {outcomes.length === 0 ? <p className="p-5 text-sm text-muted">No outcomes logged yet.</p> : (
            <table className="w-full">
              <thead><tr><th className="th">Opportunity</th><th className="th">Client</th><th className="th">Result</th></tr></thead>
              <tbody>
                {outcomes.map((o) => (
                  <tr key={o.id}>
                    <td className="td">{o.opportunity.title}</td>
                    <td className="td">{o.client.name}</td>
                    <td className="td">
                      {o.didWin ? <span className="pill border-good/40 text-good">won</span> : o.didBid ? <span className="pill border-accent/40 text-accent">bid</span> : <span className="pill">surfaced</span>}
                      {o.incumbentDisplaced && <span className="pill ml-1 border-good/40 text-good">displaced</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
