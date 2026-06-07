import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { createClient, importClients } from "./actions";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client
    .findMany({ orderBy: { name: "asc" }, include: { _count: { select: { codes: true, keywords: true } } } })
    .catch(() => []);

  return (
    <>
      <PageHeader title="Clients" sub="Profiles drive matching: codes, keywords, coverage and value range." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-x-auto p-0">
          {clients.length === 0 ? (
            <p className="p-5 text-sm text-muted">No clients yet. Add one on the right.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Name</th>
                  <th className="th">Coverage</th>
                  <th className="th">Codes</th>
                  <th className="th">Keywords</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className="td">
                      <Link href={`/clients/${c.id}`} className="text-accent hover:underline">{c.name}</Link>
                    </td>
                    <td className="td">{c.jurisdictions.join(", ") || "n/a"}</td>
                    <td className="td">{c._count.codes}</td>
                    <td className="td">{c._count.keywords}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <form action={createClient} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Add client</h2>
          <div><label className="label">Name</label><input name="name" className="input" required /></div>
          <div><label className="label">Contact email</label><input name="contactEmail" className="input" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Plan tier</label><input name="planTier" className="input" placeholder="Growth" /></div>
            <div><label className="label">Coverage (ON, AB)</label><input name="jurisdictions" className="input" placeholder="ON, AB" /></div>
          </div>
          <div><label className="label">Trades (comma separated)</label><input name="trades" className="input" placeholder="janitorial, facilities" /></div>
          <div><label className="label">Clearances / licenses held</label><input name="clearances" className="input" placeholder="CCDC bonding, WSIB" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Value min</label><input name="valueMin" type="number" className="input" /></div>
            <div><label className="label">Value max</label><input name="valueMax" type="number" className="input" /></div>
          </div>
          <div><label className="label">Notes</label><textarea name="notes" className="input" rows={2} /></div>
          <button className="btn-primary w-full">Create client</button>
        </form>
      </div>

      <form action={importClients} className="card mt-6 space-y-3">
        <h2 className="text-sm font-semibold text-fg">Import clients (CSV)</h2>
        <p className="text-xs text-muted">
          Header row required. Columns: <code>name, contactEmail, planTier, jurisdictions, trades, clearances, valueMin, valueMax, codes, keywords, notes</code>.
          Separate multiple values in one cell with <code>;</code> (e.g. <code>ON;QC</code>). Codes use <code>SYSTEM:CODE</code>, e.g. <code>GSIN:S206;UNSPSC:76111501</code>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="label">CSV file</label><input name="file" type="file" accept=".csv" className="input" /></div>
          <div className="flex items-end"><span className="text-xs text-subtle">or paste below</span></div>
        </div>
        <textarea name="csv" rows={6} className="input font-mono text-xs" placeholder={"name,jurisdictions,trades,valueMin,valueMax,codes,keywords\nAcme Facility Services,ON;QC,janitorial;facilities,50000,2000000,GSIN:S206;UNSPSC:76111501,janitorial;custodial services"} />
        <button className="btn-primary w-full">Import clients</button>
      </form>
    </>
  );
}
