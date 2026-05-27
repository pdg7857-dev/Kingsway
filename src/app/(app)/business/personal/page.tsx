import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PersonalDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "personal");
  if (!snap) return null;
  const [habits, goals, accounts, cards, bills] = await Promise.all([
    prisma.habit.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    prisma.goal.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.financialAccount.findMany({ where: { userId: user.id } }),
    prisma.creditCard.findMany({ where: { userId: user.id } }),
    prisma.bill.findMany({ where: { userId: user.id, status: { in: ["PENDING", "OVERDUE"] } }, orderBy: { dueAt: "asc" }, take: 6 }),
  ]);

  const assets = accounts.reduce((s, a) => s + a.balanceCents, 0);
  const debt = cards.reduce((s, c) => s + c.balanceCents, 0);
  const netWorth = assets - debt;

  return (
    <>
      <BusinessHeader
        slug="personal"
        subtitle={`Net worth ${fmtCents(netWorth)} · ${habits.length} habit${habits.length === 1 ? "" : "s"} tracked`}
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel>
          <PanelHeader title="Habits" />
          <PanelBody>
            <ul className="divide-y divide-border-subtle">
              {habits.map((h) => (
                <li key={h.id} className="py-2 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg">{h.name}</div>
                    <div className="text-[11px] text-fg-subtle">streak {h.streak} · best {h.longest}</div>
                  </div>
                  <Badge tone="success">{h.cadence}</Badge>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Goals" />
          <PanelBody>
            <ul className="space-y-3">
              {goals.map((g) => (
                <li key={g.id}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-fg truncate">{g.title}</div>
                    <Badge tone="muted">{g.area}</Badge>
                  </div>
                  <Progress value={g.progress} className="mt-1.5" tone="violet" />
                  <div className="mt-1 text-[10px] text-fg-subtle">{g.progress}%</div>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Money" />
          <PanelBody>
            <ul className="divide-y divide-border-subtle">
              <li className="py-2 flex items-center justify-between"><span className="text-sm text-fg-muted">Assets</span><span className="font-mono">{fmtCents(assets)}</span></li>
              <li className="py-2 flex items-center justify-between"><span className="text-sm text-fg-muted">Credit balances</span><span className="font-mono text-warn">{fmtCents(debt)}</span></li>
              <li className="py-2 flex items-center justify-between"><span className="text-sm text-fg">Net worth</span><span className="font-mono text-success">{fmtCents(netWorth)}</span></li>
            </ul>
            <div className="mt-3 text-[11px] uppercase tracking-wider text-fg-subtle">Upcoming bills</div>
            <ul className="mt-1 divide-y divide-border-subtle">
              {bills.map((b) => (
                <li key={b.id} className="py-1.5 flex items-center justify-between text-sm">
                  <span className="text-fg-muted">{b.vendor}</span>
                  <span className="font-mono">{fmtCents(b.amountCents)}</span>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHeader title="Personal tasks" />
          <PanelBody>
            <TaskList tasks={snap.tasks} />
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
