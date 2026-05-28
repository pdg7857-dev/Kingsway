"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

type Kind = "expense" | "revenue" | "bill" | "card";

export function FinanceAdd() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("expense");
  const [pending, start] = useTransition();
  const [f, setF] = useState<Record<string, string>>({});
  const [biz, setBiz] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const dollarsToCents = (v: string) => Math.round(parseFloat(v || "0") * 100);

  function submit() {
    start(async () => {
      let url = "";
      let payload: any = { businessSlug: biz || null };
      if (kind === "expense") {
        url = "/api/expenses";
        payload = { ...payload, vendor: f.vendor, amountCents: dollarsToCents(f.amount), date: f.date || undefined };
      } else if (kind === "revenue") {
        url = "/api/revenue";
        payload = { ...payload, source: f.source, amountCents: dollarsToCents(f.amount), date: f.date || undefined };
      } else if (kind === "bill") {
        url = "/api/bills";
        payload = { ...payload, vendor: f.vendor, amountCents: dollarsToCents(f.amount), dueAt: f.dueAt };
      } else if (kind === "card") {
        url = "/api/credit-cards";
        payload = { name: f.name, last4: f.last4, network: f.network, limitCents: dollarsToCents(f.limit), balanceCents: dollarsToCents(f.balance), statementDay: f.statementDay ? Number(f.statementDay) : null, paymentDueDay: f.dueDay ? Number(f.dueDay) : null };
      }
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        setF({});
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add
      </Button>
    );
  }

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["expense", "revenue", "bill", "card"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn("rounded-lg px-3 py-1.5 text-xs ring-1 capitalize", kind === k ? "bg-bg-raised text-fg ring-accent/50" : "text-fg-muted ring-border hover:bg-bg-hover")}
            >
              {k}
            </button>
          ))}
        </div>
        <button onClick={() => setOpen(false)} className="rounded-md p-1 text-fg-muted hover:bg-bg-hover"><X className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {kind === "expense" && (<>
          <Input placeholder="Vendor" value={f.vendor ?? ""} onChange={set("vendor")} />
          <Input placeholder="Amount $" inputMode="decimal" value={f.amount ?? ""} onChange={set("amount")} />
          <Input type="date" value={f.date ?? ""} onChange={set("date")} className="col-span-2" />
        </>)}
        {kind === "revenue" && (<>
          <Input placeholder="Source" value={f.source ?? ""} onChange={set("source")} />
          <Input placeholder="Amount $" inputMode="decimal" value={f.amount ?? ""} onChange={set("amount")} />
          <Input type="date" value={f.date ?? ""} onChange={set("date")} className="col-span-2" />
        </>)}
        {kind === "bill" && (<>
          <Input placeholder="Vendor" value={f.vendor ?? ""} onChange={set("vendor")} />
          <Input placeholder="Amount $" inputMode="decimal" value={f.amount ?? ""} onChange={set("amount")} />
          <Input type="date" value={f.dueAt ?? ""} onChange={set("dueAt")} className="col-span-2" />
        </>)}
        {kind === "card" && (<>
          <Input placeholder="Card name" value={f.name ?? ""} onChange={set("name")} />
          <Input placeholder="Last 4" maxLength={4} value={f.last4 ?? ""} onChange={set("last4")} />
          <Input placeholder="Network (visa/amex)" value={f.network ?? ""} onChange={set("network")} />
          <Input placeholder="Limit $" inputMode="decimal" value={f.limit ?? ""} onChange={set("limit")} />
          <Input placeholder="Balance $" inputMode="decimal" value={f.balance ?? ""} onChange={set("balance")} />
          <Input placeholder="Due day (1-31)" inputMode="numeric" value={f.dueDay ?? ""} onChange={set("dueDay")} />
        </>)}
      </div>

      {kind !== "card" && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setBiz("")} className={cn("rounded-full px-2 py-0.5 text-[11px] ring-1", biz === "" ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}>Any</button>
          {BUSINESSES.map((b) => (
            <button key={b.slug} onClick={() => setBiz(b.slug)} className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1", biz === b.slug ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}>
              <span className={cn("dot", b.dot)} />{b.short}
            </button>
          ))}
        </div>
      )}

      <Button onClick={submit} disabled={pending} className="w-full">
        <Plus className="h-4 w-4" /> {pending ? "Saving…" : `Add ${kind}`}
      </Button>
    </div>
  );
}
