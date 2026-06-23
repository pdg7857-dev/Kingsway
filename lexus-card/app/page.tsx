import { Header } from '@/components/Header';
import { Hero } from '@/components/sections/Hero';
import { config } from '@/lib/config';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Sections 7.3–7.8 are added in Phases 3–5. */}
        <section className="bg-mist py-section">
          <div className="shell">
            <p className="eyebrow">Phase 1 · scaffold</p>
            <p className="mt-6 max-w-2xl font-display text-h2 font-light text-ink">
              Hero is in. The remaining sections — pillars, the pinned vehicle
              showcase, match explainer, contact card and request wizard —
              follow in the next phases.
            </p>
          </div>
        </section>
      </main>

      {/* Legal / affiliation disclaimer — §1 guardrail (final styling in Phase 5). */}
      <footer className="bg-ink py-16 text-white/60">
        <div className="shell space-y-4">
          <p className="font-display text-sm uppercase tracking-widest text-white">
            {config.fullName}
          </p>
          <p className="max-w-3xl text-caption leading-relaxed">
            Independent site of {config.fullName}, a sales consultant at{' '}
            {config.dealership}. Not affiliated with or endorsed by Lexus Canada
            / Toyota Canada Inc. Lexus and all model names are trademarks of
            their respective owners.
          </p>
          <p className="text-caption text-white/40">
            © {new Date().getFullYear()} · Built for {config.fullName}.
          </p>
        </div>
      </footer>
    </>
  );
}
