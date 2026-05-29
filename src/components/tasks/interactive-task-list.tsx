"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { businessDotBg, cn, priorityTone, relTime, isOverdue } from "@/lib/utils";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import { CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";

export type UITask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: string | null;
  businessSlug: string | null;
};

export function InteractiveTaskList({ tasks: initial }: { tasks: UITask[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();

  async function complete(id: string) {
    setBusy(id);
    const t = tasks.find((x) => x.id === id);
    const done = t?.status === "DONE";
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: done ? "TODO" : "DONE" }),
    });
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, status: done ? "TODO" : "DONE" } : x)));
    setBusy(null);
    start(() => router.refresh());
  }

  async function remove(id: string) {
    setBusy(id);
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((x) => x.id !== id));
    setBusy(null);
    start(() => router.refresh());
  }

  if (tasks.length === 0) return <div className="text-sm text-fg-subtle py-2">No tasks here.</div>;

  return (
    <ul className="divide-y divide-border-subtle">
      {tasks.map((t) => {
        const overdue = isOverdue(t.dueAt ? new Date(t.dueAt) : null) && t.status !== "DONE";
        const biz = t.businessSlug ? BUSINESS_BY_SLUG[t.businessSlug] : null;
        const done = t.status === "DONE";
        return (
          <li key={t.id} className="py-2.5 flex items-start gap-3 group">
            <button
              onClick={() => complete(t.id)}
              disabled={busy === t.id}
              className={cn("mt-0.5 transition-colors", done ? "text-success" : "text-fg-subtle hover:text-accent")}
              title={done ? "Mark not done" : "Mark done"}
            >
              {busy === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {biz ? <span className={cn("dot", businessDotBg[biz.slug])} /> : null}
                <p className={cn("text-sm truncate", done ? "text-fg-subtle line-through" : "text-fg")}>{t.title}</p>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-subtle">
                {biz ? <span>{biz.short}</span> : null}
                {biz ? <span>·</span> : null}
                <span className={cn(overdue && "text-danger")}>{relTime(t.dueAt ? new Date(t.dueAt) : null)}</span>
              </div>
            </div>
            <Badge className={cn(priorityTone[t.priority])} tone="muted">{t.priority}</Badge>
            <button
              onClick={() => remove(t.id)}
              disabled={busy === t.id}
              className="mt-0.5 text-fg-subtle opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
