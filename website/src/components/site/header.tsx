"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, Mail, MapPin } from "lucide-react";
import { PRIMARY_NAV, SITE } from "@/lib/site/config";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Institutional utility bar */}
      <div className="hidden border-b border-white/10 bg-ink-900 text-slate-300 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-300" />
            Government Opportunity Intelligence for Canada and the United States
          </span>
          <div className="flex items-center gap-5">
            <span className="text-slate-400">Independent. Platform-agnostic. Since {SITE.founded}.</span>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.brand} home`}>
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-sm font-bold tracking-tight text-white ring-1 ring-inset ring-white/15">
              {SITE.monogram}
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-ink">{SITE.brand}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                Government Opportunity Intelligence
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {PRIMARY_NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:text-brand-700"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                  <div className="invisible absolute left-0 top-full w-72 translate-y-1 rounded-lg border border-line bg-white p-2 opacity-0 shadow-lift transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-md px-3 py-2 text-sm text-ink-700 transition hover:bg-paper-soft hover:text-brand-700"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/opportunity-waste-calculator" className="btn-ghost px-4 py-2 text-sm">
              Waste calculator
            </Link>
            <Link href="/government-opportunity-intelligence-report" className="btn-primary px-4 py-2 text-sm">
              Free GOIR
            </Link>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-line lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-line bg-white lg:hidden">
            <div className="container space-y-1 py-4">
              {PRIMARY_NAV.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-semibold text-ink"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 border-l border-line pl-3">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-md px-3 py-1.5 text-sm text-ink-700"
                          onClick={() => setMobileOpen(false)}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-3">
                <Link href="/opportunity-waste-calculator" className="btn-ghost flex-1 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                  Waste calc
                </Link>
                <Link href="/government-opportunity-intelligence-report" className="btn-primary flex-1 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                  Free GOIR
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
