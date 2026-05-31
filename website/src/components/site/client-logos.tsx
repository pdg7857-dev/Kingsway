const CLIENTS = ["Bell", "Rogers", "RBC", "Google", "Hyundai", "Purolator", "CIBC", "Moneris", "CBC"];

/**
 * Single full-width row (1 x 9) of organizations Phil Dave has worked with in
 * eProcurement. Black section with a lighter-navy / blue accent. Rendered as
 * clean typographic wordmarks (no logo assets) to stay trademark-safe.
 * On narrow screens the row scrolls horizontally.
 */
export function ClientLogos() {
  return (
    <section className="border-y border-brand-500/20 bg-[#04060e]">
      <div className="container py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
          Companies I have worked with in eProcurement
        </p>
        <div className="mt-7 flex items-stretch divide-x divide-brand-500/15 overflow-x-auto">
          {CLIENTS.map((name) => (
            <div
              key={name}
              className="flex min-w-[7rem] flex-1 items-center justify-center px-3 py-4 text-center text-lg font-semibold tracking-tight text-brand-300 transition hover:text-brand-200 sm:min-w-0"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
