import type { Metadata } from "next";
import { Clock, FileSearch, Layers, ListChecks, Users } from "lucide-react";
import { CostCalculator } from "@/components/site/cost-calculator";
import { LeadForm } from "@/components/site/lead-form";
import {
  Breadcrumbs,
  CtaBand,
  FeatureCard,
  Section,
  SectionHead,
} from "@/components/site/ui";
import { pageMeta, JsonLd, breadcrumbJsonLd, serviceJsonLd } from "@/lib/site/seo";

export const metadata: Metadata = pageMeta({
  title: "Opportunity Cost Calculator: What Is DIY Bid Monitoring Costing You?",
  description:
    "Estimate what manual portal monitoring and bid review costs your team every month in estimator time, then compare it to coverage from $599/month.",
  path: "/tools/opportunity-cost-calculator",
  keywords: [
    "opportunity cost calculator",
    "bid monitoring cost",
    "government bid cost calculator",
    "cost of DIY procurement monitoring",
  ],
});

const HIDDEN_COSTS: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    icon: Clock,
    title: "Estimator time on portals",
    body: "Every login, saved search and email alert across a dozen platforms eats hours before anyone has read a single solicitation.",
  },
  {
    icon: Users,
    title: "Proposal-manager attention",
    body: "Senior people get pulled into triaging notices that should never have reached their desk, the most expensive screening you can buy.",
  },
  {
    icon: FileSearch,
    title: "Opportunity review",
    body: "Reading the wrong notices is not free. Each one is time you could have spent on a bid that was actually winnable.",
  },
  {
    icon: ListChecks,
    title: "Document review",
    body: "Addenda, drawings, scope and submission rules buried in PDFs. Missing one detail can cost you the bid or the margin.",
  },
  {
    icon: Layers,
    title: "Fit qualification",
    body: "Deciding go or no-go takes judgment. Done late or done sloppily, it sends teams chasing work they were never going to win.",
  },
];

export default function CalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/opportunity-cost-calculator" },
            { name: "Opportunity cost calculator", path: "/tools/opportunity-cost-calculator" },
          ]),
          serviceJsonLd(
            "Government Opportunity Intelligence",
            "Monitoring, discovery, bid-document review and fit qualification of government contract opportunities across Canada and the United States.",
            "/tools/opportunity-cost-calculator",
          ),
        ]}
      />

      <section className="border-b border-line bg-ink-900">
        <div className="container py-14">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/resources" },
              { name: "Opportunity cost calculator" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              What is searching for bids actually costing you?
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Manual portal monitoring feels free because nobody invoices for it. It is not. It is
              paid in estimator hours, in senior attention, and in the winnable bids your team never
              sees. Move the sliders to put a number on it, then compare that number to coverage
              from $599 a month.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <CostCalculator />
      </Section>

      <Section muted>
        <SectionHead
          eyebrow="How to read it"
          title="What the inputs mean and what the number tells you"
          lede="The calculator works off three inputs. They are your numbers, so the estimate is yours, not a figure I invented."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <FeatureCard icon={Clock} title="Estimator hourly rate (fully loaded)">
            Your estimator's true cost per hour: salary, benefits, overhead, the lot. Use the loaded
            rate, not the take-home, because that is what an hour on a portal really costs you.
          </FeatureCard>
          <FeatureCard icon={ListChecks} title="Hours per week reviewing bids">
            The time your team spends each week logging in, scanning notices, opening documents and
            deciding what is worth pursuing, before any proposal gets written.
          </FeatureCard>
          <FeatureCard icon={Layers} title="Jurisdictions monitored">
            Every jurisdiction adds another portal, another login and another set of alerts. More
            jurisdictions means more monitoring overhead, so the estimate scales gently with them.
          </FeatureCard>
        </div>
        <div className="prose-site mt-8 max-w-3xl">
          <p>
            The output is an estimate of what DIY monitoring costs you each month in estimator time
            alone. It does not count the proposal you lost because an addendum slipped past, or the
            contract that went unbid because nobody qualified it in time. Treat the number as a
            floor, not a ceiling.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="The part nobody invoices"
          title="The hidden costs of DIY portal monitoring"
          lede="When a contractor tells me monitoring is free, this is the work I point to. Five quiet line items that add up well before a bid is ever submitted."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIDDEN_COSTS.map((c) => (
            <FeatureCard key={c.title} icon={c.icon} title={c.title}>
              {c.body}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="The comparison"
              title="Set it against $599 a month"
              lede="Coverage starts at $599/month for a single jurisdiction and scales as your geographic footprint grows."
            />
            <div className="prose-site mt-6 max-w-xl">
              <p>
                For most teams the calculator lands well above $599 in estimator time alone. The
                point is not just the dollars. It is that the same spend buys back the hours and
                surfaces the bids your team never saw, with the documents read and the fit already
                qualified.
              </p>
              <p>
                I monitor every platform your buyers use, read the bid documents and qualify the fit.
                You decide what to chase. I do not write or submit bids; I make sure the right ones
                reach you in time to win them.
              </p>
            </div>
          </div>
          <LeadForm variant="call" />
        </div>
      </Section>

      <CtaBand
        title="Put the hours back on bids worth winning."
        sub="Book a 20-minute discovery call and I will show you, in your jurisdictions, the opportunities your current setup is missing."
      />
    </>
  );
}
