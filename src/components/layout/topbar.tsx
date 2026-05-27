"use client";
import { useState } from "react";
import { Search, Sparkles, Plus, Bell, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { CommandPalette } from "@/components/command-palette";

export function Topbar({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [showAI, setShowAI] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCmd, setShowCmd] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-subtle/70 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 lg:px-6 py-3">
        <div className="min-w-0 flex-1">
          {title ? <h1 className="text-base font-semibold text-fg truncate">{title}</h1> : null}
          {subtitle ? <p className="text-xs text-fg-subtle truncate">{subtitle}</p> : null}
        </div>

        <button
          onClick={() => setShowCmd(true)}
          className={cn(
            "hidden md:inline-flex items-center gap-2 rounded-lg bg-bg-raised px-3 py-1.5 text-xs text-fg-subtle ring-1 ring-border hover:bg-bg-hover hover:text-fg transition-colors"
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or run a command…</span>
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
        </button>

        <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setShowCmd(true)}>
          <Search className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" onClick={() => setShowAdd(true)} title="Quick add">
          <Plus className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="ghost" title="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="secondary" onClick={() => setShowAI(true)} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="hidden sm:inline">CEO AI</span>
        </Button>
      </div>

      <CommandPalette open={showCmd} onClose={() => setShowCmd(false)} />
      <QuickAddDialog open={showAdd} onClose={() => setShowAdd(false)} />
      <AIChatPanel open={showAI} onClose={() => setShowAI(false)} />
    </header>
  );
}
