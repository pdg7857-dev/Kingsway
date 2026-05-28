import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICloudConnect } from "@/components/integrations/icloud-connect";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const integrations = [
  { name: "Google Calendar", env: "GOOGLE_CLIENT_ID", purpose: "Two-way sync with internal calendar" },
  { name: "Gmail", env: "GOOGLE_CLIENT_ID", purpose: "Important-email scoring + AI drafts" },
  { name: "WhatsApp Cloud API", env: "WHATSAPP_TOKEN", purpose: "Customer inquiries + outbound replies" },
  { name: "Twilio SMS", env: "TWILIO_AUTH_TOKEN", purpose: "Critical alerts to your phone" },
  { name: "Slack webhook", env: "SLACK_WEBHOOK_URL", purpose: "CEO channel notifications" },
  { name: "Anthropic Claude", env: "ANTHROPIC_API_KEY", purpose: "All AI agents" },
  { name: "OpenAI", env: "OPENAI_API_KEY", purpose: "Embeddings + fallback" },
  { name: "Inngest", env: "INNGEST_EVENT_KEY", purpose: "Scheduled jobs + automations" },
];

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const icloud = await prisma.integrationCredential
    .findUnique({ where: { userId_provider: { userId: user.id, provider: "icloud" } } })
    .catch(() => null);

  return (
    <>
      <Topbar title="Settings" subtitle="Profile · integrations · notifications" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <Panel>
          <PanelHeader title="iPhone — iCloud Calendar & Reminders" hint="Two-way sync via CalDAV" />
          <PanelBody>
            <ICloudConnect
              connected={!!icloud}
              username={icloud?.username ?? null}
              lastSyncAt={icloud?.lastSyncAt ? icloud.lastSyncAt.toISOString() : null}
            />
            <p className="mt-3 text-[11px] text-fg-subtle">
              On your iPhone, make sure iCloud Calendar &amp; Reminders are on (Settings → [your name] → iCloud). Kingsway events sync to your Calendar and tasks with due dates sync to Reminders. Events you create on your iPhone flow back here.
            </p>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Integrations" />
          <PanelBody>
            <ul className="divide-y divide-border-subtle">
              {integrations.map((it) => {
                const configured = !!process.env[it.env];
                return (
                  <li key={it.name} className="py-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-fg">{it.name}</div>
                      <div className="text-[12px] text-fg-muted">{it.purpose}</div>
                      <div className="text-[10px] text-fg-subtle mt-0.5">env: <code>{it.env}</code></div>
                    </div>
                    <Badge tone={configured ? "success" : "muted"}>{configured ? "connected" : "not set"}</Badge>
                  </li>
                );
              })}
            </ul>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="System" />
          <PanelBody className="text-sm text-fg-muted space-y-1">
            <p>Database: <code>{process.env.DATABASE_URL ? "configured" : "missing — set DATABASE_URL"}</code></p>
            <p>Auth: NextAuth with Google + Email providers (configure GOOGLE_CLIENT_ID/SECRET to enable).</p>
            <p>Timezone: {process.env.APP_TIMEZONE ?? "America/Los_Angeles"}</p>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
