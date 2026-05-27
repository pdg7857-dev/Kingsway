import { Badge } from "@/components/ui/badge";
import { businessDotBg, cn, priorityTone, relTime, isOverdue } from "@/lib/utils";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import type { Task, Business } from "@prisma/client";

type T = Task & { business?: Business | null };

export function TaskList({ tasks, emptyHint = "Nothing here — well done." }: { tasks: T[]; emptyHint?: string }) {
  if (tasks.length === 0) {
    return <div className="text-sm text-fg-subtle py-2">{emptyHint}</div>;
  }
  return (
    <ul className="divide-y divide-border-subtle">
      {tasks.map((t) => {
        const overdue = isOverdue(t.dueAt);
        const biz = t.business?.slug ? BUSINESS_BY_SLUG[t.business.slug] : null;
        return (
          <li key={t.id} className="py-2.5 flex items-start gap-3 group">
            <button className="mt-0.5 text-fg-subtle hover:text-accent" title="Mark done">
              <CheckCircle2 className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {biz ? <span className={cn("dot", businessDotBg[biz.slug])} /> : null}
                <p className="text-sm text-fg truncate">{t.title}</p>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-subtle">
                {biz ? <span>{biz.short}</span> : null}
                {biz ? <span>·</span> : null}
                <span className={cn(overdue && "text-danger")}>{relTime(t.dueAt)}</span>
              </div>
            </div>
            <Badge
              className={cn(priorityTone[t.priority])}
              tone="muted"
            >
              {t.priority}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
