"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListTodo, Sparkles, Plus, Menu } from "lucide-react";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { MobileMenu } from "./mobile-menu";

const tabs = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [add, setAdd] = useState(false);
  const [ai, setAi] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg-subtle/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors",
                  active ? "text-accent" : "text-fg-subtle"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setAdd(true)}
            className="grid h-11 w-11 -translate-y-2 place-items-center rounded-full bg-accent text-bg shadow-[0_0_24px_-4px_hsl(186_100%_55%_/_0.7)]"
            aria-label="Quick add"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => setAi(true)}
            className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] text-fg-subtle"
          >
            <Sparkles className="h-5 w-5" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setMenu(true)}
            className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] text-fg-subtle"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
      <QuickAddDialog open={add} onClose={() => setAdd(false)} />
      <AIChatPanel open={ai} onClose={() => setAi(false)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
