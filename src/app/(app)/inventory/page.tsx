import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await requireCurrentUser();
  const items = await prisma.inventoryItem.findMany({
    where: { userId: user.id },
    orderBy: [{ businessId: "asc" }, { quantity: "asc" }],
    include: { business: true },
  });

  const totalValueCents = items.reduce((s, i) => s + i.quantity * i.costCents, 0);
  const lowStock = items.filter((i) => i.quantity <= i.reorderAt);

  return (
    <>
      <Topbar title="Inventory" subtitle={`${items.length} SKUs · ${fmtCents(totalValueCents)} on hand · ${lowStock.length} low stock`} />
      <div className="px-4 lg:px-6 py-4">
        <Panel>
          <PanelHeader title="All SKUs" />
          <PanelBody>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">SKU</th>
                    <th className="px-2 py-2 text-left font-medium">Name</th>
                    <th className="px-2 py-2 text-left font-medium">Business</th>
                    <th className="px-2 py-2 text-right font-medium">Qty</th>
                    <th className="px-2 py-2 text-right font-medium">Cost</th>
                    <th className="px-2 py-2 text-right font-medium">Price</th>
                    <th className="px-2 py-2 text-right font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {items.map((i) => {
                    const margin = i.priceCents > 0 ? ((i.priceCents - i.costCents) / i.priceCents) * 100 : 0;
                    const low = i.quantity <= i.reorderAt;
                    return (
                      <tr key={i.id}>
                        <td className="px-2 py-2 font-mono text-fg-muted">{i.sku ?? "—"}</td>
                        <td className="px-2 py-2 text-fg">
                          <span>{i.name}</span>
                          {low && <Badge tone="warn" className="ml-2">low</Badge>}
                        </td>
                        <td className="px-2 py-2">
                          {i.business ? (
                            <div className="flex items-center gap-2">
                              <span className={cn("dot", businessDotBg[i.business.slug])} />
                              <span className="text-fg-muted">{i.business.name}</span>
                            </div>
                          ) : <span className="text-fg-subtle">—</span>}
                        </td>
                        <td className={cn("px-2 py-2 text-right font-mono", low && "text-warn")}>{i.quantity}</td>
                        <td className="px-2 py-2 text-right font-mono text-fg-muted">{fmtCents(i.costCents)}</td>
                        <td className="px-2 py-2 text-right font-mono">{fmtCents(i.priceCents)}</td>
                        <td className="px-2 py-2 text-right font-mono">{margin.toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
