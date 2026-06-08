import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { fmtDate } from "@/lib/text";
import { analyzeText, rematchAll } from "./actions";
import { UploadAnalyzer } from "@/components/upload-analyzer";

export const dynamic = "force-dynamic";

const PURSUIT_COLOR: Record<string, string> = {
  won: "border-good/40 text-good", lost: "border-bad/40 text-bad",
  bidding: "border-accent/40 text-accent", sent: "border-accent/40 text-accent",
};

export default async function DocumentsPage({ searchParams }: { searchParams: { review?: string; pursuit?: string } }) {
  const where = {
    ...(searchParams.review ? { needsReview: true } : {}),
    ...(searchParams.pursuit ? { pursuit: searchParams.pursuit as never } : {}),
  };
  const [opps, reviewCount] = await Promise.all([
    prisma.opportunity.findMany({ where, orderBy: { createdAt: "desc" }, take: 50, include: { _count: { select: { matches: true } } } }).catch(() => []),
    prisma.opportunity.count({ where: { needsReview: true } }).catch(() => 0),
  ]);

  return (
    <>
      <PageHeader
        title="Analyze a solicitation"
        sub="Upload the solicitation file or paste its text. It is summarized, qualified, coded and matched to your clients."
        action={
          <form action={rematchAll}>
            <button className="btn-ghost">Re-match all against clients</button>
          </form>
        }
      />

      <UploadAnalyzer />

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

      <div className="mb-3 mt-8 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">Analyzed opportunities</h2>
        <div className="flex gap-2 text-xs">
          <Link href="/documents" className={`pill ${!searchParams.review && !searchParams.pursuit ? "border-accent/40 text-accent" : ""}`}>All</Link>
          <Link href="/documents?review=1" className={`pill ${searchParams.review ? "border-warn/40 text-warn" : ""}`}>Needs review ({reviewCount})</Link>
        </div>
      </div>
      {opps.length === 0 ? (
        <div className="card text-sm text-muted">None yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Title</th><th className="th">Status</th><th className="th">Jurisdiction</th><th className="th">Closing</th><th className="th">Matches</th></tr></thead>
            <tbody>
              {opps.map((o) => (
                <tr key={o.id}>
                  <td className="td"><Link href={`/documents/${o.id}`} className="text-accent hover:underline">{o.title}</Link></td>
                  <td className="td">
                    <span className={`pill ${PURSUIT_COLOR[o.pursuit] ?? ""}`}>{o.pursuit}</span>
                    {o.needsReview && <span className="pill ml-1 border-warn/40 text-warn">review</span>}
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
