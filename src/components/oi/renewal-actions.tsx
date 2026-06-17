"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export function RenewalActions({ id, hasBrief }: { id: string; hasBrief: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    await fetch(`/api/oi/renewals/${id}/brief`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={generate}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] ring-1 ring-border text-fg-muted hover:bg-bg-hover disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-accent" />}
      {hasBrief ? "Regenerate brief" : "Generate brief + plan"}
    </button>
  );
}
