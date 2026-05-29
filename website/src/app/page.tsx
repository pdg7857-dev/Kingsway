import Link from "next/link";
import { platformPath, industryPath } from "@/lib/site/links";
import {
  Search, FileSearch, Filter, Send, Bell, Layers, Clock, AlertTriangle,
  Building2, Sparkles, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Section, SectionHead, StatStrip, CtaBand, FeatureCard } from "@/components/site/ui";
import { TrustBar } from "@/components/site/trust-bar";
import { VideoFeature } from "@/components/site/video-feature";
import { StatCallout } from "@/components/site/cite";
import { CostCalculator } from "@/components/site/cost-calculator";
import { PricingTables } from "@/components/site/pricing-tables";
import { FaqAccordion } from "@/components/site/faq";
import { LeadForm } from "@/components/site/lead-form";
import { GENERAL_FAQS } from "@/lib/site/faqs";
import { CORNERSTONE_PLATFORMS, PLATFORMS } from "@/lib/site/platforms";
import { PRIMARY_INDUSTRIES } from "@/lib/site/industries";
import { SITE } from "@/lib/site/config";
import { JsonLd, faqJsonLd } from "@/lib/site/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(GENERAL_FAQS.map((f) => ({ q: f.q, a: f.a })))} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-ink-900">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
              <Sparkles className="h-3.5 w-3.5" /> Government Opportunity Intelligence
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
              You focus on winning contracts.
              <span className="block text-brand-300">I focus on finding them.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              I am Phil Dave. I watch every procurement platform that matters, read the bid
              documents, and qualify the fit, so your estimators stop drowning in portals and
              notifications and start working only the opportunities worth pursuing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/government-opportunity-intelligence-report" className="btn-gold px-6 py-3.5 text-base">
                Get your free GOIR <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/opportunity-waste-calculator"
                className="btn-ghost border-white/20 bg-white/5 px-6 py-3.5 text-base text-white hover:border-white/40 hover:text-white"
              >
                Calculate your opportunity waste
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Free Government Opportunity Intelligence Report, or{" "}
              <Link href={SITE.bookingUrl} className="font-medium text-white underline">book a strategy call</Link>.
              Public pricing from <span className="font-semibold text-white">$599/month</span>.
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
                What lands in your inbox
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { t: "Custodial services, 3 schools", s: "MERX, closes in 18 days", fit: "Strong fit" },
                  { t: "Roof replacement, county facility", s: "Bonfire, mandatory site visit Tue", fit: "Worth a look" },
                  { t: "HVAC controls upgrade", s: "SAM.gov, filed under \"energy retrofit\"", fit: "Strong fit" },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{c.t}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{c.s}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-200">
                        {c.fit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Reviewed, qualified, linked. Sample illustration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authority / credentials band */}
      <section className="border-b border-line bg-paper-soft">
        <div className="container py-10">
          <TrustBar />
          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Fluent in the platforms your buyers actually use
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-ink-600">
            {["MERX", "BidNet Direct", "CanadaBuys", "SAM.gov", "Bonfire", "Biddingo", "bids&tenders", "PlanetBids", "GSA eBuy"].map(
              (n) => (
                <span key={n} className="opacity-80">{n}</span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Intro video */}
      <VideoFeature heading="Meet Phil Dave" />

      {/* Problem */}
      <Section muted>
        <SectionHead
          eyebrow="The problem"
          title="Bidding does not fail at the proposal. It fails at the search."
          lede="By the time most contractors sit down to write, they have already lost hours to the part of the job nobody trained them for: finding the right work in the first place."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Layers} title="Too many portals">
            MERX, CanadaBuys, SAM.gov, a different SaaS portal for nearly every municipality. Each
            one has its own login, its own search, its own notification settings.
          </FeatureCard>
          <FeatureCard icon={Bell} title="Too many notifications">
            Keyword alerts fire on everything and qualify nothing. Your inbox fills with work that
            was never in your lane, and the one bid that mattered slips by unread.
          </FeatureCard>
          <FeatureCard icon={Filter} title="Too many poor fits">
            Estimators spend their best hours reading documents for opportunities you were never
            going to win, instead of the handful you actually should.
          </FeatureCard>
          <FeatureCard icon={Clock} title="Not enough time">
            Nobody has time to open every PDF, find the mandatory site meeting on page 14, and
            check the addenda that quietly moved the close date.
          </FeatureCard>
          <FeatureCard icon={AlertTriangle} title="Missed opportunities">
            The work that fits you best is often filed under a title you would never search. If you
            are not watching the way buyers write, you never see it.
          </FeatureCard>
          <FeatureCard icon={Search} title="Opportunity overload">
            More data has not made bidding easier. It has made it noisier. Volume is not the
            problem. Knowing what is worth your time is.
          </FeatureCard>
        </div>
      </Section>

      {/* Positioning: platforms vs Phil */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="The difference"
              title="Platforms show you everything. I show you what matters."
              lede="Government Opportunity Intelligence is a different job than running a portal. The platforms hand you data. I hand you a decision."
            />
            <Link href="/government-opportunity-intelligence" className="btn-ghost mt-6 px-5 py-2.5 text-sm">
              What is opportunity intelligence? <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            {[
              ["Platforms show opportunities.", "I identify the ones worth pursuing."],
              ["Platforms provide data.", "I provide intelligence."],
              ["Platforms send alerts.", "I qualify the fit."],
              ["Platforms show everything.", "I show what matters."],
            ].map(([a, b], i) => (
              <div
                key={i}
                className={`grid grid-cols-2 divide-x divide-line ${i % 2 ? "bg-white" : "bg-paper-soft"}`}
              >
                <div className="p-4 text-sm text-slate-500">{a}</div>
                <div className="flex items-center gap-2 p-4 text-sm font-semibold text-ink">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Cost of doing it yourself + calculator */}
      <Section muted>
        <SectionHead
          center
          eyebrow="The cost of doing it yourself"
          title="The search has a price. You are already paying it."
          lede="Every hour an estimator or proposal manager spends monitoring portals, opening documents and triaging alerts is an hour not spent winning. Here is what that hour is worth."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <StatCallout id="response-hours" />
          <StatCallout id="estimator-hiring" />
          <StatCallout id="blended-rate" />
        </div>
        <div className="mx-auto mt-4 max-w-4xl">
          <CostCalculator />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-500">
          Want the long version, with bid-preparation cost and a printable worksheet? Use the{" "}
          <Link href="/opportunity-waste-calculator" className="font-medium text-brand-700 underline">
            full Opportunity Cost Calculator
          </Link>
          .
        </p>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHead
          center
          eyebrow="How it works"
          title="Four steps. I run the first three."
          lede="You stay focused on pricing and proposals. I take care of everything that happens before a bid is worth your team's time."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Search, n: "01", t: "Monitor", d: "I watch every platform that serves your jurisdictions, continuously, so nothing depends on you remembering to log in." },
            { icon: FileSearch, n: "02", t: "Review", d: "I open the documents and read them: scope, requirements, evaluation criteria, site meetings, addenda, the catch." },
            { icon: Filter, n: "03", t: "Qualify", d: "I judge fit against your trades, capacity and footprint, and set aside the bids that were never right for you." },
            { icon: Send, n: "04", t: "Deliver", d: "You get a short, plain-language summary and a direct link to the source bid. Your team prices and submits." },
          ].map((s) => (
            <div key={s.n} className="card relative p-6">
              <span className="text-xs font-bold text-brand-300">{s.n}</span>
              <div className="mt-3 grid h-11 w-11 place-items-center rounded-xl bg-ink text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/how-it-works" className="btn-dark px-6 py-3">
            See the full process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Platform expertise */}
      <Section dark>
        <SectionHead
          dark
          eyebrow="Platform expertise"
          title="I know where opportunities live and how they hide."
          lede="Each platform categorizes, titles and notifies differently. Knowing those quirks is the difference between seeing a fit and missing it."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CORNERSTONE_PLATFORMS.map((p) => (
            <Link
              key={p.slug}
              href={platformPath(p.slug)}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-400/50 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">{p.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{p.shortName} expert</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{p.oneLiner}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-300">
                Read the guide <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/platforms" className="text-sm font-semibold text-brand-300 hover:text-white">
            View all {PLATFORMS.length} platforms covered &rarr;
          </Link>
        </div>
      </Section>

      {/* Industries */}
      <Section>
        <SectionHead
          eyebrow="Industries"
          title="Built around how your trade actually gets bid."
          lede="Your work hides under different titles and inside larger packages depending on the trade. I learn how buyers describe yours."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={industryPath(ind.slug)}
              className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand-300 hover:shadow-card"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-ink group-hover:text-brand-700">{ind.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{ind.oneLiner}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/industries" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            See every industry I cover &rarr;
          </Link>
        </div>
      </Section>

      {/* Stats */}
      <Section muted>
        <SectionHead
          center
          eyebrow="By the numbers"
          title="A big, noisy market. That is exactly the point."
          lede="Government buyers spend enormous sums across thousands of opportunities and dozens of platforms. The scale is the opportunity, and the reason no team can watch it all alone."
        />
        <div className="mx-auto mt-10 max-w-5xl">
          <StatStrip />
          <p className="mt-4 text-center text-xs text-slate-400">
            Figures shown are placeholders pending verified sourcing. See{" "}
            <Link href="/government-procurement-statistics" className="font-medium text-brand-700 underline">
              Government Contracting by the Numbers
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <SectionHead
          center
          eyebrow="Pricing"
          title="Public pricing, structured as coverage."
          lede="Not per opportunity. Not per portal. Not hourly. You choose the geographic coverage you need and I cover everything inside it."
        />
        <div className="mt-12">
          <PricingTables />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Full details, FAQs and what is included on the{" "}
          <Link href="/pricing" className="font-medium text-brand-700 underline">
            pricing page
          </Link>
          .
        </p>
      </Section>

      {/* FAQ + lead form */}
      <Section muted>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHead eyebrow="Questions" title="The things contractors ask me first." />
            <div className="mt-8">
              <FaqAccordion faqs={GENERAL_FAQS.slice(0, 6)} />
            </div>
            <Link href="/faq" className="mt-6 inline-block text-sm font-semibold text-brand-700">
              Read every question &rarr;
            </Link>
          </div>
          <div className="lg:pt-16">
            <LeadForm variant="call" />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
