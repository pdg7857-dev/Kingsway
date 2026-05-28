import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number; // percent
  tone?: "default" | "accent" | "violet" | "success" | "warn" | "danger";
  icon?: React.ReactNode;
  className?: string;
};

export function KpiCard({ label, value, hint, delta, tone = "default", icon, className }: KpiCardProps) {
  const ring: Record<string, string> = {
    default: "ring-border",
    accent: "ring-accent/40",
    violet: "ring-violet/40",
    success: "ring-success/40",
    warn: "ring-warn/40",
    danger: "ring-danger/40",
  };
  const iconTint: Record<string, string> = {
    default: "text-fg-muted",
    accent: "text-accent",
    violet: "text-violet",
    success: "text-success",
    warn: "text-warn",
    danger: "text-danger",
  };
  return (
    <div
      className={cn(
        "panel lift overflow-hidden p-4 ring-1",
        ring[tone],
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</div>
        {icon ? <div className={cn("grid h-7 w-7 place-items-center rounded-lg bg-bg-raised/70 ring-1 ring-border", iconTint[tone])}>{icon}</div> : null}
      </div>
      <div className="mt-2.5 stat-value">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1",
              delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-fg-subtle"
            )}
          >
            {delta > 0 ? <TrendingUp className="h-3 w-3" /> : delta < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {(delta > 0 ? "+" : "") + delta.toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="text-fg-subtle truncate">{hint}</span> : null}
      </div>
    </div>
  );
}
