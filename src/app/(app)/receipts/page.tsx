import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReceiptScanner } from "@/components/receipts/receipt-scanner";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const user = await requireCurrentUser();
  const recent = await prisma.expense.findMany({
    where: { userId: user.id, notes: { contains: "Scanned receipt" } },
    orderBy: { createdAt: "desc" },
    include: { business: true, creditCard: true },
    take: 30,
  });

  const aiOn = !!process.env.ANTHROPIC_API_KEY;

  return (
    <>
      <Topbar title="Receipt scanner" subtitle="Snap a photo — AI extracts amount, tax, date, card, and files it as an expense" />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-1">
          <PanelHeader
            title="Scan a receipt"
            action={<Badge tone={aiOn ? "accent" : "muted"} className="gap-1"><Sparkles className="h-3 w-3" />{aiOn ? "AI on" : "set key"}</Badge>}
          />
          <PanelBody>
            {!aiOn && (
              <div className="mb-3 rounded-lg border border-warn/30 bg-warn-soft/20 p-2.5 text-xs text-warn">
                Set <code>ANTHROPIC_API_KEY</code> in your env to enable photo extraction.
              </div>
            )}
            <ReceiptScanner />
          </PanelBody>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Recently scanned" hint={`${recent.length} receipts`} />
          <PanelBody>
            {recent.length === 0 ? (
              <div className="text-sm text-fg-subtle py-2">No scanned receipts yet.</div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {recent.map((e) => (
                  <li key={e.id} className="py-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {e.business ? <span className={cn("dot", businessDotBg[e.business.slug])} /> : null}
                        <div className="text-sm text-fg truncate">{e.vendor}</div>
                      </div>
                      <div className="text-[11px] text-fg-subtle truncate">
                        {new Date(e.date).toLocaleString()} · {e.aiCategory ?? e.category ?? "uncategorized"}
                        {e.creditCard ? ` · ${e.creditCard.name}` : ""}
                        {e.taxCents != null ? ` · tax ${fmtCents(e.taxCents)}` : ""}
                      </div>
                    </div>
                    <div className="font-mono text-sm">{fmtCents(e.amountCents)}</div>
                  </li>
                ))}
              </ul>
            )}
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
