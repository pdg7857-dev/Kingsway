import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BusinessHeader } from "@/components/business/business-header";
import { TaskList } from "@/components/dashboard/task-list";
import { requireCurrentUser } from "@/lib/auth";
import { getBusinessSnapshot } from "@/lib/data/business";
import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const COLUMNS: ContentStatus[] = ["IDEA", "SCRIPTED", "FILMED", "EDITING", "SCHEDULED", "POSTED"];

export default async function ContentDashboard() {
  const user = await requireCurrentUser();
  const snap = await getBusinessSnapshot(user.id, "content");
  if (!snap) return null;
  const items = await prisma.contentItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <BusinessHeader
        slug="content"
        subtitle="IG · TikTok · YouTube · FB · ideas → hooks → posts → analytics"
        revenue={snap.revenue30dCents}
        expenses={snap.expenses30dCents}
        profit={snap.profit30dCents}
        openTasks={snap.tasks.length}
      />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Panel>
          <PanelHeader title="Content pipeline" hint={`${items.length} item${items.length === 1 ? "" : "s"}`} />
          <PanelBody>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
              {COLUMNS.map((col) => {
                const list = items.filter((i) => i.status === col);
                return (
                  <div key={col} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3 min-h-[180px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{col}</div>
                      <Badge tone="muted">{list.length}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {list.map((i) => (
                        <li key={i.id} className="rounded-md bg-bg-panel/70 ring-1 ring-border p-2">
                          <Badge tone="violet" className="mb-1">{i.platform}</Badge>
                          <div className="text-xs text-fg">{i.hook ?? "(untitled)"}</div>
                          {i.scheduledAt ? <div className="text-[10px] text-fg-subtle mt-1">{new Date(i.scheduledAt).toLocaleString()}</div> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Filming + editing queue" />
          <PanelBody>
            <TaskList tasks={snap.tasks} />
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
