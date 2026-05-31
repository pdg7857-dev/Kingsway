import {
  Banknote,
  Wrench,
  ClipboardCheck,
  Clock,
  Swords,
  Network,
  Compass,
  XCircle,
} from "lucide-react";
import { NO_BID_LIBRARY, SCREENING_CHECKLIST } from "@/lib/site/no-bid";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Financial: Banknote,
  Capability: Wrench,
  Compliance: ClipboardCheck,
  Timing: Clock,
  Competitive: Swords,
  Administrative: Network,
  Strategic: Compass,
};

export function NoBidLibrary() {
  return (
    <div className="not-prose">
      {/* Seven categories of no-bid factors */}
      <div className="grid gap-5 sm:grid-cols-2">
        {NO_BID_LIBRARY.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.title] ?? XCircle;
          return (
            <div key={cat.title} className="card flex flex-col p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-semibold text-ink">{cat.title}</h4>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{cat.intro}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {cat.factors.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center rounded-full border border-line bg-paper-soft px-2.5 py-1 text-xs font-medium text-ink-700"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Early-screening checklist */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-ink sm:text-2xl">
          The early-screening checklist
        </h3>
        <p className="mt-2 max-w-2xl text-[1.0625rem] leading-7 text-slate-600">
          These are the questions I run first. A wrong answer to any of them is usually
          an early no, before a single estimator hour goes in.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ink-900 text-slate-200">
                <th className="px-4 py-3 font-semibold">Screening question</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Disqualifier</th>
                <th className="px-4 py-3 font-semibold">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {SCREENING_CHECKLIST.map((c, i) => (
                <tr
                  key={c.disqualifier}
                  className={`align-top border-t border-line ${i % 2 === 1 ? "bg-paper-soft" : "bg-white"}`}
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {c.question}
                    <span className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-gold-600 sm:hidden">
                      <XCircle className="h-3.5 w-3.5" />
                      {c.disqualifier}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-gold-600">
                      <XCircle className="h-3.5 w-3.5" />
                      {c.disqualifier}
                    </span>
                  </td>
                  <td className="px-4 py-3 leading-6 text-slate-600">{c.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
