import { AlertTriangle, Boxes, Clock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";
import type { InventoryItem, Business, Notification } from "@prisma/client";

export function AlertsPanel({
  lowStock,
  overdueCount,
  cashLowFlag,
  notifications,
}: {
  lowStock: (InventoryItem & { business?: Business | null })[];
  overdueCount: number;
  cashLowFlag: boolean;
  notifications: Notification[];
}) {
  const items: { icon: any; tone: any; title: string; body?: string }[] = [];
  if (overdueCount > 0) {
    items.push({ icon: Clock, tone: "danger", title: `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""}`, body: "Clear before noon." });
  }
  if (cashLowFlag) {
    items.push({ icon: AlertTriangle, tone: "warn", title: "Cash flow trending negative (30d)", body: "Review expenses." });
  }
  lowStock.forEach((i) => {
    items.push({
      icon: Boxes,
      tone: "warn",
      title: `${i.name} low — ${i.quantity} left`,
      body: `Reorder at ${i.reorderAt}. ${i.business?.name ?? ""}`,
    });
  });
  notifications.slice(0, 3).forEach((n) => {
    items.push({ icon: MessageCircle, tone: "info", title: n.title, body: n.body ?? undefined });
  });

  if (!items.length) return <div className="text-sm text-fg-subtle py-2">All clear.</div>;

  return (
    <ul className="space-y-2">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <li
            key={i}
            className={cn(
              "flex gap-3 rounded-lg border p-2.5",
              it.tone === "danger" && "border-danger/30 bg-danger-soft/20",
              it.tone === "warn" && "border-warn/30 bg-warn-soft/20",
              it.tone === "info" && "border-info/30 bg-info-soft/20"
            )}
          >
            <div className="grid h-8 w-8 place-items-center rounded-md bg-bg-raised text-fg">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-fg truncate">{it.title}</div>
              {it.body ? <div className="text-[11px] text-fg-subtle truncate">{it.body}</div> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
