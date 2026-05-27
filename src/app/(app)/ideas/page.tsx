import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { businessDotBg, cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const user = await requireCurrentUser();
  const ideas = await prisma.idea.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { business: true },
  });

  const groups: Record<string, typeof ideas> = { INBOX: [], EXPLORING: [], VALIDATED: [], CONVERTED: [], ARCHIVED: [] };
  ideas.forEach((i) => groups[i.status].push(i));

  return (
    <>
      <Topbar title="Idea inbox" subtitle="Quick capture · AI expansion · convert to task / project / content" />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(["INBOX", "EXPLORING", "VALIDATED", "CONVERTED"] as const).map((col) => (
          <Panel key={col}>
            <PanelHeader title={col} hint={`${groups[col].length} item${groups[col].length === 1 ? "" : "s"}`} />
            <PanelBody>
              {groups[col].length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">No ideas yet.</div>
              ) : (
                <ul className="space-y-2">
                  {groups[col].map((i) => (
                    <li key={i.id} className="rounded-lg border border-border-subtle bg-bg-raised/30 p-3">
                      <div className="flex items-center gap-2">
                        {i.business ? <span className={cn("dot", businessDotBg[i.business.slug])} /> : null}
                        <div className="flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-warn" />
                          <div className="text-sm text-fg">{i.title}</div>
                        </div>
                      </div>
                      {i.body ? <div className="mt-1 text-xs text-fg-muted">{i.body}</div> : null}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge tone="muted">{i.priority}</Badge>
                        {typeof i.aiFeasibility === "number" ? <Badge tone="accent">AI feasibility {i.aiFeasibility}</Badge> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        ))}
      </div>
    </>
  );
}
