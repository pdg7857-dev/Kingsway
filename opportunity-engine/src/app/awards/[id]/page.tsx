import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { abbrsFromText } from "@/lib/jurisdictions";

export const dynamic = "force-dynamic";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-sm text-subtle">{k}</dt>
      <dd className="text-right text-sm text-fg">{v}</dd>
    </div>
  );
}

export default async function AwardDetail({ params }: { params: { id: string } }) {
  const a = await prisma.awardedContract.findUnique({
    where: { id: params.id },
    include: { documents: true },
  });
  if (!a) notFound();

  // Which of our clients could compete: overlap on codes or coverage region.
  const jurAbbrs = abbrsFromText(a.jurisdiction);
  const competitors =
    a.codes.length || jurAbbrs.length
      ? await prisma.client.findMany({
          where: {
            status: { in: ["active", "prospect"] },
            OR: [
              ...(a.codes.length ? [{ codes: { some: { code: { code: { in: a.codes } } } } }] : []),
              ...(jurAbbrs.length ? [{ jurisdictions: { hasSome: jurAbbrs } }] : []),
            ],
          },
          include: { codes: { include: { code: true } } },
        }).catch(() => [])
      : [];

  return (
    <>
      <div className="mb-2"><BackLink href="/awards/browse">← Browse awards</BackLink></div>
      <PageHeader title={a.title} sub={[a.buyer, a.jurisdiction, a.platform].filter(Boolean).join(" · ") || undefined} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 text-sm font-semibold text-fg">Contract</h2>
          <dl>
            <Row k="Awarded supplier (incumbent)" v={a.supplier ?? "n/a"} />
            <Row k="Value" v={money(a.value ? Number(a.value) : null, a.currency)} />
            <Row k="Buyer" v={a.buyer} />
            <Row k="Region" v={a.jurisdiction ?? "n/a"} />
            <Row k="Platform" v={a.platform ?? "n/a"} />
            <Row k="Reference" v={a.sourceRef ?? "n/a"} />
            <Row k="Status" v={a.status.replace(/_/g, " ")} />
          </dl>
        </div>

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold text-fg">Timeline</h2>
          <dl>
            <Row k="Award date" v={fmtDate(a.awardDate)} />
            <Row k="Start date" v={fmtDate(a.startDate)} />
            <Row k="End date" v={`${fmtDate(a.endDate)}${a.endEstimated ? " (estimated)" : ""}`} />
            <Row k="Initial term" v={a.initialTermMonths ? `${a.initialTermMonths} months` : "n/a"} />
            <Row k="Option years" v={a.optionYears ?? "n/a"} />
            <Row k="Projected re-bid window" v={fmtDate(a.rebidWindow)} />
            <Row k="Added" v={fmtDate(a.createdAt)} />
          </dl>
        </div>
      </div>

      {a.codes.length > 0 && (
        <div className="card mt-6">
          <h2 className="mb-2 text-sm font-semibold text-fg">Classification codes</h2>
          <div className="flex flex-wrap gap-1.5">
            {a.codes.map((c) => <span key={c} className="pill font-mono">{c}</span>)}
          </div>
        </div>
      )}

      {a.notes && (
        <div className="card mt-6">
          <h2 className="mb-2 text-sm font-semibold text-fg">Notes</h2>
          <p className="text-sm text-muted">{a.notes}</p>
        </div>
      )}

      {a.documents.length > 0 && (
        <div className="card mt-6">
          <h2 className="mb-2 text-sm font-semibold text-fg">Documents</h2>
          <ul className="space-y-1 text-sm">
            {a.documents.map((d) => <li key={d.id} className="text-muted">{d.title} ({d.docType})</li>)}
          </ul>
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Clients who could compete</h2>
      {competitors.length === 0 ? (
        <div className="card text-sm text-muted">No clients overlap this contract&apos;s codes or region yet. Add clients with matching codes/coverage to surface them here.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Client</th><th className="th">Coverage</th><th className="th">Shared</th></tr></thead>
            <tbody>
              {competitors.map((c) => {
                const sharedCodes = c.codes.map((cc) => cc.code.code).filter((x) => a.codes.includes(x));
                const sharedJur = c.jurisdictions.filter((j) => jurAbbrs.includes(j));
                return (
                  <tr key={c.id}>
                    <td className="td"><Link href={`/clients/${c.id}`} className="text-accent hover:underline">{c.name}</Link></td>
                    <td className="td">{c.jurisdictions.join(", ") || "n/a"}</td>
                    <td className="td text-muted">{[sharedCodes.length ? `codes ${sharedCodes.join(", ")}` : "", sharedJur.length ? `region ${sharedJur.join(", ")}` : ""].filter(Boolean).join("; ") || "broad"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
