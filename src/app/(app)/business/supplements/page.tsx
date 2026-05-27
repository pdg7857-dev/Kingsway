import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import { fmtCents, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SupplementsDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "supplements");
  if (!snap) return null;
  const [products, orders] = await Promise.all([
    prisma.supplementProduct.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    prisma.supplementOrder.findMany({ where: { userId: user.id }, orderBy: { placedAt: "desc" }, take: 12, include: { product: true } }),
  ]);

  const subRevenue = products.filter((p) => p.subscriptionEnabled).length;
  const totalValue = products.reduce((s, p) => s + p.inventory * p.costCents, 0);

  return (
    <>
      <BusinessHeader
        slug="supplements"
        subtitle={`${products.length} SKUs · ${subRevenue} subscription products · ${fmtCents(totalValue)} inventory value`}
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Panel>
          <PanelHeader title="Products" />
          <PanelBody>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">Product</th>
                    <th className="px-2 py-2 text-left font-medium">SKU</th>
                    <th className="px-2 py-2 text-right font-medium">Inventory</th>
                    <th className="px-2 py-2 text-right font-medium">Cost</th>
                    <th className="px-2 py-2 text-right font-medium">Price</th>
                    <th className="px-2 py-2 text-right font-medium">Margin</th>
                    <th className="px-2 py-2 text-left font-medium">Subscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {products.map((p) => {
                    const margin = p.priceCents > 0 ? ((p.priceCents - p.costCents) / p.priceCents) * 100 : 0;
                    const low = p.inventory <= p.reorderAt;
                    return (
                      <tr key={p.id}>
                        <td className="px-2 py-2 text-fg">
                          {p.name}
                          {low && <Badge tone="warn" className="ml-2">low</Badge>}
                        </td>
                        <td className="px-2 py-2 font-mono text-fg-muted">{p.sku}</td>
                        <td className={cn("px-2 py-2 text-right font-mono", low && "text-warn")}>{p.inventory}</td>
                        <td className="px-2 py-2 text-right font-mono text-fg-muted">{fmtCents(p.costCents)}</td>
                        <td className="px-2 py-2 text-right font-mono">{fmtCents(p.priceCents)}</td>
                        <td className="px-2 py-2 text-right font-mono">{margin.toFixed(0)}%</td>
                        <td className="px-2 py-2">{p.subscriptionEnabled ? <Badge tone="success">on</Badge> : <Badge tone="muted">off</Badge>}</td>
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
            <PanelHeader title="Recent orders" />
            <PanelBody>
              {orders.length === 0 ? (
                <div className="text-sm text-fg-subtle">No orders yet.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {orders.map((o) => (
                    <li key={o.id} className="py-2 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-fg truncate">{o.product.name}</div>
                        <div className="text-[11px] text-fg-subtle">{o.customerName ?? "—"} · {new Date(o.placedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="font-mono text-sm">{fmtCents(o.totalCents)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
          <Panel>
            <PanelHeader title="Operations queue" />
            <PanelBody>
              <TaskList tasks={snap.tasks} />
            </PanelBody>
          </Panel>
        </section>
      </div>
    </>
  );
}
