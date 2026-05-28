import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { CostList } from "@/components/dashboard/cost-list";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";
import { BUSINESS_BY_SLUG } from "@/lib/constants";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { FinanceAdd } from "@/components/finance/finance-add";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const user = await requireCurrentUser();
  const now = new Date();
  const back30 = new Date(now.getTime() - 30 * 86400000);

  const [expenses, revenue, bills, cards, accounts, businesses] = await Promise.all([
    prisma.expense.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 40, include: { business: true } }),
    prisma.revenue.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 40, include: { business: true } }),
    prisma.bill.findMany({ where: { userId: user.id, status: { in: ["PENDING", "OVERDUE"] } }, orderBy: { dueAt: "asc" } }),
    prisma.creditCard.findMany({ where: { userId: user.id } }),
    prisma.financialAccount.findMany({ where: { userId: user.id } }),
    prisma.business.findMany({ where: { userId: user.id } }),
  ]);

  const totalRev = revenue.filter((r) => r.date >= back30).reduce((s, r) => s + r.amountCents, 0);
  const totalExp = expenses.filter((e) => e.date >= back30).reduce((s, e) => s + e.amountCents, 0);
  const netWorth = accounts.reduce((s, a) => s + a.balanceCents, 0) - cards.reduce((s, c) => s + c.balanceCents, 0);

  const byBiz = businesses.map((b) => {
    const rev = revenue.filter((r) => r.businessId === b.id && r.date >= back30).reduce((s, r) => s + r.amountCents, 0);
    const exp = expenses.filter((e) => e.businessId === b.id && e.date >= back30).reduce((s, e) => s + e.amountCents, 0);
    return { business: b, rev, exp, profit: rev - exp };
  });

  return (
    <>
      <Topbar title="Finance" subtitle="P&L · cash · credit · bills · forecasting" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <div className="flex justify-end">
          <FinanceAdd />
        </div>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Revenue · 30d" value={fmtCents(totalRev)} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
          <KpiCard label="Expenses · 30d" value={fmtCents(totalExp)} tone="warn" icon={<TrendingDown className="h-4 w-4" />} />
          <KpiCard label="Net · 30d" value={fmtCents(totalRev - totalExp)} tone={totalRev - totalExp >= 0 ? "success" : "danger"} icon={<Wallet className="h-4 w-4" />} />
          <KpiCard label="Est. net worth" value={fmtCents(netWorth)} tone="accent" icon={<CreditCard className="h-4 w-4" />} />
        </section>

        <Panel>
          <PanelHeader title="P&L by business · last 30 days" />
          <PanelBody>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">Business</th>
                    <th className="px-2 py-2 text-right font-medium">Revenue</th>
                    <th className="px-2 py-2 text-right font-medium">Expenses</th>
                    <th className="px-2 py-2 text-right font-medium">Profit</th>
                    <th className="px-2 py-2 text-right font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {byBiz.map(({ business, rev, exp, profit }) => {
                    const meta = BUSINESS_BY_SLUG[business.slug];
                    const margin = rev > 0 ? profit / rev : 0;
                    return (
                      <tr key={business.id}>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <span className={cn("dot", businessDotBg[business.slug])} />
                            <span className="text-fg">{meta?.name ?? business.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right font-mono">{fmtCents(rev)}</td>
                        <td className="px-2 py-2 text-right font-mono text-fg-muted">{fmtCents(exp)}</td>
                        <td className={cn("px-2 py-2 text-right font-mono", profit >= 0 ? "text-success" : "text-danger")}>{fmtCents(profit)}</td>
                        <td className="px-2 py-2 text-right font-mono text-fg-muted">{(margin * 100).toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </PanelBody>
        </Panel>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <PanelHeader title="Recent expenses" />
            <PanelBody>
              <ul className="divide-y divide-border-subtle">
                {expenses.slice(0, 12).map((e) => (
                  <li key={e.id} className="py-2 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-fg truncate">{e.vendor}</div>
                      <div className="text-[11px] text-fg-subtle">{e.business?.name ?? "—"} · {new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <div className="font-mono text-sm">{fmtCents(e.amountCents)}</div>
                  </li>
                ))}
              </ul>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Bills due" />
            <PanelBody>
              <CostList rows={bills.map((b) => ({ id: b.id, vendor: b.vendor, amountCents: b.amountCents, dueAt: b.dueAt }))} />
            </PanelBody>
          </Panel>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel>
            <PanelHeader title="Credit cards" />
            <PanelBody>
              {cards.length === 0 ? (
                <div className="text-sm text-fg-subtle">No cards configured.</div>
              ) : (
                <ul className="space-y-3">
                  {cards.map((c) => {
                    const util = c.limitCents > 0 ? (c.balanceCents / c.limitCents) * 100 : 0;
                    return (
                      <li key={c.id} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{c.name}</div>
                            <div className="text-[11px] text-fg-subtle">•••• {c.last4} · {c.network}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono">{fmtCents(c.balanceCents)}</div>
                            <div className="text-[10px] text-fg-subtle">of {fmtCents(c.limitCents)}</div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-1 text-[11px]">
                          <div className="text-fg-subtle">Util</div>
                          <div className="text-fg-subtle">Statement</div>
                          <div className="text-fg-subtle">Due</div>
                          <div className={cn("font-mono", util > 30 ? "text-warn" : "text-fg")}>{util.toFixed(0)}%</div>
                          <div className="font-mono">{c.nextStatementAt ? new Date(c.nextStatementAt).toLocaleDateString() : "—"}</div>
                          <div className="font-mono text-warn">{c.nextDueAt ? new Date(c.nextDueAt).toLocaleDateString() : "—"}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Accounts" />
            <PanelBody>
              {accounts.length === 0 ? (
                <div className="text-sm text-fg-subtle">No accounts configured.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {accounts.map((a) => (
                    <li key={a.id} className="py-2 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-fg">{a.name}</div>
                        <div className="text-[11px] text-fg-subtle">{a.institution} · {a.kind}</div>
                      </div>
                      <div className="font-mono text-sm">{fmtCents(a.balanceCents)}</div>
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
