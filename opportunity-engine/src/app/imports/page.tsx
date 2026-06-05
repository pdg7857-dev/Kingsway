import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { importTenders, importAwards } from "./actions";

export const dynamic = "force-dynamic";

export default async function ImportsPage() {
  const recent = await prisma.auditLog
    .findMany({ where: { action: { in: ["import_tenders", "import_awards"] } }, orderBy: { createdAt: "desc" }, take: 8 })
    .catch(() => []);

  return (
    <>
      <PageHeader
        title="CanadaBuys import"
        sub="Load tender and award exports. Tenders become matched opportunities; awards feed renewal forecasting."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={importTenders} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Tender notices</h2>
          <p className="text-xs text-muted">
            Upload or paste a CanadaBuys tender-notice CSV. Each row becomes an opportunity (title,
            buyer, region, GSIN, closing date) and is matched against your clients. Headers are
            resolved by alias, so confirm against the current export if rows are skipped.
          </p>
          <div><label className="label">CSV file</label><input name="file" type="file" accept=".csv" className="input" /></div>
          <div><label className="label">or paste CSV</label><textarea name="csv" rows={6} className="input font-mono text-xs" /></div>
          <button className="btn-primary w-full">Import tenders and match</button>
        </form>

        <form action={importAwards} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Award notices</h2>
          <p className="text-xs text-muted">
            Upload or paste a CanadaBuys award-notice CSV. Each row becomes an awarded contract with a
            projected re-bid window (estimated from term when the end date is missing).
          </p>
          <div><label className="label">CSV file</label><input name="file" type="file" accept=".csv" className="input" /></div>
          <div><label className="label">or paste CSV</label><textarea name="csv" rows={6} className="input font-mono text-xs" /></div>
          <button className="btn-primary w-full">Import awards and forecast</button>
        </form>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Recent imports</h2>
      {recent.length === 0 ? (
        <div className="card text-sm text-muted">No imports yet.</div>
      ) : (
        <div className="card p-0">
          <table className="w-full">
            <thead><tr><th className="th">When</th><th className="th">Type</th><th className="th">Result</th></tr></thead>
            <tbody>
              {recent.map((l) => (
                <tr key={l.id}>
                  <td className="td">{l.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="td">{l.action === "import_tenders" ? "Tenders" : "Awards"}</td>
                  <td className="td text-muted">{l.detail} imported</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
