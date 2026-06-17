import { cn } from "@/lib/utils";
import { TIER_META, scoreLabel, type ProspectTier } from "@/lib/oi/constants";

const toneClass: Record<string, string> = {
  success: "bg-success-soft text-success ring-1 ring-success/30",
  accent: "bg-accent-soft text-accent ring-1 ring-accent/30",
  info: "bg-info-soft text-info ring-1 ring-info/30",
  warn: "bg-warn-soft text-warn ring-1 ring-warn/30",
  danger: "bg-danger-soft text-danger ring-1 ring-danger/30",
  muted: "bg-bg-raised text-fg-muted ring-1 ring-border",
};

export function TierBadge({ tier, className }: { tier?: string | null; className?: string }) {
  if (!tier || !(tier in TIER_META)) return <span className={cn("pill", toneClass.muted, className)}>Unscored</span>;
  const meta = TIER_META[tier as ProspectTier];
  return (
    <span className={cn("pill", toneClass[meta.tone] ?? toneClass.muted, className)} title={meta.blurb}>
      {meta.label} · {meta.action}
    </span>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "hsl(150 70% 50%)";
  if (score >= 70) return "hsl(186 100% 55%)";
  if (score >= 60) return "hsl(210 90% 60%)";
  return "hsl(220 10% 50%)";
}

export function ScoreRing({ score, size = 84, label }: { score: number; size?: number; label?: string }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const color = scoreColor(score);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(220 14% 20%)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute text-center leading-none">
        <div className="font-mono font-semibold" style={{ color, fontSize: size * 0.28 }}>{score}</div>
        <div className="text-[8px] uppercase tracking-wider text-fg-subtle mt-0.5">{label ?? "Index"}</div>
      </div>
    </div>
  );
}

export function MiniScore({ score }: { score?: number | null }) {
  if (score == null) return <span className="font-mono text-fg-subtle">—</span>;
  return (
    <span className="font-mono font-semibold tabular-nums" style={{ color: scoreColor(score) }}>
      {score}
    </span>
  );
}

/** A single weighted component of the GOII Index™. */
export function ComponentBar({ label, points, max, note }: { label: string; points: number; max: number; note?: string }) {
  const pct = max ? (points / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-fg-muted truncate">{label}</span>
        <span className="font-mono text-xs text-fg shrink-0">{points}<span className="text-fg-subtle">/{max}</span></span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-bg-raised overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 66 ? "hsl(150 70% 50%)" : pct >= 33 ? "hsl(186 100% 55%)" : "hsl(220 10% 50%)" }} />
      </div>
      {note ? <div className="mt-0.5 text-[10px] text-fg-subtle truncate">{note}</div> : null}
    </div>
  );
}

export function scoreBand(score: number): string {
  return scoreLabel(score);
}
