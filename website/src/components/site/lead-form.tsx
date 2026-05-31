"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type Variant = "call" | "sample" | "guide";

const HEADINGS: Record<Variant, { title: string; sub: string; cta: string }> = {
  call: {
    title: "Book a discovery call",
    sub: "Tell me where you bid and what you chase. I will come to the call with real opportunities you can see.",
    cta: "Request my call",
  },
  sample: {
    title: "Request a sample opportunity",
    sub: "Send me your trade and jurisdiction. I will send back a live opportunity, reviewed and qualified the way I do it for clients.",
    cta: "Send my sample",
  },
  guide: {
    title: "Get the guide",
    sub: "Enter your email and I will send it over, plus the occasional note on where opportunities are hiding.",
    cta: "Email me the guide",
  },
};

export function LeadForm({
  variant = "call",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const copy = HEADINGS[variant];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend is wired yet. This stores intent client-side and shows a
    // confirmation; an operator connects this to email/CRM before launch.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`card p-8 text-center ${className}`}>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-fg">Got it. Talk soon.</h3>
        <p className="mt-2 text-sm text-fg-muted">
          Thanks for reaching out. I read every message myself and reply personally, usually the
          same business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`card p-6 sm:p-8 ${className}`}>
      <h3 className="text-xl font-semibold text-fg">{copy.title}</h3>
      <p className="mt-1.5 text-sm text-fg-muted">{copy.sub}</p>

      <div className="mt-6 space-y-4">
        {variant !== "guide" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required />
            <Field label="Company" name="company" required />
          </div>
        )}
        <Field label="Work email" name="email" type="email" required />
        {variant !== "guide" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trade or industry" name="industry" placeholder="e.g. janitorial" />
              <Field label="Where you bid" name="region" placeholder="e.g. Ontario + NY" />
            </div>
            <label className="block">
              <span className="text-sm font-medium text-fg">What are you chasing?</span>
              <textarea
                name="notes"
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent"
                placeholder="A sentence or two on the work you want more of."
              />
            </label>
          </>
        )}
      </div>

      <button type="submit" className="btn-primary mt-6 w-full py-3 text-base">
        {copy.cta}
      </button>
      <p className="mt-3 text-center text-xs text-fg-subtle">
        No spam, no list-selling. Your details come straight to me.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-fg">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
