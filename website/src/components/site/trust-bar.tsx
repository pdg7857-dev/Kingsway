import { ShieldCheck, Layers, Map, Globe2, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "Independent & platform-agnostic" },
  { icon: Layers, label: "18+ procurement platforms monitored" },
  { icon: Map, label: "63 jurisdictions covered" },
  { icon: Globe2, label: "Canada + United States" },
  { icon: BadgeCheck, label: "Federal, provincial, state & local" },
];

/**
 * Institutional credential strip. Conveys authority and scope with restrained,
 * government-grade markers rather than fabricated metrics.
 */
export function TrustBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg border md:grid-cols-5 ${
        dark ? "border-white/10 bg-white/10" : "border-line bg-line"
      }`}
    >
      {ITEMS.map((it) => (
        <div
          key={it.label}
          className={`flex items-center gap-2.5 p-4 ${dark ? "bg-ink-900 text-slate-200" : "bg-paper-muted text-slate-200"}`}
        >
          <it.icon className={`h-5 w-5 shrink-0 ${dark ? "text-brand-300" : "text-brand-600"}`} />
          <span className="text-[13px] font-medium leading-tight">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
