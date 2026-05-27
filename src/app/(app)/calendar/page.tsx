import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { EventList } from "@/components/dashboard/event-list";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

export default async function CalendarPage() {
  const user = await requireCurrentUser();
  const now = new Date();
  const start = startOfDay(now);
  const end = new Date(start.getTime() + 7 * 86400000);

  const [events, bills, tasks] = await Promise.all([
    prisma.calendarEvent.findMany({
      where: { userId: user.id, startAt: { gte: start, lte: end } },
      orderBy: { startAt: "asc" },
      include: { business: true },
    }),
    prisma.bill.findMany({ where: { userId: user.id, dueAt: { gte: start, lte: end } }, orderBy: { dueAt: "asc" } }),
    prisma.task.findMany({ where: { userId: user.id, dueAt: { gte: start, lte: end } }, orderBy: { dueAt: "asc" }, include: { business: true } }),
  ]);

  const days: { date: Date; events: typeof events; bills: typeof bills; tasks: typeof tasks }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const next = new Date(d.getTime() + 86400000);
    days.push({
      date: d,
      events: events.filter((e) => e.startAt >= d && e.startAt < next),
      bills: bills.filter((b) => b.dueAt >= d && b.dueAt < next),
      tasks: tasks.filter((t) => t.dueAt && t.dueAt >= d && t.dueAt < next),
    });
  }

  return (
    <>
      <Topbar title="Calendar" subtitle="Next 7 days · events · task deadlines · bills" />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map(({ date, events: ev, bills: bl, tasks: tk }) => (
          <Panel key={date.toISOString()}>
            <PanelHeader
              title={date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              hint={`${ev.length + bl.length + tk.length} items`}
            />
            <PanelBody className="space-y-3">
              {ev.length > 0 && <EventList events={ev} />}
              {tk.length > 0 && (
                <ul className="space-y-1">
                  {tk.map((t) => (
                    <li key={t.id} className="text-xs flex items-center gap-2">
                      <Badge tone="info">task</Badge>
                      <span className="truncate text-fg">{t.title}</span>
                    </li>
                  ))}
                </ul>
              )}
              {bl.length > 0 && (
                <ul className="space-y-1">
                  {bl.map((b) => (
                    <li key={b.id} className="text-xs flex items-center gap-2">
                      <Badge tone="warn">bill</Badge>
                      <span className="truncate text-fg">{b.vendor}</span>
                    </li>
                  ))}
                </ul>
              )}
              {ev.length + tk.length + bl.length === 0 && <div className="text-xs text-fg-subtle">Open day.</div>}
            </PanelBody>
          </Panel>
        ))}
      </div>
    </>
  );
}
