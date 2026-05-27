import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { relTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireCurrentUser();
  const items = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <>
      <Topbar title="Notifications" subtitle={`${items.filter((i) => !i.readAt).length} unread · ${items.length} total`} />
      <div className="px-4 lg:px-6 py-4">
        <Panel>
          <PanelHeader title="Center" />
          <PanelBody>
            <ul className="divide-y divide-border-subtle">
              {items.map((n) => (
                <li key={n.id} className="py-3 flex items-start gap-3">
                  <Badge tone={n.kind === "TASK_OVERDUE" ? "danger" : n.kind === "BILL_DUE" || n.kind === "CARD_DUE" ? "warn" : "info"}>
                    {n.kind.replace("_", " ").toLowerCase()}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg">{n.title}</div>
                    {n.body ? <div className="text-[12px] text-fg-muted">{n.body}</div> : null}
                    <div className="text-[10px] text-fg-subtle mt-0.5">
                      {relTime(n.createdAt)} · {n.channels.join(", ")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
