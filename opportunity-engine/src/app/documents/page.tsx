import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { fmtDate } from "@/lib/text";
import { analyzeText } from "./actions";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const opps = await prisma.opportunity
    .findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { _count: { select: { matches: true } } } })
    .catch(() => []);

  return (
    <>
      <PageHeader title="Analyze a solicitation" sub="Paste the solicitation text. It is summarized, qualified, coded and matched to your clients." />

      <form action={analyzeText} className="card space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">Title (optional)</label><input name="title" className="input" placeholder="Custodial services, 3 schools" /></div>
          <div><label className="label">Source (platform / URL)</label><input name="source" className="input" placeholder="MERX" /></div>
        </div>
        <div>
          <label className="label">Solicitation text</label>
          <textarea name="text" rows={10} className="input" placeholder="Paste the full solicitation text here. Page markers like [p.3] help the analyzer cite sources." required />
        </div>
        <button className="btn-primary">Analyze and match</button>
        <p className="text-xs text-subtle">Requires ANTHROPIC_API_KEY. PDF upload and OCR are a later phase; paste extracted text for now.</p>
      </form>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Analyzed opportunities</h2>
      {opps.length === 0 ? (
        <div className="card text-sm text-muted">None yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Title</th><th className="th">Jurisdiction</th><th className="th">Closing</th><th className="th">Matches</th></tr></thead>
            <tbody>
              {opps.map((o) => (
                <tr key={o.id}>
                  <td className="td"><Link href={`/documents/${o.id}`} className="text-accent hover:underline">{o.title}</Link></td>
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
