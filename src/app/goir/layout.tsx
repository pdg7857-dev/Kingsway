import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Opportunity Intelligence Report™",
  description:
    "The free procurement intelligence assessment for companies pursuing government contracts. Get your Government Opportunity Intelligence Index™, opportunity-waste analysis, platform coverage, and action plan in seconds.",
};

export default function GoirLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <Link href="/goir" className="flex items-center gap-2.5">
            <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet shadow-[0_0_20px_-4px_hsl(184_100%_52%_/_0.7)]">
              <span className="font-mono text-[11px] font-bold text-bg">GO</span>
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold tracking-tight text-fg">Government Opportunity Intelligence</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-fg-subtle">Report™ · Index™</div>
            </div>
          </Link>
          <Link
            href="/goir"
            className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-medium text-bg shadow-[0_0_24px_-8px_hsl(186_100%_55%_/_0.6)] hover:bg-accent-glow transition-colors"
          >
            Get my report
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6 text-xs text-fg-subtle">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>Government Opportunity Intelligence Report™ — a free assessment for government contractors.</p>
            <p>Estimates are modeled from the information you provide and public-sector benchmarks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
