import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { BriefingCard } from "@/components/dashboard/briefing-card";
import { TaskList } from "@/components/dashboard/task-list";
import { BusinessHealthGrid } from "@/components/dashboard/business-health";
import { RevenueByBusinessChart } from "@/components/dashboard/revenue-chart";
import { CostList } from "@/components/dashboard/cost-list";
import { EventList } from "@/components/dashboard/event-list";
import { EmailPreview, WhatsAppPreview } from "@/components/dashboard/inbox-preview";
import { AlertsPanel } from "@/components/dashboard/alerts";
import { Badge } from "@/components/ui/badge";
import { fmtCents, fmtCompact, businessDotBg, cn } from "@/lib/utils";
import { requireCurrentUser } from "@/lib/auth";
import { getMasterDashboardData } from "@/lib/data/master";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, DollarSign, TrendingUp, Wallet, ListTodo } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MasterDashboard() {
  const user = await requireCurrentUser();
  const data = await getMasterDashboardData(user.id);

  const revChartData = data.businessSnapshots.map((s) => {
    const meta = BUSINESS_BY_SLUG[s.business.slug];
    const colorMap: Record<string, string> = {
      lexus: "hsl(0 84% 60%)",
      fitness: "hsl(150 80% 50%)",
      content: "hsl(280 90% 65%)",
      phone_repair: "hsl(38 92% 58%)",
      supplements: "hsl(186 100% 55%)",
      eprocurement: "hsl(214 95% 62%)",
      personal: "hsl(215 28% 65%)",
    };
    return {
      name: meta?.short ?? s.business.name,
      revenue: s.revenueCents,
      profit: s.profitCents,
      color: colorMap[s.business.slug] ?? "hsl(186 100% 55%)",
    };
  });

  return (
    <>
      <Topbar
        title="Master Command"
        subtitle={`${data.businesses.length} businesses · ${new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}`}
      />

      <div className="px-4 lg:px-6 py-4 space-y-4 lg:space-y-5">
        {/* KPI strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Revenue · 30d"
            value={fmtCents(data.totalRevenue30d)}
            hint="Across all 6 businesses"
            tone="success"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KpiCard
            label="Expenses · 30d"
            value={fmtCents(data.totalExpenses30d)}
            hint="Includes COGS + ops"
            tone="warn"
            icon={<Wallet className="h-4 w-4" />}
          />
          <KpiCard
            label="Net cash · 30d"
            value={fmtCents(data.cashFlow30d)}
            tone={data.cashFlow30d >= 0 ? "success" : "danger"}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Open tasks today"
            value={data.todayTasks.length}
            hint={`${data.overdueTasks.length} overdue`}
            tone={data.overdueTasks.length ? "danger" : "accent"}
            icon={<ListTodo className="h-4 w-4" />}
          />
        </section>

        {/* Row: briefing + today's priorities */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <BriefingCard initial={data.latestInsight?.summary ?? "No briefing yet. Tap Refresh to generate one."} createdAt={data.latestInsight?.createdAt ?? null} />
          <Panel>
            <PanelHeader title="Today's priorities" hint="Urgent + due today" />
            <PanelBody>
              <TaskList tasks={data.todayTasks} emptyHint="Plan something for today via Quick Add." />
            </PanelBody>
          </Panel>
        </section>

        {/* Row: revenue + cash flow + alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-2">
            <PanelHeader
              title="Revenue by business · 30d"
              hint="Tap a business in the sidebar for the drill-down"
            />
            <PanelBody>
              <RevenueByBusinessChart data={revChartData} />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Risk alerts" />
            <PanelBody>
              <AlertsPanel
                lowStock={data.inventory.filter((i) => i.quantity <= i.reorderAt)}
                overdueCount={data.overdueTasks.length}
                cashLowFlag={data.cashFlow30d < 0}
                notifications={data.notifications}
              />
            </PanelBody>
          </Panel>
        </section>

        {/* Row: overdue, upcoming tasks, content schedule */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel>
            <PanelHeader
              title="Overdue"
              action={<Link href="/tasks?view=overdue" className="text-xs text-fg-subtle hover:text-fg inline-flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>}
            />
            <PanelBody>
              <TaskList tasks={data.overdueTasks} emptyHint="Nothing overdue 🟢" />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader
              title="Upcoming this week"
              action={<Link href="/tasks?view=week" className="text-xs text-fg-subtle hover:text-fg inline-flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>}
            />
            <PanelBody>
              <TaskList tasks={data.upcomingTasks} />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader
              title="Content schedule"
              action={<Link href="/business/content" className="text-xs text-fg-subtle hover:text-fg inline-flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>}
            />
            <PanelBody>
              {data.contentScheduled.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">Nothing scheduled.</div>
              ) : (
                <ul className="space-y-2">
                  {data.contentScheduled.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
                      <div className="min-w-0">
                        <div className="text-sm text-fg truncate">{c.hook ?? "(untitled)"}</div>
                        <div className="text-[11px] text-fg-subtle">{c.platform} · {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : ""}</div>
                      </div>
                      <Badge tone="violet">{c.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </section>

        {/* Row: upcoming costs / bills / credit cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel>
            <PanelHeader title="Upcoming costs" hint="Next 30 days" />
            <PanelBody>
              <CostList
                rows={data.upcomingCosts.map((c) => ({
                  id: c.id,
                  vendor: c.vendor,
                  amountCents: c.amountCents,
                  dueAt: c.dueAt,
                  tag: c.business?.name,
                  danger: c.status === "OVERDUE",
                }))}
              />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Bills due" />
            <PanelBody>
              <CostList
                rows={data.bills.map((b) => ({
                  id: b.id,
                  vendor: b.vendor,
                  amountCents: b.amountCents,
                  dueAt: b.dueAt,
                  tag: b.autopay ? "autopay" : "manual",
                }))}
              />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Credit cards" hint="Statement + due dates" />
            <PanelBody>
              {data.creditCards.length === 0 ? (
                <div className="text-sm text-fg-subtle">Add a card in Finance.</div>
              ) : (
                <ul className="space-y-2">
                  {data.creditCards.map((c) => (
                    <li key={c.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-fg">{c.name}</div>
                          <div className="text-[11px] text-fg-subtle">•••• {c.last4}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">{fmtCents(c.balanceCents)}</div>
                          <div className="text-[10px] text-fg-subtle">balance</div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                        <div className="text-fg-subtle">Statement</div>
                        <div className="text-right text-fg">{c.nextStatementAt ? new Date(c.nextStatementAt).toLocaleDateString() : "—"}</div>
                        <div className="text-fg-subtle">Payment due</div>
                        <div className="text-right text-warn">{c.nextDueAt ? new Date(c.nextDueAt).toLocaleDateString() : "—"}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </section>

        {/* Row: business health */}
        <section className="grid grid-cols-1 gap-4">
          <BusinessHealthGrid snapshots={data.businessSnapshots} />
        </section>

        {/* Row: calendar + opportunities + inbox */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel>
            <PanelHeader title="Upcoming events" />
            <PanelBody>
              <EventList events={data.events} />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Open opportunities" hint="Top deals by value" />
            <PanelBody>
              {data.deals.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">Pipeline is empty.</div>
              ) : (
                <ul className="space-y-2">
                  {data.deals.map((d) => (
                    <li key={d.id} className="flex items-start justify-between gap-3 rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {d.business ? <span className={cn("dot", businessDotBg[d.business.slug])} /> : null}
                          <div className="text-sm text-fg truncate">{d.title}</div>
                        </div>
                        <div className="text-[11px] text-fg-subtle truncate">
                          {d.stage.replace("_", " ")} · {d.nextAction ?? "no next action"}
                        </div>
                      </div>
                      <div className="font-mono text-sm">{fmtCents(d.valueCents)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Customer follow-ups" hint="14+ days since last touch" />
            <PanelBody>
              {data.customers.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">All up to date.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {data.customers.map((c) => (
                    <li key={c.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {c.business ? <span className={cn("dot", businessDotBg[c.business.slug])} /> : null}
                          <span className="text-sm text-fg truncate">{c.name}</span>
                        </div>
                        <div className="text-[11px] text-fg-subtle">{c.business?.name}</div>
                      </div>
                      <Badge tone="warn">follow-up</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </section>

        {/* Row: emails + whatsapp + ideas */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel>
            <PanelHeader title="Important emails" hint="AI-scored ≥3/5" />
            <PanelBody>
              <EmailPreview items={data.importantEmails} />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Customer inquiries" hint="WhatsApp · waiting" />
            <PanelBody>
              <WhatsAppPreview items={data.importantWhatsapp} />
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader
              title="Idea inbox"
              action={<Link href="/ideas" className="text-xs text-fg-subtle hover:text-fg inline-flex items-center gap-1">All <ArrowRight className="h-3 w-3" /></Link>}
            />
            <PanelBody>
              {data.ideas.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">No ideas captured.</div>
              ) : (
                <ul className="space-y-2">
                  {data.ideas.map((i) => (
                    <li key={i.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
                      <div className="flex items-center gap-2">
                        {i.business ? <span className={cn("dot", businessDotBg[i.business.slug])} /> : null}
                        <div className="text-sm text-fg truncate">{i.title}</div>
                      </div>
                      <div className="text-[11px] text-fg-subtle mt-0.5">{i.status} · {i.priority}</div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </section>
      </div>
    </>
  );
}
