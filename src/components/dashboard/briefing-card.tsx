"use client";
import { useState, useTransition } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function renderMarkdown(text: string) {
  // Tiny markdown — bold + headings + lists. Keep dependencies minimal.
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("- ")) return <li key={i} className="list-disc ml-5 text-fg">{format(line.slice(2))}</li>;
      if (line.startsWith("**") && line.endsWith("**"))
        return <h4 key={i} className="text-xs font-semibold uppercase tracking-wider text-accent mt-2">{line.slice(2, -2)}</h4>;
      if (line.trim() === "") return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-sm text-fg-muted">{format(line)}</p>;
    });
}
function format(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") ? <strong key={i} className="text-fg">{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

export function BriefingCard({ initial, createdAt }: { initial: string; createdAt?: Date | null }) {
  const [text, setText] = useState(initial);
  const [pending, start] = useTransition();

  function refresh() {
    start(async () => {
      const res = await fetch("/api/ai/briefing", { method: "POST" });
      const data = await res.json();
      if (data?.summary) setText(data.summary);
    });
  }

  return (
    <Panel className="lg:col-span-2 scanline">
      <PanelHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Daily CEO Briefing
          </span>
        }
        hint={createdAt ? `Generated ${new Date(createdAt).toLocaleString()}` : "Auto-refreshes each morning"}
        action={
          <Button size="sm" variant="ghost" onClick={refresh} disabled={pending} className="gap-1.5">
            <RefreshCw className={pending ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            {pending ? "Generating…" : "Refresh"}
          </Button>
        }
      />
      <PanelBody>
        <div className="space-y-0.5">{renderMarkdown(text)}</div>
      </PanelBody>
    </Panel>
  );
}
