"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { CANADA_PLANS, USA_PLANS, type Plan } from "@/lib/site/pricing";
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
