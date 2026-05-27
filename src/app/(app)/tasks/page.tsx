import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KpiCard } from "@/components/ui/kpi-card";
import { ListTodo, Clock, AlertOctagon, PauseCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VIEWS = ["today", "week", "priority", "waiting", "overdue", "all"] as const;
type View = typeof VIEWS[number];

export default async function TasksPage({ searchParams }: { searchParams: { view?: string; business?: string } }) {
  const user = await requireCurrentUser();
  const view = (VIEWS.includes(searchParams.view as View) ? searchParams.view : "today") as View;

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday.getTime() + 86400000);
  const endOfWeek = new Date(now.getTime() + 7 * 86400000);

  const where: any = { userId: user.id };
  if (view === "today") where.dueAt = { gte: startOfToday, lt: endOfToday };
  if (view === "week") where.dueAt = { gte: now, lt: endOfWeek };
  if (view === "priority") where.priority = { in: ["HIGH", "URGENT"] };
  if (view === "waiting") where.status = "WAITING";
  if (view === "overdue") {
    where.dueAt = { lt: now };
    where.status = { in: ["TODO", "IN_PROGRESS"] };
  }

  const [tasks, counts] = await Promise.all([
    prisma.task.findMany({ where, orderBy: [{ priority: "asc" }, { dueAt: "asc" }], include: { business: true }, take: 200 }),
    Promise.all([
      prisma.task.count({ where: { userId: user.id, status: { in: ["TODO", "IN_PROGRESS"] } } }),
      prisma.task.count({ where: { userId: user.id, dueAt: { lt: now }, status: { in: ["TODO", "IN_PROGRESS"] } } }),
      prisma.task.count({ where: { userId: user.id, priority: { in: ["HIGH", "URGENT"] }, status: { in: ["TODO", "IN_PROGRESS"] } } }),
      prisma.task.count({ where: { userId: user.id, status: "WAITING" } }),
    ]),
  ]);

  return (
    <>
      <Topbar title="Tasks" subtitle="Today · Week · Priority · Waiting · Overdue" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Open" value={counts[0]} icon={<ListTodo className="h-4 w-4" />} />
          <KpiCard label="Overdue" value={counts[1]} tone={counts[1] ? "danger" : "default"} icon={<AlertOctagon className="h-4 w-4" />} />
          <KpiCard label="High priority" value={counts[2]} tone="warn" icon={<Clock className="h-4 w-4" />} />
          <KpiCard label="Waiting on" value={counts[3]} icon={<PauseCircle className="h-4 w-4" />} />
        </section>

        <nav className="flex flex-wrap gap-2 text-sm">
          {VIEWS.map((v) => (
            <Link
              key={v}
              href={`/tasks?view=${v}`}
              className={cn(
                "rounded-lg px-3 py-1.5 ring-1 capitalize",
                v === view ? "bg-bg-raised text-fg ring-accent/50" : "text-fg-muted ring-border hover:bg-bg-hover"
              )}
            >
              {v}
            </Link>
          ))}
        </nav>

        <Panel>
          <PanelHeader title={`${view} · ${tasks.length} task${tasks.length === 1 ? "" : "s"}`} />
          <PanelBody>
            <TaskList tasks={tasks} />
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
