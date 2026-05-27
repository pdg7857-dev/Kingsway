import Link from "next/link";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import { cn, fmtCents, businessDotBg } from "@/lib/utils";
import type { Business } from "@prisma/client";

export function BusinessHealthGrid({
  snapshots,
}: {
  snapshots: { business: Business; revenueCents: number; expensesCents: number; profitCents: number; score: number }[];
}) {
  return (
    <Panel>
      <PanelHeader title="Business health" hint="Score, revenue, profit — last 30 days" />
      <PanelBody className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {snapshots.map(({ business, revenueCents, profitCents, score }) => {
          const meta = BUSINESS_BY_SLUG[business.slug];
          const tone: "success" | "warn" | "danger" | "accent" =
            score >= 70 ? "success" : score >= 50 ? "warn" : score < 30 ? "danger" : "accent";
          return (
            <Link
              key={business.id}
              href={meta?.href ?? "#"}
              className="group relative overflow-hidden rounded-xl border border-border bg-bg-raised/40 p-3 hover:bg-bg-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={cn("dot", businessDotBg[business.slug])} />
                <div className="text-sm font-medium text-fg truncate">{business.name}</div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-2xl font-mono font-semibold">{score}</div>
                <div className="text-[10px] uppercase tracking-widest text-fg-subtle">score</div>
              </div>
              <Progress value={score} tone={tone} className="mt-1" />
              <div className="mt-3 grid grid-cols-2 gap-1 text-[11px]">
                <div className="text-fg-subtle">Revenue</div>
                <div className="text-right text-fg">{fmtCents(revenueCents)}</div>
                <div className="text-fg-subtle">Profit</div>
                <div className={cn("text-right", profitCents >= 0 ? "text-success" : "text-danger")}>{fmtCents(profitCents)}</div>
              </div>
            </Link>
          );
        })}
      </PanelBody>
    </Panel>
  );
}
