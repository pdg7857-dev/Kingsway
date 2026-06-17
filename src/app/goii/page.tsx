import type { Metadata } from "next";
import { PublicCalculator } from "@/components/oi/public-calculator";
import { Gauge, Search, FileCheck2, CalendarClock, Layers, Building2, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Government Opportunity Intelligence Index™ & Opportunity Waste Calculator",
  description:
    "See your Government Opportunity Intelligence Index™ and estimate how much your team wastes reviewing opportunities that never become bids.",
};

const leadMagnets = [
  { icon: Gauge, title: "Government Opportunity Score", desc: "Your GOII Index™, 0-100." },
  { icon: FileCheck2, title: "Bid Qualification Checklist", desc: "Bid / no-bid in minutes." },
  { icon: Search, title: "Opportunity Waste Calculator", desc: "What you're spending on dead-end bids." },
  { icon: Building2, title: "Government Contract Opportunity Report", desc: "Live opportunities for your firm." },
  { icon: Layers, title: "MERX · BidNet · CanadaBuys Guides", desc: "Monitor the right platforms." },
  { icon: CalendarClock, title: "Renewal Intelligence Report", desc: "Contracts rebidding near you." },
];

export default function GoiiLanding() {
  return (
    <main className="min-h-dvh bg-bg text-fg">
      {/* Nav */}
      <header className="border-b border-border-subtle">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-violet shadow-[0_0_24px_-4px_hsl(184_100%_52%_/_0.7)]">
              <span className="font-mono text-[11px] font-bold text-bg">GO</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-gradient-accent">Government Opportunity Intelligence</div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-fg-subtle">Platforms show opportunities. We find the ones worth pursuing.</div>
            </div>
          </div>
          <a href="#score" className="pill bg-accent-soft text-accent ring-1 ring-accent/30">Get my score</a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 pill bg-bg-raised ring-1 ring-border text-fg-subtle mb-5">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Government Opportunity Intelligence Index™
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Stop wasting estimator time on bids that <span className="text-gradient-accent">never should have been pursued.</span>
        </h1>
        <p className="mt-5 text-fg-muted max-w-2xl mx-auto">
          Most contractors already see plenty of government opportunities. The cost isn't finding more —
          it's the hours your team burns reviewing the wrong ones. See your score and your annual opportunity waste in 30 seconds.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <a href="#score" className="h-11 px-6 rounded-xl bg-accent text-bg font-medium grid place-items-center hover:bg-accent-glow">Calculate my opportunity waste</a>
          <a href="#how" className="h-11 px-6 rounded-xl ring-1 ring-border text-fg grid place-items-center hover:bg-bg-hover">How it works</a>
        </div>
      </section>

      {/* Calculator */}
      <section id="score" className="mx-auto max-w-6xl px-4 sm:px-6 py-8 scroll-mt-20">
        <PublicCalculator />
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-center mb-2">The Government Opportunity Intelligence Index™</h2>
        <p className="text-sm text-fg-subtle text-center max-w-2xl mx-auto mb-8">
          A single 0-100 score built from government experience, award history, opportunity waste, labor scarcity,
          platform & geographic complexity, renewal opportunity, and revenue potential.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {leadMagnets.map((m) => (
            <div key={m.title} className="panel p-5">
              <m.icon className="h-5 w-5 text-accent" />
              <div className="mt-3 text-sm font-medium">{m.title}</div>
              <div className="text-xs text-fg-subtle mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we do / don't */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="panel p-6">
            <div className="text-sm font-semibold text-success mb-3">What we do</div>
            <ul className="space-y-1.5 text-sm text-fg-muted">
              {["Find & monitor government opportunities", "Review bid documents and flag requirements", "Screen and qualify opportunities", "Detect red flags before you commit", "Summarize opportunities into one-page briefs", "Predict renewals before they post"].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-success">✓</span> {x}</li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <div className="text-sm font-semibold text-fg-subtle mb-3">What we don't do</div>
            <ul className="space-y-1.5 text-sm text-fg-muted">
              {["Write your proposals", "Submit your bids", "Replace your procurement platforms", "Manage your procurement process"].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-fg-subtle">—</span> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-xs text-fg-subtle flex flex-wrap items-center justify-between gap-2">
          <span>Government Opportunity Intelligence Index™ — platforms show opportunities; we find the ones worth pursuing.</span>
          <a href="#score" className="text-accent">Get my score →</a>
        </div>
      </footer>
    </main>
  );
}
