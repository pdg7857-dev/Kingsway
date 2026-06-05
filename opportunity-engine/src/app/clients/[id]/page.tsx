import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink, RecBadge } from "@/components/ui";
import { money } from "@/lib/text";
import { attachClientCode, attachClientKeyword } from "../actions";

export const dynamic = "force-dynamic";

export default async function ClientDetail({ params }: { params: { id: string } }) {
  const c = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      codes: { include: { code: true } },
      keywords: { include: { keyword: true } },
      matches: { include: { opportunity: true }, orderBy: { score: "desc" }, take: 20 },
    },
  });
  if (!c) notFound();

  return (
    <>
      <div className="mb-2"><BackLink href="/clients">← Clients</BackLink></div>
      <PageHeader
        title={c.name}
        sub={`${c.jurisdictions.join(", ") || "no coverage set"} · ${c.planTier ?? "no plan"} · value ${money(c.valueMin ? Number(c.valueMin) : null)} to ${money(c.valueMax ? Number(c.valueMax) : null)}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-fg">Classification codes</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {c.codes.length === 0 && <span className="text-sm text-muted">None yet.</span>}
            {c.codes.map((cc) => (
              <span key={cc.id} className="pill">{cc.code.system} {cc.code.code}</span>
            ))}
          </div>
          <form action={attachClientCode} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="clientId" value={c.id} />
            <div>
              <label className="label">System</label>
              <select name="system" className="input">
                <option>UNSPSC</option><option>NIGP</option><option>GSIN</option><option>NAICS</option>
              </select>
            </div>
            <div><label className="label">Code</label><input name="code" className="input" placeholder="72101500" /></div>
            <button className="btn-ghost">Add code</button>
          </form>
        </div>

        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-fg">Keywords</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {c.keywords.length === 0 && <span className="text-sm text-muted">None yet.</span>}
            {c.keywords.map((ck) => (
              <span key={ck.id} className={`pill ${ck.exclude ? "border-bad/40 text-bad" : ""}`}>
                {ck.exclude ? "exclude: " : ""}{ck.keyword.term}
              </span>
            ))}
          </div>
          <form action={attachClientKeyword} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="clientId" value={c.id} />
            <div><label className="label">Term</label><input name="term" className="input" placeholder="custodial services" /></div>
            <label className="flex items-center gap-1 text-xs text-muted"><input type="checkbox" name="exclude" /> exclude</label>
            <button className="btn-ghost">Add keyword</button>
          </form>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Matched opportunities</h2>
      {c.matches.length === 0 ? (
        <div className="card text-sm text-muted">No matches yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Opportunity</th><th className="th">Fit</th><th className="th">Why</th></tr></thead>
            <tbody>
              {c.matches.map((m) => (
                <tr key={m.id}>
                  <td className="td">
                    <Link href={`/documents/${m.opportunityId}`} className="text-accent hover:underline">{m.opportunity.title}</Link>
                  </td>
                  <td className="td"><RecBadge rec={m.recommendation} score={m.score} /></td>
                  <td className="td text-muted">{m.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
