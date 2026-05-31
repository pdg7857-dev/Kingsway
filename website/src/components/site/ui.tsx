import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SOCIAL_PROOF, SITE } from "@/lib/site/config";

export function Section({
  children,
  className = "",
  muted = false,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  dark?: boolean;
}) {
  const bg = dark ? "bg-ink-900 text-slate-200" : muted ? "bg-paper-soft" : "bg-paper";
  return (
    <section className={`${bg} ${className}`}>
      <div className="container py-16 sm:py-20">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  center = false,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-brand-300" : ""}`}>{eyebrow}</p>}
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${dark ? "text-white" : "text-white"}`}>
        {title}
      </h2>
      {lede && (
        <p className={`mt-4 text-lg leading-8 ${dark ? "text-slate-300" : "text-slate-300"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="hover:text-brand-300">
                {it.name}
              </Link>
            ) : (
              <span className="text-white">{it.name}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Social-proof strip. Renders placeholders; never fabricates numbers. */
export function StatStrip({ dark = false }: { dark?: boolean }) {
  const items = SOCIAL_PROOF.slice(0, 5);
  return (
    <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-5 ${dark ? "border-white/10 bg-white/10" : "border-line bg-line"}`}>
      {items.map((s) => (
        <div key={s.label} className={`${dark ? "bg-ink-900" : "bg-paper-muted"} p-5 text-center`}>
          <div className={`text-2xl font-bold tabular-nums ${dark ? "text-white" : "text-white"}`}>
            {s.value ?? s.placeholder}
          </div>
          <div className={`mt-1 text-xs leading-snug ${dark ? "text-slate-400" : "text-slate-400"}`}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Final call-to-action band used at the bottom of most pages. */
export function CtaBand({
  title = "Stop wasting estimator time on the wrong bids.",
  sub = "Get your free Government Opportunity Intelligence Report and see your opportunity waste, coverage gaps and upcoming renewals, specific to your business.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="bg-ink-900">
      <div className="container py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-700 to-ink-900 px-6 py-12 text-center sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">{sub}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/government-opportunity-intelligence-report" className="btn-gold px-6 py-3 text-base">
                Get your free GOIR
              </Link>
              <Link href="/opportunity-waste-calculator" className="btn-ghost border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:border-white/40 hover:text-white">
                Calculate your opportunity waste
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Prefer to talk first?{" "}
              <Link href={SITE.bookingUrl} className="font-medium text-brand-300 hover:text-white">
                Book a strategy call
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      {Icon && (
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{children}</p>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper-soft px-3 py-1 text-xs font-medium text-slate-200">
      {children}
    </span>
  );
}
