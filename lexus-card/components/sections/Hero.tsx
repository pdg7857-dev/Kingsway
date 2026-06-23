import { config, links } from '@/lib/config';
import { Eyebrow } from '../ui/Eyebrow';
import { Button } from '../ui/Button';

/**
 * Hero — §7.2. Full-viewport cinematic media slot with a slow Ken-Burns
 * drift, gradient scrim for legibility, masked headline reveal, and a
 * thin animated scroll cue.
 *
 * Phase 1 uses a CSS gradient placeholder in place of /public/hero-poster.jpg
 * so the *feel* can be judged before real assets land. Replace the
 * background layer with <Image priority> + a muted, playsinline video in
 * later phases (see /public/README).
 */
export function Hero() {
  const headline = ['The right Lexus.', 'Found for you.'];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      {/* Background media slot — Ken-Burns drift. */}
      <div className="absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute inset-0 animate-ken-burns will-change-transform"
          style={{
            // PLACEHOLDER: swap for next/image hero-poster.jpg.
            background:
              'radial-gradient(120% 100% at 70% 10%, #2a2c2f 0%, #161719 45%, #0a0a0a 100%)',
          }}
        />
        {/* Fine metallic sheen line, evokes a body panel highlight. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-[62%] w-px bg-gradient-to-b from-transparent via-silver/25 to-transparent"
        />
      </div>

      {/* Bottom + top scrims for text legibility. */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-ink/70 to-transparent"
      />

      {/* Content */}
      <div className="shell relative z-20 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <div className="animate-rise-in" style={{ animationDelay: '120ms' }}>
            <Eyebrow tone="silver">
              {config.dealership} · {config.city}
            </Eyebrow>
          </div>

          <h1 className="mt-7 text-hero text-white">
            {headline.map((line, i) => (
              // Clip-mask reveal: each line rises from behind its own mask.
              <span key={line} className="block overflow-hidden">
                <span
                  className="block animate-rise-in"
                  style={{ animationDelay: `${260 + i * 120}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-7 max-w-xl animate-rise-in text-body text-white/70"
            style={{ animationDelay: '520ms' }}
          >
            Concierge sourcing for new and certified pre-owned Lexus — plus a
            private match service that calls you the moment your exact vehicle
            arrives.
          </p>

          <div
            className="mt-10 flex animate-rise-in flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '640ms' }}
          >
            <Button href="#match" variant="ghost" className="bg-white !text-ink hover:!bg-white/90 border-white">
              Request a Vehicle
            </Button>
            <Button href={links.vcard} download variant="ghost">
              Save My Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[0.65rem] uppercase tracking-widest">Scroll</span>
          <span
            aria-hidden
            className="h-8 w-px animate-scroll-cue bg-gradient-to-b from-white/60 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
