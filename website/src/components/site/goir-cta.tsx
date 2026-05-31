import Link from "next/link";
import { FileBarChart, ArrowRight } from "lucide-react";

/**
 * Government Opportunity Intelligence Report (GOIR) call to action. The GOIR is
 * the site's primary lead magnet: every money page, platform page and blog post
 * funnels toward it.
 */
export const GOIR_INCLUDES = [
  "Your GOII Score (Government Opportunity Intelligence Index)",
  "An Opportunity Waste Estimate for your current process",
  "A Platform Coverage Analysis across the systems your buyers use",
  "A Renewal Opportunity Analysis of contracts likely to rebid",
  "A Government Contracting Maturity Assessment",
];

export function GoirCta({
  className = "",
  variant = "band",
}: {
  className?: string;
  variant?: "band" | "inline";
}) {
  if (variant === "inline") {
    return (
      <div className={`rounded-2xl border-l-4 border-gold-500 bg-gold-500/15 p-6 ${className}`}>
        <div className="flex items-start gap-3">
          <FileBarChart className="mt-0.5 h-6 w-6 shrink-0 text-gold-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Get your free Government Opportunity Intelligence Report
            </h3>
            <p className="mt-1.5 text-slate-200">
              See your opportunity waste, your platform coverage gaps and the renewals you are not
              tracking, scored and prioritized. No cost, no obligation.
            </p>
            <Link
              href="/government-opportunity-intelligence-report"
              className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-300 hover:text-brand-800"
            >
              Request your report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-ink-900 ${className}`}>
      <div className="container py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-700 to-ink-900 px-6 py-12 sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow text-brand-300">Free assessment</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold text-white sm:text-4xl">
                Get your free Government Opportunity Intelligence Report
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                In one report you will see exactly where your team is wasting estimator time, which
                platforms you are under-covering, and which contracts are about to rebid in your
                market.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/government-opportunity-intelligence-report" className="btn-gold px-6 py-3 text-base">
                  Get your free report
                </Link>
                <Link
                  href="/opportunity-waste-calculator"
                  className="btn-ghost border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:border-white/40 hover:text-white"
                >
                  Calculate your opportunity waste
                </Link>
              </div>
            </div>
            <ul className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              {GOIR_INCLUDES.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
