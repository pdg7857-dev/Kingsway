import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { Breadcrumbs, CtaBand, Section, SectionHead } from "@/components/site/ui";
import { PricingTables } from "@/components/site/pricing-tables";
import { FaqAccordion } from "@/components/site/faq";
import { INCLUDED_EVERYWHERE, PRICING_PRINCIPLES } from "@/lib/site/pricing";
import { SITE } from "@/lib/site/config";
import { pageMeta, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/site/seo";

const PRICING_FAQS = [
  {
    q: "Why price by geography instead of per opportunity?",
    a: "Because counting opportunities would punish you for the thing you want most. The whole point is that I surface more winnable work, so charging per bid would be backwards. You pick the coverage you need (a province, a state, a region, or national) and I cover everything inside it, however many opportunities that turns out to be.",
  },
  {
    q: "Is there a setup fee or a contract?",
    a: "No setup fee, and no long lock-in. Coverage runs month to month. It should pay for itself by putting more winnable work in front of you than it costs, and if it ever stops doing that, you stop.",
  },
  {
    q: "What counts as a jurisdiction?",
    a: "A province or a state. State and local opportunities (counties, cities, school and special districts) are covered at every plan level for the states you choose.",
  },
  {
    q: "How do I get federal or U.S. military contract coverage?",
    a: "In the United States, federal and military / Department of Defense contracts (SAM.gov, GSA eBuy and the rest) are included only on the National plan. The single-state, regional and multi-state plans cover state and local work. If federal or military work is your focus, National is the plan for you. In Canada, federal procurement (CanadaBuys) is included with National coverage.",
  },
  {
    q: "Can I cover both Canada and the United States?",
    a: "Yes. Plenty of contractors work both sides of the border. We combine coverage to match your real footprint. Tell me where you bid and I will put together the right mix.",
  },
  {
    q: "What is not included?",
    a: "I do not write your proposals, build your pricing, or submit your bids. That is your edge and I do not get in the middle of it. I find, read and qualify the opportunities so your team spends its hours on the bids worth winning.",
  },
  {
    q: "How do I know it is worth it before paying?",
    a: "Book a discovery call. I will already have looked at your jurisdictions, so you will see real, current opportunities I have found and qualified before you commit to anything. You can also request a sample opportunity and judge the quality for yourself.",
  },
];

export const metadata: Metadata = pageMeta({
  title: "Pricing: Government Opportunity Intelligence Coverage Plans",
  description:
    "Public pricing from $599/month, structured as geographic coverage. Single province or state, regional, multi-state, and national plans for Canada and the U.S. No per-opportunity fees, no lock-in.",
  path: "/pricing",
  keywords: ["government bid monitoring pricing", "opportunity intelligence cost", "bid alert service pricing"],
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]),
          faqJsonLd(PRICING_FAQS),
        ]}
      />

      <section className="border-b border-line bg-ink-900">
        <div className="container py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Pricing" }]} />
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow text-brand-300">Opportunity intelligence coverage</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              Public pricing. Priced as coverage, not per bid.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              One flat monthly plan covers the geography you choose: every relevant platform, every
              opportunity I find inside it, read and qualified. No per-portal fees. No
              per-opportunity charges. No clock to watch.
            </p>
          </div>
        </div>
      </section>

      {/* Tables */}
      <Section>
        <PricingTables />
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-line bg-paper-soft p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {PRICING_PRINCIPLES.map((p) => (
              <div key={p} className="flex gap-2.5 text-sm text-ink-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* What's included */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Included in every plan"
              title="What you get, in every jurisdiction you cover"
              lede="The work is the same whether you cover one state or twelve. Only the footprint changes."
            />
          </div>
          <ul className="space-y-3">
            {INCLUDED_EVERYWHERE.map((f) => (
              <li key={f} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span className="text-ink-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* What it replaces */}
      <Section>
        <SectionHead
          center
          eyebrow="The math"
          title="One plan replaces a job's worth of searching"
          lede="Compare flat coverage against what manual monitoring and triage actually cost in estimator time."
        />
        <div className="mx-auto mt-10 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          <div className="bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Doing it yourself</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {["Estimator hours lost to portals", "Notifications to triage daily", "Documents nobody has time to read", "Good bids missed under odd titles", "Bid/no-bid guesswork"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink-900 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Coverage from $599/mo</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-200">
              {["Every platform watched for you", "A short list, not a firehose", "Documents read and summarized", "Mis-titled fits caught", "Fit qualified before you bid"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Run your own numbers with the{" "}
          <Link href="/opportunity-waste-calculator" className="font-medium text-brand-700 underline">
            Opportunity Cost Calculator
          </Link>
          .
        </p>
      </Section>

      {/* FAQ */}
      <Section muted>
        <SectionHead title="Pricing questions" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <FaqAccordion faqs={PRICING_FAQS} />
          <div className="rounded-2xl border border-line bg-white p-8">
            <h3 className="text-xl font-semibold text-ink">Not sure which plan fits?</h3>
            <p className="mt-2 text-slate-600">
              Tell me where you bid and what you chase. I will recommend the smallest plan that
              actually covers your footprint, and show you live opportunities on the call.
            </p>
            <Link href={SITE.bookingUrl} className="btn-primary mt-6 w-full py-3">
              Book a discovery call
            </Link>
            <Link href={SITE.sampleUrl} className="btn-ghost mt-3 w-full py-3">
              Request a sample first
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
