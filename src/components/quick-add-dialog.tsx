"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BUSINESSES } from "@/lib/constants";
import { Plus, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickAddDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [kind, setKind] = useState<"task" | "idea" | "expense">("task");
  const [text, setText] = useState("");
  const [biz, setBiz] = useState<string | "">("");
  const [pending, start] = useTransition();

  function submit() {
    if (!text.trim()) return;
    start(async () => {
      const endpoint =
        kind === "task" ? "/api/tasks/quick-add" : kind === "idea" ? "/api/ideas" : "/api/expenses";
      await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, businessSlug: biz || null }),
      });
      setText("");
      onClose();
      router.refresh();
    });
  }

  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none opacity-0")}>
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-[10vh] w-[94vw] max-w-[520px] -translate-x-1/2">
        <div className="panel relative overflow-hidden">
          <div className="panel-header">
            <div className="panel-title">Quick add</div>
            <button onClick={onClose} className="rounded-md p-1 text-fg-muted hover:bg-bg-hover">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex gap-2">
              {(["task", "idea", "expense"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs ring-1",
                    kind === k ? "bg-bg-raised text-fg ring-accent/50" : "text-fg-muted ring-border hover:bg-bg-hover"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>

            <Textarea
              placeholder={
                kind === "task"
                  ? "What needs to get done?  (e.g. 'Call Jasmine back tomorrow at 10am')"
                  : kind === "idea"
                  ? "Capture an idea — AI will expand it later."
                  : "Describe the expense (vendor, amount, what it's for)"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              rows={3}
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-fg-subtle">Business</span>
              <button
                onClick={() => setBiz("")}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] ring-1",
                  biz === "" ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle"
                )}
              >
                Any
              </button>
              {BUSINESSES.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setBiz(b.slug)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1",
                    biz === b.slug ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle"
                  )}
                >
                  <span className={cn("dot", b.dot)} />
                  {b.short}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Badge tone="accent" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI parses date / priority
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={pending} onClick={submit}>
                  <Plus className="h-4 w-4" /> {pending ? "Saving…" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
