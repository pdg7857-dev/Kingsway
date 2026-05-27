"use client";
import { useState } from "react";
import { Sparkles, X, Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AGENT_ORDER, AGENTS } from "@/lib/ai/agents";
import type { AgentKind } from "@prisma/client";

type Msg = { role: "user" | "assistant"; content: string };

export function AIChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [agent, setAgent] = useState<AgentKind>("MASTER");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ready. I can plan your day, summarize a business, draft messages, or pull money/inventory snapshots. Ask anything.",
    },
  ]);
  const [showAgents, setShowAgents] = useState(false);

  async function send() {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agent, messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.content ?? "(no response)" }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network error — try again in a moment." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none opacity-0")}>
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-[480px] bg-bg-panel border-l border-border flex flex-col transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="panel-header">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-accent-soft text-accent">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <button
                onClick={() => setShowAgents((s) => !s)}
                className="flex items-center gap-1 text-sm font-semibold text-fg"
              >
                {AGENTS[agent].emoji} {AGENTS[agent].name} Agent
                <ChevronDown className="h-3 w-3 text-fg-muted" />
              </button>
              <div className="text-[10px] text-fg-subtle truncate">{AGENTS[agent].scope}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-fg-muted hover:bg-bg-hover">
            <X className="h-4 w-4" />
          </button>
        </div>

        {showAgents ? (
          <div className="border-b border-border-subtle px-3 py-2 grid grid-cols-2 gap-1">
            {AGENT_ORDER.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setAgent(k);
                  setShowAgents(false);
                }}
                className={cn(
                  "rounded-md px-2 py-1.5 text-left text-xs ring-1",
                  agent === k ? "ring-accent/50 bg-bg-raised text-fg" : "ring-border text-fg-muted hover:bg-bg-hover"
                )}
              >
                <span className="mr-1">{AGENTS[k].emoji}</span>
                {AGENTS[k].name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "ml-auto bg-accent text-bg"
                  : "bg-bg-raised text-fg ring-1 ring-border"
              )}
            >
              {m.content}
            </div>
          ))}
          {pending && (
            <div className="bg-bg-raised text-fg-muted ring-1 ring-border rounded-2xl px-3 py-2 text-sm w-fit animate-pulse">
              Thinking…
            </div>
          )}
        </div>

        <div className="border-t border-border-subtle px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Ask the CEO AI…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              className="min-h-[44px]"
            />
            <Button onClick={send} disabled={pending || !text.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
