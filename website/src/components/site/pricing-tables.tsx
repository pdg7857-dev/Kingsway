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
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-line bg-white p-1">
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
        active ? "bg-ink text-white" : "text-ink-700 hover:text-brand-700"
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
          ? "border-brand-500 bg-white shadow-lift ring-1 ring-brand-500"
          : "border-line bg-white shadow-card"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <h3 className="text-base font-semibold text-ink">{plan.name}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{plan.scope}</p>
      <div className="mt-4 flex items-baseline gap-1">
        {plan.startingAt && <span className="text-sm text-slate-500">from</span>}
        <span className="text-3xl font-bold text-ink">{plan.price}</span>
        <span className="text-sm text-slate-500">{plan.priceNote}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{plan.blurb}</p>
      <ul className="mt-5 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-ink-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {plan.footnote && (
        <p className="mt-4 rounded-md bg-paper-soft px-3 py-2 text-xs leading-snug text-slate-500">
          {plan.footnote}
        </p>
      )}
      <Link
        href={SITE.bookingUrl}
        className={`mt-4 w-full ${plan.featured ? "btn-primary" : "btn-ghost"} py-2.5`}
      >
        Start with this plan
      </Link>
    </div>
  );
}
