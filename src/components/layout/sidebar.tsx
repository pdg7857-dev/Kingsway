"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BUSINESSES } from "@/lib/constants";
import {
  LayoutDashboard, ListTodo, Calendar, Lightbulb, Users, Briefcase, Wallet,
  Boxes, Zap, BarChart3, Sparkles, Bell, Settings, Building2, Car, ReceiptText, Mail, Coins,
  Target, Gauge, CalendarClock, Layers, Flame,
} from "lucide-react";

const intel = [
  { href: "/oi", label: "OI Dashboard", icon: Gauge },
  { href: "/oi/prospects", label: "Prospects", icon: Target },
  { href: "/oi/renewals", label: "Renewals", icon: CalendarClock },
  { href: "/oi/buyers", label: "Buyers", icon: Building2 },
  { href: "/oi/platforms", label: "Platforms", icon: Layers },
  { href: "/oi/waste", label: "Waste Calculator", icon: Flame },
];

const main = [
  { href: "/", label: "Master", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/pipeline", label: "Pipeline", icon: Briefcase },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/mileage", label: "Mileage", icon: Car },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/gmail", label: "Gmail", icon: Mail },
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/ai-usage", label: "AI Usage", icon: Coins },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex sticky top-0 h-dvh w-[260px] shrink-0 flex-col border-r border-border bg-bg-subtle/60 backdrop-blur-md">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-violet shadow-[0_0_24px_-4px_hsl(184_100%_52%_/_0.7)]">
          <span className="font-mono text-[11px] font-bold text-bg">K</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight text-gradient-accent">Kingsway OS</div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-fg-subtle">Command Center</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="mb-2 mt-2 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {main.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} className={cn("nav-item", active && "nav-item-active")}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mb-2 mt-5 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
          Opportunity Intelligence
        </div>
        <ul className="space-y-0.5">
          {intel.map(({ href, label, icon: Icon }) => {
            const active = href === "/oi" ? pathname === "/oi" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link href={href} className={cn("nav-item", active && "nav-item-active")}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mb-2 mt-5 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
          Businesses
        </div>
        <ul className="space-y-0.5">
          {BUSINESSES.map((b) => {
            const active = pathname.startsWith(b.href);
            return (
              <li key={b.slug}>
                <Link href={b.href} className={cn("nav-item", active && "nav-item-active")}>
                  <span className={cn("dot", b.dot)} />
                  <span className="truncate">{b.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mb-2 mt-5 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-subtle">
          System
        </div>
        <ul className="space-y-0.5">
          <li>
            <Link href="/settings" className={cn("nav-item", pathname.startsWith("/settings") && "nav-item-active")}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/settings/businesses" className="nav-item">
              <Building2 className="h-4 w-4" />
              <span>Manage businesses</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-border-subtle text-[11px] text-fg-subtle flex items-center gap-2">
        <span className="dot bg-success animate-pulseGlow" />
        <span>All systems nominal</span>
      </div>
    </aside>
  );
}
