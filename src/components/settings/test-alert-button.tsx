"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function TestAlertButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function test() {
    start(async () => {
      setMsg(null);
      const res = await fetch("/api/notifications/test", { method: "POST" });
      const json = await res.json();
      setMsg(json.ok ? `Sent via ${json.channels.join(", ")}.` : json.error ?? "Failed");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" onClick={test} disabled={pending}>
        <Send className="h-3.5 w-3.5" /> {pending ? "Sending…" : "Send test alert"}
      </Button>
      {msg ? <span className="text-[11px] text-fg-subtle">{msg}</span> : null}
    </div>
  );
}
