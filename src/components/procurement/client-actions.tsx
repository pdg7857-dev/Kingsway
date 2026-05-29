"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { fmtCents, cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";

const STATUSES = ["LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "ACTIVE", "LOST", "PAUSED", "CHURNED"];

export type UIClient = {
  id: string;
  name: string;
  company: string | null;
  industry: string | null;
  status: string;
  touchCount: number;
  monthlyFeeCents: number;
};

export function ProcurementClients({ clients: initial }: { clients: UIClient[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();

  async function patch(id: string, body: any) {
    setBusy(id);
    const res = await fetch(`/api/procurement/clients/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.client) {
      setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: json.client.status, touchCount: json.client.touchCount } : c)));
    }
    setBusy(null);
    start(() => router.refresh());
  }

  if (clients.length === 0) return <div className="text-sm text-fg-subtle py-2">No clients yet.</div>;

  return (
    <ul className="divide-y divide-border-subtle">
      {clients.map((c) => (
        <li key={c.id} className="py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-fg truncate">{c.company ?? c.name}</div>
            <div className="text-[11px] text-fg-subtle truncate">{c.industry ?? "—"} · {fmtCents(c.monthlyFeeCents)}/mo</div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => patch(c.id, { touch: true })}
              disabled={busy === c.id}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] ring-1 ring-border text-fg-muted hover:bg-bg-hover"
              title="Log a touch"
            >
              {busy === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
              {c.touchCount} touch{c.touchCount === 1 ? "" : "es"}
            </button>

            <select
              value={c.status}
              onChange={(e) => patch(c.id, { status: e.target.value })}
              disabled={busy === c.id}
              className="rounded-md bg-bg-raised text-[11px] text-fg ring-1 ring-border px-1.5 py-1 outline-none focus:ring-accent"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </li>
      ))}
    </ul>
  );
}
