import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2 } from "lucide-react";
import { INDUSTRIES, PRIMARY_INDUSTRIES } from "@/lib/site/industries";
import { Breadcrumbs, CtaBand, Section, SectionHead } from "@/components/site/ui";
import { pageMeta, JsonLd, breadcrumbJsonLd } from "@/lib/site/seo";

export const metadata: Metadata = pageMeta({
  title: "Industries: Government Contract Opportunity Intelligence by Trade",
  description:
    "Construction, janitorial, facilities, HVAC, electrical, plumbing and more. See how I find and qualify government opportunities for your specific trade.",
  path: "/industries",
  keywords: ["government contracts by industry", "trade government bids", "contractor opportunity intelligence"],
});

export default function IndustriesIndex() {
  const secondary = INDUSTRIES.filter((i) => !i.primary);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} />
      <section className="border-b border-line bg-ink-900">
        <div className="container py-14">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Industries" }]} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Built around how your trade actually gets bid
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              A roofing job and a janitorial contract are not found the same way. They live on
              different platforms, hide under different titles, and run on different cycles. Pick
              your trade to see where the work lives and how it slips past contractors who only
              search.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHead eyebrow="Primary focus" title="Industries I work with most" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_INDUSTRIES.map((i) => (
            <Link key={i.slug} href={`/industries/${i.slug}`} className="card group p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink group-hover:text-brand-700">{i.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{i.oneLiner}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Read the guide <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHead eyebrow="Also covered" title="Specialized trades and services" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((i) => (
            <Link
              key={i.slug}
              href={`/industries/${i.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 hover:border-brand-300"
            >
              <span className="font-medium text-ink">{i.name}</span>
              <ArrowRight className="h-4 w-4 text-brand-600" />
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
