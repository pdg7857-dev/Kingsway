import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink, RecBadge } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { analysisSchema } from "@/lib/analysis-schema";

export const dynamic = "force-dynamic";

export default async function OpportunityDetail({ params }: { params: { id: string } }) {
  const opp = await prisma.opportunity.findUnique({
    where: { id: params.id },
    include: {
      matches: { include: { client: true }, orderBy: { score: "desc" } },
      documents: { select: { id: true, storagePath: true, pageCount: true } },
    },
  });
  if (!opp) notFound();

  const hasFile = opp.documents.some((d) => d.storagePath);

  const parsed = analysisSchema.safeParse(opp.analysis);
  const a = parsed.success ? parsed.data : null;
  const failed = !a && opp.analysis && typeof opp.analysis === "object" && "error" in (opp.analysis as object);

  return (
    <>
      <div className="mb-2"><BackLink href="/documents">← Analyze</BackLink></div>
      <PageHeader
        title={opp.title}
        sub={[opp.buyer, opp.jurisdiction, opp.platform].filter(Boolean).join(" · ") || undefined}
        action={hasFile ? <a href={`/documents/${opp.id}/file`} target="_blank" rel="noreferrer" className="btn-ghost">Open original</a> : undefined}
      />

      {failed && (
        <div className="card border-bad/40 text-sm text-bad">
          Analysis did not complete: {String((opp.analysis as { error?: string }).error)}. Check ANTHROPIC_API_KEY and re-run.
        </div>
      )}

      {a && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-sm font-semibold text-fg">Summary</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{a.summary || "No summary."}</p>
              {a.scope_of_work.length > 0 && (
                <>
                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-subtle">Scope</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {a.scope_of_work.map((s, i) => <li key={i}>· {s}</li>)}
                  </ul>
                </>
              )}
            </div>

            <div className="card">
              <h2 className="text-sm font-semibold text-fg">Mandatory qualifications</h2>
              {a.mandatory_qualifications.length === 0 ? (
                <p className="mt-2 text-sm text-muted">None extracted.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {a.mandatory_qualifications.map((q, i) => (
                    <li key={i} className="text-sm">
                      <span className={`pill mr-2 ${q.disqualifying_if_unmet ? "border-bad/40 text-bad" : ""}`}>{q.type}</span>
                      <span className="text-fg">{q.requirement}</span>
                      {q.detail && <span className="text-muted"> — {q.detail}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {a.evaluation.criteria.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold text-fg">Evaluation ({a.evaluation.method.replace(/_/g, " ")})</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {a.evaluation.criteria.map((c, i) => <li key={i}>{c.name}{c.weight != null ? `: ${c.weight}` : ""}</li>)}
                </ul>
              </div>
            )}

            {a.red_flags.length > 0 && (
              <div className="card border-warn/30">
                <h2 className="text-sm font-semibold text-warn">Red flags</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted">{a.red_flags.map((r, i) => <li key={i}>· {r}</li>)}</ul>
              </div>
            )}

            {a.source_references.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold text-fg">Source citations</h2>
                <ul className="mt-2 space-y-1 text-xs text-subtle">
                  {a.source_references.map((s, i) => (
                    <li key={i}>{s.page != null ? `p.${s.page} ` : ""}{s.claim}{s.quote ? `: "${s.quote}"` : ""}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-sm font-semibold text-fg">At a glance</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Type" v={a.solicitation.type || opp.type || "n/a"} />
                <Row k="Solicitation #" v={a.solicitation.solicitation_number || "n/a"} />
                <Row k="Closing" v={fmtDate(opp.closingDate)} />
                <Row k="Contract term" v={a.term.initial_duration || "n/a"} />
                <Row k="Est. value" v={`${money(opp.estimatedValue ? Number(opp.estimatedValue) : a.estimated_value.amount, opp.currency)} (${a.estimated_value.basis})`} />
                <Row k="Confidence" v={`${Math.round(a.confidence_overall * 100)}%`} />
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[...a.classification_codes.unspsc.map((c) => `UNSPSC ${c}`),
                  ...a.classification_codes.gsin.map((c) => `GSIN ${c}`),
                  ...a.classification_codes.nigp.map((c) => `NIGP ${c}`),
                  ...a.classification_codes.naics.map((c) => `NAICS ${c}`)].map((c) => (
                  <span key={c} className="pill font-mono">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Client matches</h2>
      {opp.matches.length === 0 ? (
        <div className="card text-sm text-muted">No client matches. Add clients with codes and keywords, then re-analyze.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Client</th><th className="th">Fit</th><th className="th">Why</th></tr></thead>
            <tbody>
              {opp.matches.map((m) => (
                <tr key={m.id}>
                  <td className="td"><Link href={`/clients/${m.clientId}`} className="text-accent hover:underline">{m.client.name}</Link></td>
                  <td className="td"><RecBadge rec={m.recommendation} score={m.score} /></td>
                  <td className="td text-muted">{m.rationale}{m.blockers.length > 0 && <span className="text-bad"> · blockers: {m.blockers.join("; ")}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-right text-fg">{v}</dd>
    </div>
  );
}
