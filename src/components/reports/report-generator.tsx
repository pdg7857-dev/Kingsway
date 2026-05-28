"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Panel, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, X } from "lucide-react";

const KINDS = [
  { kind: "daily", label: "Daily report", body: "Today's snapshot, priorities, risks." },
  { kind: "weekly", label: "Weekly CEO report", body: "Progress, wins, risks, next week." },
  { kind: "monthly", label: "Monthly financial", body: "P&L by business, cash, bills." },
  { kind: "business", label: "Business performance", body: "Per-business health and KPIs." },
  { kind: "pipeline", label: "Sales pipeline", body: "Stage velocity, top deals." },
  { kind: "content", label: "Content performance", body: "Views, engagement by platform." },
  { kind: "retention", label: "Client retention", body: "Coaching + eProc churn/renewals." },
  { kind: "inventory", label: "Inventory", body: "Low stock, value on hand." },
];

function md(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("# ")) return <h2 key={i} className="text-base font-semibold text-fg mt-2">{line.slice(2)}</h2>;
    if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-semibold text-accent mt-2">{line.slice(3)}</h3>;
    if (line.startsWith("- ")) return <li key={i} className="ml-5 list-disc text-sm text-fg-muted">{fmt(line.slice(2))}</li>;
    if (line.trim() === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-sm text-fg-muted">{fmt(line)}</p>;
  });
}
function fmt(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") ? <strong key={i} className="text-fg">{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>));
}

export function ReportGenerator() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [activeKind, setActiveKind] = useState<string | null>(null);
  const [current, setCurrent] = useState<{ title: string; body: string } | null>(null);

  function generate(kind: string) {
    setActiveKind(kind);
    start(async () => {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const json = await res.json();
      if (json.ok) {
        setCurrent({ title: json.report.title, body: json.report.body });
        router.refresh();
      }
      setActiveKind(null);
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {KINDS.map((k) => (
          <Panel key={k.kind}>
            <PanelBody>
              <Badge tone="violet" className="mb-2 capitalize">{k.kind}</Badge>
              <div className="text-sm font-medium text-fg">{k.label}</div>
              <div className="text-xs text-fg-muted mt-1 mb-3">{k.body}</div>
              <Button size="sm" variant="secondary" disabled={pending} onClick={() => generate(k.kind)} className="w-full">
                {pending && activeKind === k.kind ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                {pending && activeKind === k.kind ? "Generating…" : "Generate"}
              </Button>
            </PanelBody>
          </Panel>
        ))}
      </div>

      {current && (
        <Panel className="mt-4">
          <div className="panel-header">
            <div className="panel-title">{current.title}</div>
            <button onClick={() => setCurrent(null)} className="rounded-md p-1 text-fg-muted hover:bg-bg-hover"><X className="h-4 w-4" /></button>
          </div>
          <PanelBody>
            <div className="space-y-0.5">{md(current.body)}</div>
          </PanelBody>
        </Panel>
      )}
    </>
  );
}
