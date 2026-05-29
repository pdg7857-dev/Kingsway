import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Building2, AlertTriangle, Tag, ListChecks, ArrowRight } from "lucide-react";
import { INDUSTRIES, getIndustry } from "@/lib/site/industries";
import { getPlatform } from "@/lib/site/platforms";
import { Breadcrumbs, CtaBand, Section, SectionHead } from "@/components/site/ui";
import { LeadForm } from "@/components/site/lead-form";
import { FaqAccordion } from "@/components/site/faq";
import { SITE } from "@/lib/site/config";
import { pageMeta, JsonLd, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/site/seo";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ind = getIndustry(params.slug);
  if (!ind) return {};
  return pageMeta({
    title: `${ind.name} Government Contracts: Find & Win More Bids`,
    description: `${ind.oneLiner} I monitor every platform, read the documents and qualify fit for ${ind.plural}, so you stop missing government ${ind.name.toLowerCase()} opportunities.`,
    path: `/industries/${ind.slug}`,
    keywords: ind.keywords,
  });
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const ind = getIndustry(params.slug);
  if (!ind) notFound();

  const platforms = ind.platforms.map(getPlatform).filter(Boolean);
  const faqs = [
    {
      q: `Which platforms carry ${ind.name.toLowerCase()} government work?`,
      a: `Your work shows up across ${platforms
        .slice(0, 4)
        .map((p) => p!.name)
        .join(", ")} and the state, provincial and municipal systems behind them. I watch the ones that serve your jurisdictions, not a fixed list.`,
    },
    {
      q: `My ${ind.name.toLowerCase()} work is specialized. Does this still help?`,
      a: `Especially then. The more specialized your trade, the more your work hides under generic titles and inside larger packages, and the more a keyword alert misses. I learn how buyers describe your scope and watch for it everywhere.`,
    },
    {
      q: "Do you bid or price the work for me?",
      a: "No. You own pricing and proposals. I find, read and qualify the opportunities so your estimators only spend time on the ones worth pursuing.",
    },
    {
      q: "How much does coverage cost?",
      a: "Flat monthly coverage from $599, priced by the geography you need rather than per opportunity or per platform. See the pricing page for Canada and U.S. plans.",
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: ind.name, path: `/industries/${ind.slug}` },
          ]),
          serviceJsonLd(`${ind.name} Government Opportunity Intelligence`, ind.oneLiner, `/industries/${ind.slug}`),
          faqJsonLd(faqs),
        ]}
      />

      <section className="border-b border-line bg-ink-900">
        <div className="container py-12 lg:py-16">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: ind.name }]}
          />
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow text-brand-300">Industry</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              {ind.name} Government Contracts
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {ind.oneLiner} I find, read and qualify government opportunities for {ind.plural}, so
              you stop searching portals and start bidding the work that fits your shop.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={SITE.bookingUrl} className="btn-gold px-5 py-3">
                Book a discovery call
              </Link>
              <Link
                href={SITE.sampleUrl}
                className="btn-ghost border-white/20 bg-white/5 px-5 py-3 text-white hover:border-white/40 hover:text-white"
              >
                Request a sample opportunity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buyers + work types */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-brand-700">
              <Building2 className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-ink">Who buys this work</h2>
            </div>
            <ul className="mt-5 space-y-2.5">
              {ind.buyers.map((b) => (
                <li key={b} className="flex gap-2.5 text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-brand-700">
              <ListChecks className="h-5 w-5" />
              <h2 className="text-xl font-semibold text-ink">The work you will see</h2>
            </div>
            <ul className="mt-5 space-y-2.5">
              {ind.workTypes.map((w) => (
                <li key={w} className="flex gap-2.5 text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {w}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-line bg-paper-soft p-4 text-sm text-slate-600">
              <Tag className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Buyers usually file this under {ind.codes.join(" and ")}. Knowing the codes is half
                the battle. Knowing how each buyer bends them is the other half.
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* How it gets missed */}
      <Section muted>
        <SectionHead
          eyebrow="Where the work hides"
          title={`How ${ind.plural} miss government opportunities`}
          lede="It is rarely that the work is not there. It is that it does not look the way you would search for it."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ind.missedBecause.map((m) => (
            <div key={m} className="flex gap-3 rounded-2xl border border-line bg-white p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
              <p className="text-ink-700">{m}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Platforms */}
      <Section>
        <SectionHead
          eyebrow="Where to watch"
          title={`Platforms that carry ${ind.name.toLowerCase()} work`}
          lede="These are the systems where your buyers post. I monitor the ones that serve your jurisdictions."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {platforms.map(
            (p) =>
              p && (
                <Link
                  key={p.slug}
                  href={`/platforms/${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
                >
                  {p.name}
                  <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              ),
          )}
        </div>
      </Section>

      {/* Lead form */}
      <Section muted>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Try it</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Get a real {ind.name.toLowerCase()} opportunity, qualified
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Tell me your scope and where you work. I will send back a live opportunity for {ind.plural},
              already read and qualified, so you can see exactly what this looks like.
            </p>
          </div>
          <LeadForm variant="sample" />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHead title={`${ind.name} questions`} />
        <div className="mt-8 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </Section>

      <CtaBand title={`Find more ${ind.name.toLowerCase()} contracts worth bidding.`} />
    </>
  );
}
