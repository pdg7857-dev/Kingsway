import { fmtCents, isOverdue, relTime, cn } from "@/lib/utils";

export function CostList({
  rows,
}: {
  rows: { id: string; vendor: string; amountCents: number; dueAt: Date | null; tag?: string; danger?: boolean }[];
}) {
  if (!rows.length) return <div className="text-sm text-fg-subtle py-2">No upcoming costs in window.</div>;
  return (
    <ul className="divide-y divide-border-subtle">
      {rows.map((r) => {
        const overdue = r.dueAt ? isOverdue(r.dueAt) : false;
        return (
          <li key={r.id} className="py-2.5 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-fg truncate">{r.vendor}</div>
              <div className="text-[11px] text-fg-subtle">
                {r.tag ? <span className="mr-1.5">{r.tag}</span> : null}
                <span className={cn(overdue && "text-danger")}>{relTime(r.dueAt)}</span>
              </div>
            </div>
            <div className={cn("font-mono text-sm", r.danger || overdue ? "text-danger" : "text-fg")}>
              {fmtCents(r.amountCents)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
