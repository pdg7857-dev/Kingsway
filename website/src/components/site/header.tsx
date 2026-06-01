"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { PRIMARY_NAV, SITE } from "@/lib/site/config";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.brand} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-black text-[15px] font-extrabold leading-none tracking-[-0.06em] text-white ring-1 ring-white/15">
            PD
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-fg">GovOpps</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              by Phil Dave
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-accent"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Link>
                <div className="invisible absolute left-0 top-full w-64 translate-y-1 rounded-xl border border-border bg-bg-panel p-2 opacity-0 shadow-lift transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-lg px-3 py-2 text-sm text-fg-muted transition hover:bg-bg-subtle hover:text-accent"
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
                className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition hover:text-accent"
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
          <Link href={SITE.bookingUrl} className="btn-primary px-4 py-2 text-sm">
            Book a call
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-bg-panel lg:hidden">
          <div className="container space-y-1 py-4">
            {PRIMARY_NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-fg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3 py-1.5 text-sm text-fg-muted"
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
              <Link href={SITE.bookingUrl} className="btn-primary flex-1 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>
                Book a call
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
