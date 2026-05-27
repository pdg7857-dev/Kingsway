import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn, relTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const user = await requireCurrentUser();
  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    orderBy: { totalSpentCents: "desc" },
    include: { business: true },
  });

  return (
    <>
      <Topbar title="Customers" subtitle={`${customers.length} record${customers.length === 1 ? "" : "s"} across all businesses`} />
      <div className="px-4 lg:px-6 py-4">
        <Panel>
          <PanelHeader title="All customers" />
          <PanelBody>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">Customer</th>
                    <th className="px-2 py-2 text-left font-medium">Business</th>
                    <th className="px-2 py-2 text-left font-medium">Phone</th>
                    <th className="px-2 py-2 text-right font-medium">Spent</th>
                    <th className="px-2 py-2 text-right font-medium">Last touch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="px-2 py-2 text-fg">{c.name}</td>
                      <td className="px-2 py-2">
                        {c.business ? (
                          <div className="flex items-center gap-2">
                            <span className={cn("dot", businessDotBg[c.business.slug])} />
                            <span className="text-fg-muted">{c.business.name}</span>
                          </div>
                        ) : (
                          <span className="text-fg-subtle">—</span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-fg-muted">{c.phone ?? "—"}</td>
                      <td className="px-2 py-2 text-right font-mono">{fmtCents(c.totalSpentCents)}</td>
                      <td className="px-2 py-2 text-right text-fg-muted">{relTime(c.lastTouchAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
