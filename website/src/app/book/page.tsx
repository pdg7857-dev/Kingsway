import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Eye, ListChecks, ShieldCheck, CalendarCheck } from "lucide-react";
import {
  Breadcrumbs,
  CtaBand,
  Section,
  SectionHead,
} from "@/components/site/ui";
import { LeadForm } from "@/components/site/lead-form";
import { FaqAccordion } from "@/components/site/faq";
import { SITE } from "@/lib/site/config";
import {
  pageMeta,
  JsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/site/seo";

export const metadata: Metadata = pageMeta({
  title: "Book a 20-Minute Discovery Call",
  description:
    "Book a 20-minute discovery call. Before you pay a cent, I will show you real, qualified government opportunities in your trade and jurisdictions, so you can see the quality for yourself.",
  path: "/book",
  keywords: [
    "book government bid discovery call",
    "government opportunity consultation",
    "free procurement opportunity review",
    "government contract opportunity call",
  ],
});

const faqs = [
  {
    q: "Is the call free, and is there any pressure?",
    a: "Yes, it is free, and no, there is no pressure. The point of the call is to show you the quality of what I find. If it is obviously useful, we talk about coverage. If it is not a fit, you walk away with real opportunities you can pursue anyway.",
  },
  {
    q: "Will you really show me live opportunities before I pay?",
    a: "I will. Tell me your trade and where you bid when you book, and I will come to the call with actual, current opportunities in your jurisdictions, already read and qualified. There is no better way to judge what I do than to see it on your own work.",
  },
  {
    q: "Do you write or submit the bid for me?",
    a: "No. I find, read and qualify opportunities so your team spends time only on the ones worth pursuing. You own the pricing, the proposal and the submission. I am the discovery and qualification side, not a proposal shop.",
  },
  {
    q: "What does coverage cost after the call?",
    a: "Flat monthly coverage starts at $599, priced by the geography you need rather than per opportunity or per platform. We only get into pricing if the opportunities I show you on the call make it worth your while.",
  },
];

export default function BookPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Book a call", path: "/book" },
          ]),
          faqJsonLd(faqs),
        ]}
      />

      {/* Hero */}
      <section className="border-b border-line bg-ink-900">
        <div className="container py-12 lg:py-16">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Book a call" }]} />
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow text-brand-300">Discovery call</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              See real opportunities in your jurisdictions, before you pay a cent
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Twenty minutes. You tell me your trade and where you bid. I come to the call with
              live, qualified government opportunities I have already found and read for your area.
              No slides, no pitch you have heard before, just the work, on your screen.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-400" /> 20 minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-400" /> No cost, no obligation
              </span>
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4 text-gold-400" /> Real opportunities, not a demo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Value prop + what happens + form */}
      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">What happens on the call</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              I prove the value first, then we talk
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Most discovery calls are a sales script. This one is a working session. Here is exactly
              how the twenty minutes go.
            </p>

            <ol className="mt-8 space-y-6">
              <li className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-ink">You tell me what you chase</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Your trades, your jurisdictions, the size and type of work you want more of. A
                    couple of minutes is enough to point me in the right direction.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-ink">I show you real, current opportunities</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Live notices in your area that fit your trade, already read and qualified the way
                    I do it for clients. This is the part most people are surprised by.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-ink">We decide if it is worth continuing</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    If the opportunities are clearly worth it, I explain coverage for your area. If
                    not, you keep what I showed you and we shake hands. No pressure either way.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-10 rounded-2xl border border-line bg-paper-soft p-6">
              <div className="flex items-center gap-2 text-brand-700">
                <ListChecks className="h-5 w-5" />
                <h3 className="font-semibold text-ink">What to bring</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {[
                  "The trades or services you want more government work in",
                  "The provinces, states or cities where you can actually deliver",
                  "Any bonding, licensing or capacity limits worth knowing up front",
                  "A sense of the contract size that fits your shop",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            {/*
              CALENDAR EMBED GOES HERE.
              When a real scheduling tool is chosen, an operator should embed the
              Calendly / SavvyCal (or similar) booking widget in this slot, replacing
              or supplementing the LeadForm below. Until then, this form collects the
              same intent and routes it to Phil so he can schedule the 20-minute call
              manually. See SITE.bookingUrl in src/lib/site/config.ts.
            */}
            <LeadForm variant="call" />
          </div>
        </div>
      </Section>

      {/* Reassurance band */}
      <Section muted>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            Twenty minutes to find out what you have been missing
          </h2>
          <p className="text-lg leading-8 text-slate-600">
            The contractors I work with almost always see at least one opportunity on the call they
            would have missed on their own. That is the whole point. Worst case, you spend twenty
            minutes and leave with real leads. Best case, you stop searching portals for good.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHead title="Before you book" center />
        <div className="mx-auto mt-8 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </Section>

      <CtaBand
        title="Pick a time. I will bring the opportunities."
        sub="Tell me your trade and your jurisdictions, and our first call will be a working session, not a sales pitch."
      />
    </>
  );
}
