import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { analysisSchema } from "@/lib/analysis-schema";
import { findRelatedAwards } from "@/lib/incumbents-lookup";
import { money, fmtDate } from "@/lib/text";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export default async function ClientBrief({ params }: { params: { id: string; clientId: string } }) {
  const [opp, client, match] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id: params.id } }),
    prisma.client.findUnique({ where: { id: params.clientId } }),
    prisma.match.findUnique({ where: { opportunityId_clientId: { opportunityId: params.id, clientId: params.clientId } } }),
  ]);
  if (!opp || !client) notFound();

  const parsed = analysisSchema.safeParse(opp.analysis);
  const a = parsed.success ? parsed.data : null;
  const codes = a ? [...a.classification_codes.unspsc, ...a.classification_codes.gsin, ...a.classification_codes.nigp, ...a.classification_codes.naics] : [];
  const related = await findRelatedAwards({ buyer: opp.buyer, codes, title: opp.title });
  const incVal = related.incumbent?.value ? Number(related.incumbent.value) : null;

  return (
    <div className="min-h-screen bg-white p-6 text-slate-900 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Opportunity brief prepared for</p>
            <p className="text-lg font-bold">{client.name}</p>
          </div>
          <PrintButton />
        </div>

        <h1 className="text-2xl font-bold leading-snug">{opp.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {[opp.buyer, opp.jurisdiction, opp.platform].filter(Boolean).join(" · ")}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-4 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-500">Closes</dt><dd className="font-semibold">{fmtDate(opp.closingDate)}</dd></div>
          <div><dt className="text-slate-500">Est. value</dt><dd className="font-semibold">{money(opp.estimatedValue ? Number(opp.estimatedValue) : null, opp.currency)}</dd></div>
          <div><dt className="text-slate-500">Type</dt><dd className="font-semibold">{opp.type ?? (a?.solicitation.type || "n/a")}</dd></div>
        </dl>

        {a && (
          <>
            <Section title="What it is">
              <p className="text-sm leading-6 text-slate-700">{a.summary}</p>
            </Section>

            {match && (
              <Section title="Why this fits you">
                <p className="text-sm leading-6 text-slate-700">{match.rationale}</p>
                {(match.matchedCodes.length > 0 || match.matchedKeywords.length > 0) && (
                  <p className="mt-2 text-xs text-slate-500">
                    Matched on {[match.matchedCodes.length ? `codes ${match.matchedCodes.join(", ")}` : "", match.matchedKeywords.length ? `${match.matchedKeywords.slice(0, 6).join(", ")}` : ""].filter(Boolean).join("; ")}.
                  </p>
                )}
              </Section>
            )}

            {a.mandatory_qualifications.length > 0 && (
              <Section title="What it requires">
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {a.mandatory_qualifications.map((q, i) => (
                    <li key={i}>• <span className="font-medium">{q.requirement}</span>{q.detail ? ` — ${q.detail}` : ""}</li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Key dates">
              <ul className="text-sm text-slate-700">
                {a.key_dates.questions_due && <li>Questions due: {fmtDate(a.key_dates.questions_due)}</li>}
                {a.key_dates.site_visit && <li>Site visit: {fmtDate(a.key_dates.site_visit)}</li>}
                <li>Bid closes: {fmtDate(a.key_dates.closing ?? (opp.closingDate ? opp.closingDate.toISOString() : null))}</li>
              </ul>
            </Section>
          </>
        )}

        {related.incumbent && (
          <Section title="Who holds it now">
            <p className="text-sm text-slate-700">
              Likely incumbent: <span className="font-semibold">{related.incumbent.supplier ?? "unknown"}</span>
              {incVal ? ` at ${money(incVal)}` : ""}{related.incumbent.endDate ? `, ending ${fmtDate(related.incumbent.endDate)}` : ""}.
              {related.stats.median ? ` Comparable awards run around ${money(related.stats.median)}.` : ""}
            </p>
          </Section>
        )}

        <p className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          Found and qualified by Phil Dave, Government Opportunity Intelligence. You prepare and submit the bid.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
