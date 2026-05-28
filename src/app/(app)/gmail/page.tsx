import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GmailSyncButton } from "@/components/gmail/sync-button";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { relTime } from "@/lib/utils";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GmailPage() {
  const user = await requireCurrentUser();
  const [account, emails] = await Promise.all([
    prisma.account.findFirst({ where: { userId: user.id, provider: "google" } }),
    prisma.emailImport.findMany({ where: { userId: user.id }, orderBy: [{ importance: "desc" }, { receivedAt: "desc" }], take: 100 }),
  ]);
  const connected = !!account;
  const oauthConfigured = !!process.env.GOOGLE_CLIENT_ID;

  return (
    <>
      <Topbar title="Gmail" subtitle="AI scans your inbox and ranks what matters" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        {!oauthConfigured && (
          <div className="panel ring-1 ring-warn/40 p-4 text-sm text-warn">
            Google isn't configured yet. Add <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in Vercel and sign in with Google (Calendar + Gmail scopes are already requested). See the setup steps your assistant provided.
          </div>
        )}
        {oauthConfigured && !connected && (
          <div className="panel ring-1 ring-info/40 p-4 text-sm text-info">
            Google is configured but not connected for this account. Sign out and sign in with Google to grant Gmail access, then come back and Scan.
          </div>
        )}

        <Panel>
          <PanelHeader
            title="Important inbox"
            hint="Scored 0–5 by the Email agent"
            action={<GmailSyncButton />}
          />
          <PanelBody>
            {emails.length === 0 ? (
              <div className="text-sm text-fg-subtle py-2">No emails scanned yet. Connect Google and tap Scan Gmail.</div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {emails.map((e) => (
                  <li key={e.id} className="py-3 flex items-start gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-bg-raised text-fg-muted shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-fg truncate">{e.from}</span>
                        <Badge tone={e.importance >= 4 ? "danger" : e.importance >= 3 ? "warn" : "muted"}>imp {e.importance}</Badge>
                      </div>
                      <div className="text-[12px] text-fg-muted truncate">{e.subject ?? "(no subject)"}</div>
                      <div className="text-[11px] text-fg-subtle truncate">{e.snippet}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-fg-subtle">
                        <span>{relTime(e.receivedAt)}</span>
                        {e.isTask ? <Badge tone="accent">actionable</Badge> : null}
                      </div>
                    </div>
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
