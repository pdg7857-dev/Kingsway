import { Star, Quote } from "lucide-react";
import { RATING, TESTIMONIALS } from "@/lib/site/testimonials";
import { Section, SectionHead } from "@/components/site/ui";

/** Five stars with a partial fill representing `rating` out of 5. */
export function Stars({ rating = RATING.score, className = "h-4 w-4" }: { rating?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="relative inline-flex" role="img" aria-label={`${rating} out of 5 stars`}>
      <span className="flex text-fg-subtle/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={className} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="absolute inset-0 flex overflow-hidden text-warn" style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`${className} shrink-0`} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

/** Compact inline rating badge: ★★★★★ 4.8/5 from 44 clients. */
export function RatingBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Stars />
      <span className="text-sm font-semibold text-fg">{RATING.score.toFixed(1)}/5</span>
      <span className="text-sm text-fg-muted">from {RATING.count} clients</span>
    </span>
  );
}

/** Full testimonials section for the home page. */
export function TestimonialsSection() {
  return (
    <Section>
      <SectionHead center eyebrow="Client reviews" title={`Rated ${RATING.score.toFixed(1)} out of 5`} />
      <div className="mx-auto mt-4 flex flex-col items-center gap-2">
        <Stars className="h-6 w-6" />
        <p className="text-sm text-fg-muted">
          From {RATING.count} contractors I have worked with in government opportunity intelligence.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <figure key={t.quote} className="card flex flex-col p-6">
            <Quote className="h-6 w-6 text-accent/60" />
            <blockquote className="mt-3 flex-1 text-lg leading-7 text-fg">{t.quote}</blockquote>
            <figcaption className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-fg-muted">{t.attribution}</span>
              <Stars />
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
