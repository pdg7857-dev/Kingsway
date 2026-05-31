const CLIENTS = ["Bell", "Rogers", "RBC", "Google", "Hyundai", "Purolator", "CIBC", "Moneris", "CBC"];

/**
 * Single full-width row (1 x 9) of organizations Phil Dave has worked with in
 * eProcurement. Light section with a blue accent, matching the white-and-blue
 * theme. Rendered as clean typographic wordmarks (no logo assets) to stay
 * trademark-safe. On narrow screens the row scrolls horizontally.
 */
export function ClientLogos() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Companies I have worked with in eProcurement
        </p>
        <div className="mt-7 flex items-stretch divide-x divide-line overflow-x-auto">
          {CLIENTS.map((name) => (
            <div
              key={name}
              className="flex min-w-[7rem] flex-1 items-center justify-center px-3 py-4 text-center text-lg font-semibold tracking-tight text-brand-700 transition hover:text-brand-800 sm:min-w-0"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
