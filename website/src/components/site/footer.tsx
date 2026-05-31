import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/site/config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink-900 text-slate-300">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(5,minmax(0,1fr))]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-paper-muted text-sm font-bold text-white">
                P
              </span>
              <span className="text-sm font-bold text-white">{SITE.brand}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              I find, read and qualify government contract opportunities across Canada and the
              United States, so your team stops searching portals and starts bidding the work
              that is actually worth pursuing.
            </p>
            <Link href={SITE.bookingUrl} className="btn-gold mt-5 px-4 py-2 text-sm">
              Book a discovery call
            </Link>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {SITE.brandFull}. Independent opportunity-intelligence practice. Not
            affiliated with any procurement platform or government body.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/contact" className="hover:text-slate-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
