import { config } from '@/lib/config';
import { Button } from './ui/Button';

const NAV = [
  { label: 'Inventory Match', href: '#match' },
  { label: 'New', href: '#new' },
  { label: 'Pre-Owned', href: '#preowned' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Phase 1: static transparent header over the hero.
 * Scroll-solidify + hide-on-scroll-down behaviour is added in Phase 9.
 */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="shell flex h-20 items-center justify-between">
        <a
          href="#top"
          className="font-display text-sm font-medium uppercase tracking-widest text-white"
        >
          {config.fullName}
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="underline-draw text-caption uppercase tracking-wide text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <Button href="#match" variant="ghost" className="px-5 py-3">
            Request a Vehicle
          </Button>
        </nav>

        {/* Mobile: full overlay menu added in Phase 3. */}
        <a
          href="#match"
          className="text-caption uppercase tracking-wide text-white lg:hidden"
        >
          Request
        </a>
      </div>
    </header>
  );
}
