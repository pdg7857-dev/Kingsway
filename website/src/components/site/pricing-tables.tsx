"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { CANADA_PLANS, USA_PLANS, NORTH_AMERICA_PLAN, type Plan } from "@/lib/site/pricing";
import { SITE } from "@/lib/site/config";

export function PricingTables() {
  const [country, setCountry] = useState<"canada" | "usa">("canada");
  const plans = country === "canada" ? CANADA_PLANS : USA_PLANS;

  return (
    <div>
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-border bg-bg-panel p-1">
        <Toggle active={country === "canada"} onClick={() => setCountry("canada")}>
          Canada
        </Toggle>
        <Toggle active={country === "usa"} onClick={() => setCountry("usa")}>
          United States
        </Toggle>
      </div>

      <div
        className={`grid gap-6 ${plans.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} md:grid-cols-2`}
      >
        {plans.map((p) => (
          <PlanCard key={p.name} plan={p} />
        ))}
      </div>

      {/* Cross-border plan, shown on both toggles */}
      <CrossBorderCard />

      <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-fg-muted">
        All plans are a <span className="font-semibold text-fg">12-month commitment, billed monthly</span>. It
        takes a full year to catch your complete opportunity cycle — annual renewals and the seasonal
        bids that only come around once.
      </p>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        active ? "bg-bg-panel text-fg" : "text-fg-muted hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function CrossBorderCard() {
  const plan = NORTH_AMERICA_PLAN;
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-accent/40 bg-bg-panel p-6 shadow-lift ring-1 ring-accent/30 sm:p-8">
      <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-fg">
        Both countries
      </span>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h3 className="text-xl font-semibold text-fg">{plan.name}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-fg-muted">{plan.scope}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-fg">{plan.price}</span>
            <span className="text-sm text-fg-muted">{plan.priceNote}</span>
          </div>
          <p className="mt-1 text-xs font-medium text-fg-subtle">12-month commitment</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-fg-muted">{plan.blurb}</p>
          <Link href={SITE.bookingUrl} className="btn-primary mt-6 px-5 py-2.5">
            Start with this plan
          </Link>
        </div>
        <ul className="space-y-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        plan.featured
          ? "border-accent bg-bg-panel shadow-lift ring-1 ring-accent"
          : "border-border bg-bg-panel shadow-card"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-fg">
          Most popular
        </span>
      )}
      <h3 className="text-base font-semibold text-fg">{plan.name}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-fg-muted">{plan.scope}</p>
      <div className="mt-4 flex items-baseline gap-1">
        {plan.startingAt && <span className="text-sm text-fg-muted">from</span>}
        <span className="text-3xl font-bold text-fg">{plan.price}</span>
        <span className="text-sm text-fg-muted">{plan.priceNote}</span>
      </div>
      <p className="mt-1 text-xs font-medium text-fg-subtle">12-month commitment</p>
      <p className="mt-3 text-sm leading-6 text-fg-muted">{plan.blurb}</p>
      <ul className="mt-5 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={SITE.bookingUrl}
        className={`mt-6 w-full ${plan.featured ? "btn-primary" : "btn-ghost"} py-2.5`}
      >
        Start with this plan
      </Link>
    </div>
  );
}
