"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AGENT_ORDER, AGENTS } from "@/lib/ai/agents";
import type { AgentKind } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIPage() {
  const [agent, setAgent] = useState<AgentKind>("MASTER");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);

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
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Topbar title="AI Assistant" subtitle="Master CEO + 9 specialized agents" />
      <div className="px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Panel className="lg:col-span-1">
          <PanelHeader title="Agents" />
          <PanelBody className="space-y-1">
            {AGENT_ORDER.map((k) => (
              <button
                key={k}
                onClick={() => setAgent(k)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm ring-1 transition-colors",
                  agent === k ? "bg-bg-raised ring-accent/50 text-fg" : "ring-border text-fg-muted hover:bg-bg-hover"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{AGENTS[k].emoji}</span>
                  <span className="font-medium">{AGENTS[k].name}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-fg-subtle">{AGENTS[k].scope}</div>
              </button>
            ))}
          </PanelBody>
        </Panel>

        <Panel className="lg:col-span-3 flex flex-col min-h-[60vh]">
          <PanelHeader
            title={
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                {AGENTS[agent].emoji} {AGENTS[agent].name} Agent
              </span>
            }
            hint={AGENTS[agent].scope}
            action={<Badge tone="accent">{agent}</Badge>}
          />
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-fg-subtle">Ask anything. Try: <em>"Summarize all 6 businesses in 5 lines"</em> or <em>"Draft a follow-up to Jasmine for the RX 350"</em>.</div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                  m.role === "user" ? "ml-auto bg-accent text-bg" : "bg-bg-raised ring-1 ring-border text-fg"
                )}
              >
                {m.content}
              </div>
            ))}
            {pending && (
              <div className="bg-bg-raised text-fg-muted ring-1 ring-border rounded-2xl px-3 py-2 text-sm w-fit animate-pulse">Thinking…</div>
            )}
          </div>
          <div className="border-t border-border-subtle px-3 py-3 flex items-end gap-2">
            <Textarea
              placeholder={`Message ${AGENTS[agent].name} agent…`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
            />
            <Button onClick={send} disabled={pending || !text.trim()}>
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}
