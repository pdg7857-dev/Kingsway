import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { STAT_GROUPS } from "@/lib/site/stats";
import { Breadcrumbs, CtaBand, Section, SectionHead } from "@/components/site/ui";
import { pageMeta, JsonLd, breadcrumbJsonLd } from "@/lib/site/seo";

export const metadata: Metadata = pageMeta({
  title: "Government Contracting by the Numbers",
  description:
    "The market size, opportunity volume and competition figures behind government contracting in Canada and the U.S. I cite every number and never invent figures.",
  path: "/statistics",
  keywords: [
    "government contracting statistics",
    "government procurement market size",
    "public bid competition numbers",
    "government contract opportunity data",
  ],
});

export default function StatisticsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "By the numbers", path: "/statistics" },
        ])}
      />

      <section className="border-b border-line bg-ink-900">
        <div className="container py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "By the numbers" }]} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Government contracting by the numbers
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              How big is the government market, how many opportunities go out, and how thin is the
              competition once you find the right bids? These are the questions every contractor
              asks me. Here is how I answer them: with figures you can check, not numbers I made up.
            </p>
          </div>
        </div>
      </section>

      <Section muted>
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="prose-site max-w-3xl">
            <p>
              I cite every number I publish. Where you see a verified figure below, it carries the
              type of source it came from so you can confirm it yourself. Where a figure is not yet
              backed by a source I trust, you will see a clear placeholder instead of a guess.
            </p>
            <p>
              That is deliberate. Government procurement is full of round numbers that get repeated
              until they sound official. I will not pad this page with figures I cannot stand
              behind. As each claim is verified against a primary source, the placeholder is
              replaced with the real number and its citation.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="space-y-14">
          {STAT_GROUPS.map((group) => (
            <div key={group.group}>
              <SectionHead eyebrow="By the numbers" title={group.group} />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.claims.map((claim) => {
                  const verified = claim.value != null;
                  return (
                    <div key={claim.label} className="card flex flex-col p-6">
                      <div className="flex items-baseline justify-between gap-3">
                        {verified ? (
                          <span className="text-3xl font-bold tabular-nums text-ink">
                            {claim.value}
                          </span>
                        ) : (
                          <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
                            Pending verified source
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-base font-semibold text-ink">{claim.label}</h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                        {claim.context}
                      </p>
                      <p className="mt-4 text-xs text-slate-400">
                        {claim.sourceUrl ? (
                          <a
                            href={claim.sourceUrl}
                            className="hover:text-brand-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source: {claim.sourceType}
                          </a>
                        ) : (
                          <>Source: {claim.sourceType} (citation needed, pending verified source)</>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Numbers are the start. Your opportunities are the point."
        sub="Tell me where you bid and I will show you, in your jurisdictions, the opportunities your current setup is missing."
      />
    </>
  );
}
