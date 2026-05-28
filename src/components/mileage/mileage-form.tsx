"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Car, Plus } from "lucide-react";

export function MileageForm() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [miles, setMiles] = useState("");
  const [purpose, setPurpose] = useState<"BUSINESS" | "PERSONAL">("BUSINESS");
  const [biz, setBiz] = useState<string>("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [pending, start] = useTransition();

  function submit() {
    if (!from.trim() || !to.trim() || !miles) return;
    start(async () => {
      await fetch("/api/mileage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fromLocation: from,
          toLocation: to,
          reason,
          miles: Number(miles),
          purpose,
          roundTrip,
          businessSlug: biz || null,
        }),
      });
      setFrom(""); setTo(""); setReason(""); setMiles(""); setRoundTrip(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-fg-subtle">From</label>
          <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Origin" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-fg-subtle">To</label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-fg-subtle">Reason</label>
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Client meeting, parts pickup" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-fg-subtle">Miles (one way)</label>
          <Input value={miles} onChange={(e) => setMiles(e.target.value)} inputMode="decimal" placeholder="0.0" />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setRoundTrip((r) => !r)}
            className={cn(
              "h-9 w-full rounded-lg text-sm ring-1",
              roundTrip ? "bg-bg-raised text-fg ring-accent/50" : "text-fg-muted ring-border hover:bg-bg-hover"
            )}
          >
            {roundTrip ? "Round trip ×2" : "One way"}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["BUSINESS", "PERSONAL"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPurpose(p)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs ring-1 capitalize",
              purpose === p ? "bg-bg-raised text-fg ring-accent/50" : "text-fg-muted ring-border hover:bg-bg-hover"
            )}
          >
            {p.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-fg-subtle mr-1">Business</span>
        <button
          onClick={() => setBiz("")}
          className={cn("rounded-full px-2 py-0.5 text-[11px] ring-1", biz === "" ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}
        >
          None
        </button>
        {BUSINESSES.filter((b) => b.slug !== "personal").map((b) => (
          <button
            key={b.slug}
            onClick={() => setBiz(b.slug)}
            className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1", biz === b.slug ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}
          >
            <span className={cn("dot", b.dot)} />
            {b.short}
          </button>
        ))}
      </div>

      <Button onClick={submit} disabled={pending} className="w-full">
        <Plus className="h-4 w-4" /> {pending ? "Saving…" : "Log trip"}
      </Button>
    </div>
  );
}
