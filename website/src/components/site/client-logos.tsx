const CLIENTS = ["Bell", "Rogers", "RBC", "Google", "Hyundai", "Purolator", "CIBC", "Moneris", "CBC"];

/**
 * Wordmark strip of organizations Phil Dave has worked with in eProcurement.
 * Rendered as clean typographic wordmarks (no logo assets) to stay
 * trademark-safe and on-brand.
 */
export function ClientLogos() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="container py-14">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
          Companies I have worked with in eProcurement
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 md:grid-cols-3">
          {CLIENTS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center bg-paper-soft px-4 py-7 text-lg font-semibold tracking-tight text-slate-300 transition hover:text-white"
            >
              {name}
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">
          Enterprise procurement experience that informs how I read government opportunities.
        </p>
      </div>
    </section>
  );
}
