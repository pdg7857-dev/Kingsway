import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/ui/kpi-card";
import { fmtCents } from "@/lib/utils";
import { DollarSign, TrendingDown, TrendingUp, ListTodo } from "lucide-react";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import type { BusinessSlug } from "@prisma/client";

export function BusinessHeader({
  slug,
  subtitle,
  revenue,
  expenses,
  profit,
  openTasks,
}: {
  slug: BusinessSlug;
  subtitle: string;
  revenue: number;
  expenses: number;
  profit: number;
  openTasks: number;
}) {
  const meta = BUSINESS_BY_SLUG[slug];
  return (
    <>
      <Topbar title={`${meta?.emoji ?? ""} ${meta?.name ?? slug}`} subtitle={subtitle} />
      <div className="px-4 lg:px-6 pt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue · 30d" value={fmtCents(revenue)} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Expenses · 30d" value={fmtCents(expenses)} tone="warn" icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Profit · 30d" value={fmtCents(profit)} tone={profit >= 0 ? "success" : "danger"} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Open tasks" value={openTasks} icon={<ListTodo className="h-4 w-4" />} />
      </div>
    </>
  );
}
