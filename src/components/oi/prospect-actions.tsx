"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OUTREACH_KINDS, OUTREACH_META, OI_STAGES, STAGE_LABEL, type OutreachKind } from "@/lib/oi/constants";
import { Loader2, Search, FileText, ClipboardList, Megaphone } from "lucide-react";

export function ProspectActions({ id, stage }: { id: string; stage: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(path: string, key: string, body?: any) {
    setBusy(key);
    await fetch(`/api/oi/prospects/${id}/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(null);
    router.refresh();
  }

  async function changeStage(next: string) {
    setBusy("stage");
    await fetch(`/api/oi/prospects/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stage: next, rescore: false }),
    });
    setBusy(null);
    router.refresh();
  }

  const Spin = (k: string, Icon: any) => (busy === k ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => run("research", "research")}>{Spin("research", Search)} Research</Button>
      <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => run("summary", "summary")}>{Spin("summary", FileText)} Summary</Button>
      <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => run("account-plan", "account-plan")}>{Spin("account-plan", ClipboardList)} Account plan</Button>

      <div className="flex items-center gap-1.5 ml-auto">
        <Megaphone className="h-3.5 w-3.5 text-fg-subtle" />
        <select
          disabled={!!busy}
          defaultValue=""
          onChange={(e) => { if (e.target.value) { run("outreach", "outreach", { kind: e.target.value as OutreachKind }); e.target.value = ""; } }}
          className="h-8 rounded-lg bg-bg-raised ring-1 ring-border text-xs px-2"
        >
          <option value="" disabled>Generate outreach…</option>
          {OUTREACH_KINDS.map((k) => <option key={k} value={k}>{OUTREACH_META[k].label}</option>)}
        </select>
        <select
          disabled={!!busy}
          value={stage}
          onChange={(e) => changeStage(e.target.value)}
          className="h-8 rounded-lg bg-bg-raised ring-1 ring-border text-xs px-2"
        >
          {OI_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
        </select>
      </div>
    </div>
  );
}
