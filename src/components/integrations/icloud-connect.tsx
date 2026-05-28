"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw, Link2, Unlink } from "lucide-react";

export function ICloudConnect({
  connected,
  username,
  lastSyncAt,
}: {
  connected: boolean;
  username: string | null;
  lastSyncAt: string | null;
}) {
  const router = useRouter();
  const [appleId, setAppleId] = useState(username ?? "");
  const [appPassword, setAppPassword] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function connect() {
    start(async () => {
      setMsg(null);
      const res = await fetch("/api/integrations/icloud", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ appleId, appPassword }),
      });
      const json = await res.json();
      setMsg(json.ok ? "Connected — calendar + reminders found." : json.error ?? "Failed");
      if (json.ok) { setAppPassword(""); router.refresh(); }
    });
  }

  function sync() {
    start(async () => {
      setMsg("Syncing…");
      const res = await fetch("/api/integrations/icloud/sync", { method: "POST" });
      const json = await res.json();
      setMsg(json.ok ? `Synced — ${json.eventsPushed} events + ${json.remindersPushed} reminders pushed, ${json.eventsPulled} pulled.` : json.error ?? "Sync failed");
      router.refresh();
    });
  }

  function disconnect() {
    start(async () => {
      await fetch("/api/integrations/icloud", { method: "DELETE" });
      setMsg(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {connected ? (
        <div className="flex items-center gap-2">
          <Badge tone="success" className="gap-1"><Check className="h-3 w-3" /> Connected</Badge>
          <span className="text-xs text-fg-subtle">{username}</span>
          {lastSyncAt ? <span className="text-[10px] text-fg-subtle">· last sync {new Date(lastSyncAt).toLocaleString()}</span> : null}
        </div>
      ) : (
        <div className="text-xs text-fg-muted space-y-1">
          <p>Generate an <strong>app-specific password</strong> at appleid.apple.com → Sign-In &amp; Security → App-Specific Passwords, then paste it below with your Apple ID.</p>
        </div>
      )}

      {!connected && (
        <div className="grid grid-cols-1 gap-2">
          <Input placeholder="Apple ID (email)" value={appleId} onChange={(e) => setAppleId(e.target.value)} type="email" />
          <Input placeholder="App-specific password (xxxx-xxxx-xxxx-xxxx)" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} type="password" />
        </div>
      )}

      <div className="flex items-center gap-2">
        {connected ? (
          <>
            <Button size="sm" onClick={sync} disabled={pending}>
              <RefreshCw className={pending ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> Sync now
            </Button>
            <Button size="sm" variant="ghost" onClick={disconnect} disabled={pending}>
              <Unlink className="h-3.5 w-3.5" /> Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={connect} disabled={pending || !appleId || !appPassword}>
            <Link2 className="h-3.5 w-3.5" /> {pending ? "Connecting…" : "Connect iCloud"}
          </Button>
        )}
      </div>

      {msg ? <div className="text-[11px] text-fg-subtle">{msg}</div> : null}
    </div>
  );
}
