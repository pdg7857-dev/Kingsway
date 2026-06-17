import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtDollars } from "@/lib/oi/constants";
import { platformName } from "@/lib/oi/platforms";
import { Building2, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BuyersPage() {
  const user = await requireCurrentUser();
  const buyers = await prisma.buyer.findMany({ where: { userId: user.id }, orderBy: { totalAwardedDollars: "desc" } });

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Buyer Intelligence</h1>
        <p className="text-xs text-fg-subtle mt-0.5">{buyers.length} public buyers · what they buy, how often, from whom</p>
      </div>

      {buyers.length === 0 ? (
        <Panel><PanelBody><div className="text-sm text-fg-subtle">No buyers yet. Add buyer organizations via the API to build a buyer intelligence database.</div></PanelBody></Panel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {buyers.map((b) => (
            <Panel key={b.id}>
              <PanelHeader
                title={<span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-fg-subtle" /> {b.organization}</span>}
                hint={[b.department, b.region].filter(Boolean).join(" · ") || undefined}
                action={b.platform ? <Badge tone="accent">{platformName(b.platform)}</Badge> : undefined}
              />
              <PanelBody className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-[10px] uppercase text-fg-subtle">Awards</div><div className="font-mono text-sm">{b.awardCount}</div></div>
                  <div><div className="text-[10px] uppercase text-fg-subtle">Total awarded</div><div className="font-mono text-sm">{fmtDollars(b.totalAwardedDollars)}</div></div>
                  <div><div className="text-[10px] uppercase text-fg-subtle">Avg contract</div><div className="font-mono text-sm">{fmtDollars(b.avgContractDollars)}</div></div>
                </div>
                {b.commodityCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {b.commodityCategories.map((c) => <Badge key={c} tone="muted">{c}</Badge>)}
                  </div>
                )}
                {b.aiSummary && <p className="text-sm text-fg-muted whitespace-pre-wrap">{b.aiSummary}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fg-subtle">
                  {b.contactName && <span>{b.contactName}{b.contactTitle ? `, ${b.contactTitle}` : ""}</span>}
                  {b.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {b.email}</span>}
                  {b.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {b.phone}</span>}
                  {b.typicalCycleMonths && <span>~{b.typicalCycleMonths}mo cycle</span>}
                </div>
              </PanelBody>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
