"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BUSINESSES } from "@/lib/constants";
import {
  LayoutDashboard, ListTodo, Calendar, Lightbulb, Users, Briefcase, Wallet,
  Boxes, Zap, BarChart3, Sparkles, Bell, Settings, Building2, Car, ReceiptText,
} from "lucide-react";

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
  { href: "/automations", label: "Automations", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex sticky top-0 h-dvh w-[260px] shrink-0 flex-col border-r border-border bg-bg-subtle/60 backdrop-blur-md">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet shadow-[0_0_20px_-4px_hsl(186_100%_55%_/_0.6)]">
          <span className="font-mono text-[10px] font-bold text-bg">OS</span>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-gradient-accent">CEO Command</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Operating System</div>
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
