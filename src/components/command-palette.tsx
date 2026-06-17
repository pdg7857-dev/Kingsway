"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { BUSINESSES } from "@/lib/constants";
import {
  LayoutDashboard, ListTodo, Calendar, Lightbulb, Users, Briefcase, Wallet,
  Boxes, Zap, BarChart3, Sparkles, Bell, Search, Car, ReceiptText, Mail, Coins, Settings,
  Gauge, Target, CalendarClock, Building2, Layers, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Master Dashboard", icon: LayoutDashboard },
  { href: "/oi", label: "Opportunity Intelligence", icon: Gauge },
  { href: "/oi/prospects", label: "OI · Prospects", icon: Target },
  { href: "/oi/renewals", label: "OI · Renewals", icon: CalendarClock },
  { href: "/oi/buyers", label: "OI · Buyers", icon: Building2 },
  { href: "/oi/platforms", label: "OI · Platforms", icon: Layers },
  { href: "/oi/waste", label: "OI · Waste Calculator", icon: Flame },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/ideas", label: "Ideas inbox", icon: Lightbulb },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/pipeline", label: "Sales pipeline", icon: Briefcase },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/receipts", label: "Scan receipt", icon: ReceiptText },
  { href: "/mileage", label: "Mileage & travel", icon: Car },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/gmail", label: "Gmail", icon: Mail },
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/ai-usage", label: "AI usage & spend", icon: Coins },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

type Hit = { type: string; label: string; sub?: string; href: string };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.trim().length < 2) {
      setHits([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setHits(data.hits ?? []);
      } catch {
        setHits([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

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

  const q = query.trim().toLowerCase();
  const filteredLinks = q.length < 2 ? links : links.filter((l) => l.label.toLowerCase().includes(q));
  const filteredBusinesses = q.length < 2 ? BUSINESSES : BUSINESSES.filter((b) => b.name.toLowerCase().includes(q) || b.short.toLowerCase().includes(q));

  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none opacity-0")}>
      <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute left-1/2 top-[12vh] w-[92vw] max-w-[560px] -translate-x-1/2">
        <Command label="Command palette" shouldFilter={false} className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
            <Search className="h-4 w-4 text-fg-subtle" />
            <Command.Input
              data-cmdk-input
              value={query}
              onValueChange={setQuery}
              placeholder="Search your data or jump anywhere…"
              className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
            {searching ? <span className="text-[10px] text-fg-subtle">…</span> : <span className="kbd">ESC</span>}
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {hits.length > 0 && (
              <Command.Group heading="Results" className="text-[10px] uppercase tracking-wider text-fg-subtle px-2">
                {hits.map((h, i) => (
                  <Command.Item
                    key={`${h.type}-${i}`}
                    value={`hit-${i}-${h.label}`}
                    onSelect={() => go(h.href)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg cursor-pointer data-[selected=true]:bg-bg-hover"
                  >
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wide bg-bg-raised text-fg-subtle ring-1 ring-border">{h.type}</span>
                    <span className="truncate">{h.label}</span>
                    {h.sub ? <span className="ml-auto truncate text-[11px] text-fg-subtle">{h.sub}</span> : null}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {filteredLinks.length > 0 && (
              <Command.Group heading="Go to" className="text-[10px] uppercase tracking-wider text-fg-subtle px-2 mt-2">
                {filteredLinks.map(({ href, label, icon: Icon }) => (
                  <Command.Item
                    key={href}
                    value={`nav-${href}`}
                    onSelect={() => go(href)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg cursor-pointer data-[selected=true]:bg-bg-hover"
                  >
                    <Icon className="h-4 w-4 text-fg-muted" />
                    <span>{label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {filteredBusinesses.length > 0 && (
              <Command.Group heading="Businesses" className="text-[10px] uppercase tracking-wider text-fg-subtle px-2 mt-2">
                {filteredBusinesses.map((b) => (
                  <Command.Item
                    key={b.slug}
                    value={`biz-${b.slug}`}
                    onSelect={() => go(b.href)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg cursor-pointer data-[selected=true]:bg-bg-hover"
                  >
                    <span className={cn("dot", b.dot)} />
                    <span>{b.name}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {query.trim().length >= 2 && !searching && hits.length === 0 && filteredLinks.length === 0 && filteredBusinesses.length === 0 && (
              <div className="px-3 py-6 text-sm text-fg-subtle">No matches for “{query}”.</div>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
