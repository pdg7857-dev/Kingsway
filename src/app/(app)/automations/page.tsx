import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Play, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const user = await requireCurrentUser();
  const automations = await prisma.automation.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });

  return (
    <>
      <Topbar title="Automations" subtitle={`${automations.filter((a) => a.enabled).length} enabled · ${automations.length} total`} />
      <div className="px-4 lg:px-6 py-4 space-y-3">
        {automations.map((a) => (
          <Panel key={a.id}>
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-violet-soft text-violet">
                <Zap className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-fg">{a.name}</div>
                  <Badge tone={a.enabled ? "success" : "muted"}>{a.enabled ? "on" : "off"}</Badge>
                  <Badge tone="accent">{a.trigger.toLowerCase()}</Badge>
                </div>
                <div className="text-[12px] text-fg-subtle mt-0.5">
                  Last run: {a.lastRunAt ? new Date(a.lastRunAt).toLocaleString() : "never"}
                </div>
              </div>
              <form action={`/api/automations/${a.id}/run`} method="post">
                <Button size="sm" variant="secondary" type="submit">
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
              </form>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
