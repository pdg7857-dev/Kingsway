"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function GmailSyncButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function sync() {
    start(async () => {
      setMsg(null);
      const res = await fetch("/api/gmail/sync", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setMsg(`Synced — ${json.imported} new`);
        router.refresh();
      } else {
        setMsg(json.error ?? "Sync failed");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {msg ? <span className="text-[11px] text-fg-subtle">{msg}</span> : null}
      <Button size="sm" variant="secondary" onClick={sync} disabled={pending} className="gap-1.5">
        <RefreshCw className={pending ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
        {pending ? "Scanning…" : "Scan Gmail"}
      </Button>
    </div>
  );
}
