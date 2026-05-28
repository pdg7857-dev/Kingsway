"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { BUSINESSES } from "@/lib/constants";
import {
  LayoutDashboard, ListTodo, Calendar, Lightbulb, Users, Briefcase, Wallet,
  Boxes, Zap, BarChart3, Sparkles, Bell, Search, Car, ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Master Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/ideas", label: "Ideas inbox", icon: Lightbulb },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/pipeline", label: "Sales pipeline", icon: Briefcase },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/receipts", label: "Scan receipt", icon: ReceiptText },
  { href: "/mileage", label: "Mileage log", icon: Car },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) onClose();
        else (document.querySelector("[data-cmdk-input]") as HTMLInputElement | null)?.focus();
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none opacity-0")}>
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute left-1/2 top-[12vh] w-[92vw] max-w-[560px] -translate-x-1/2">
        <Command label="Command palette" className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
            <Search className="h-4 w-4 text-fg-subtle" />
            <Command.Input
              data-cmdk-input
              placeholder="Jump to anything, run an action…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
            <span className="kbd">ESC</span>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-sm text-fg-subtle">No results.</Command.Empty>
            <Command.Group heading="Workspace" className="text-[10px] uppercase tracking-wider text-fg-subtle px-2">
              {links.map(({ href, label, icon: Icon }) => (
                <Command.Item
                  key={href}
                  onSelect={() => go(href)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg cursor-pointer data-[selected=true]:bg-bg-hover"
                >
                  <Icon className="h-4 w-4 text-fg-muted" />
                  <span>{label}</span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Businesses" className="text-[10px] uppercase tracking-wider text-fg-subtle px-2 mt-2">
              {BUSINESSES.map((b) => (
                <Command.Item
                  key={b.slug}
                  onSelect={() => go(b.href)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg cursor-pointer data-[selected=true]:bg-bg-hover"
                >
                  <span className={cn("dot", b.dot)} />
                  <span>{b.name}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
