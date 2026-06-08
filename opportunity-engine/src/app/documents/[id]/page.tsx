import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink, RecBadge } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { analysisSchema } from "@/lib/analysis-schema";
import { findRelatedAwards } from "@/lib/incumbents-lookup";
import { similarAwardsForOpportunity } from "@/lib/similar";
import { updatePursuit } from "../actions";

const PURSUIT = ["new", "reviewing", "sent", "bidding", "won", "lost"];

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

  // #1/#7: connect this tender to award history (incumbent + price to beat).
  const codes = a
    ? [...a.classification_codes.unspsc, ...a.classification_codes.gsin, ...a.classification_codes.nigp, ...a.classification_codes.naics]
    : [];
  const related = await findRelatedAwards({ buyer: opp.buyer, codes, title: opp.title });
  // #8: semantic nearest-neighbours (opt-in; empty unless embeddings are built).
  const similar = await similarAwardsForOpportunity(opp.id, 8);

  // #6: a one-line bid/no-bid signal from the best client fit + incumbent.
  const strong = opp.matches.filter((m) => m.recommendation === "strong").length;
  const worth = opp.matches.filter((m) => m.recommendation === "worth_a_look").length;
  const fitText = strong ? `Strong fit for ${strong} client${strong > 1 ? "s" : ""}` : worth ? `Worth a look for ${worth} client${worth > 1 ? "s" : ""}` : "No strong client fit yet";
  const incVal = related.incumbent?.value ? Number(related.incumbent.value) : null;
  const hasDates = !!(a && (a.key_dates.closing || a.key_dates.site_visit || a.key_dates.questions_due)) || !!opp.closingDate;

  return (
    <>
      <div className="mb-2"><BackLink href="/documents">← Analyze</BackLink></div>
      <PageHeader
        title={opp.title}
        sub={[opp.buyer, opp.jurisdiction, opp.platform].filter(Boolean).join(" · ") || undefined}
        action={
          <div className="flex gap-2">
            {hasDates && <a href={`/documents/${opp.id}/calendar`} className="btn-ghost">Add to calendar</a>}
            {hasFile && <a href={`/documents/${opp.id}/file`} target="_blank" rel="noreferrer" className="btn-ghost">Open original</a>}
          </div>
        }
      />

      <div className="card mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-subtle">Pursuit:</span>
        <form action={updatePursuit} className="flex items-center gap-2">
          <input type="hidden" name="id" value={opp.id} />
          <select name="pursuit" defaultValue={opp.pursuit} className="input max-w-[12rem]">
            {PURSUIT.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-ghost">Save</button>
        </form>
        {opp.needsReview && (
          <form action={updatePursuit} className="ml-auto flex items-center gap-2">
            <span className="pill border-warn/40 text-warn">Needs review (low confidence)</span>
            <input type="hidden" name="id" value={opp.id} />
            <input type="hidden" name="pursuit" value={opp.pursuit} />
            <input type="hidden" name="clearReview" value="1" />
            <button className="btn-ghost text-xs">Mark reviewed</button>
          </form>
        )}
      </div>

      {failed && (
        <div className="card border-bad/40 text-sm text-bad">
          Analysis did not complete: {String((opp.analysis as { error?: string }).error)}. Check ANTHROPIC_API_KEY and re-run.
        </div>
      )}

      <div className="card mb-6 border-accent/40">
        <span className="font-semibold text-fg">Bid signal:</span>{" "}
        <span className="text-sm text-muted">
          {fitText}.{" "}
          {related.incumbent && incVal
            ? `Incumbent on record: ${related.incumbent.supplier ?? "unknown"} (${money(incVal)}); price to beat is around ${money(related.stats.median)}.`
            : "No incumbent found in award history."}
        </span>
      </div>

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
                {opp.analysisCostUsd != null && <Row k="Analysis cost" v={`~$${opp.analysisCostUsd.toFixed(3)}`} />}
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

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Incumbent & price history</h2>
      {related.related.length === 0 ? (
        <div className="card text-sm text-muted">No similar awarded contracts found in history (by buyer, codes, or title). Import more award years to improve this.</div>
      ) : (
        <div className="card p-0">
          <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-3">
            <div>
              <div className="text-xs text-subtle">Likely incumbent</div>
              <div className="text-sm font-semibold text-fg">{related.incumbent?.supplier ?? "n/a"}</div>
              <div className="text-xs text-muted">{incVal ? money(incVal) : ""}{related.incumbent?.endDate ? ` · ends ${fmtDate(related.incumbent.endDate)}` : ""}</div>
            </div>
            <div>
              <div className="text-xs text-subtle">Price to beat (median)</div>
              <div className="text-sm font-semibold text-fg">{money(related.stats.median)}</div>
            </div>
            <div>
              <div className="text-xs text-subtle">Range ({related.stats.count} similar)</div>
              <div className="text-sm text-fg">{money(related.stats.min)} - {money(related.stats.max)}</div>
            </div>
          </div>
          <table className="w-full">
            <thead><tr><th className="th">Past contract</th><th className="th">Supplier</th><th className="th">Value</th><th className="th">Ended</th></tr></thead>
            <tbody>
              {related.related.map((r) => (
                <tr key={r.id}>
                  <td className="td"><Link href={`/awards/${r.id}`} className="text-accent hover:underline">{r.title}</Link><div className="text-xs text-subtle">{r.buyer}</div></td>
                  <td className="td">{r.supplier ?? "n/a"}</td>
                  <td className="td">{money(r.value ? Number(r.value) : null, r.currency)}</td>
                  <td className="td">{fmtDate(r.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {similar.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Similar past contracts (semantic)</h2>
          <div className="card overflow-x-auto p-0">
            <table className="w-full">
              <thead><tr><th className="th">Contract</th><th className="th">Supplier</th><th className="th">Value</th><th className="th">Similarity</th></tr></thead>
              <tbody>
                {similar.map((s) => (
                  <tr key={s.id}>
                    <td className="td"><Link href={`/awards/${s.id}`} className="text-accent hover:underline">{s.title}</Link><div className="text-xs text-subtle">{s.buyer}</div></td>
                    <td className="td">{s.supplier ?? "n/a"}</td>
                    <td className="td">{money(s.value, s.currency)}</td>
                    <td className="td">{Math.round((1 - s.dist) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-subtle">Client matches</h2>
      {opp.matches.length === 0 ? (
        <div className="card text-sm text-muted">No client matches. Add clients with codes and keywords, then re-analyze.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead><tr><th className="th">Client</th><th className="th">Fit</th><th className="th">Why</th><th className="th">Brief</th></tr></thead>
            <tbody>
              {opp.matches.map((m) => (
                <tr key={m.id}>
                  <td className="td"><Link href={`/clients/${m.clientId}`} className="text-accent hover:underline">{m.client.name}</Link></td>
                  <td className="td"><RecBadge rec={m.recommendation} score={m.score} /></td>
                  <td className="td text-muted">{m.rationale}{m.blockers.length > 0 && <span className="text-bad"> · blockers: {m.blockers.join("; ")}</span>}</td>
                  <td className="td"><a href={`/documents/${opp.id}/brief/${m.clientId}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">Brief →</a></td>
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
