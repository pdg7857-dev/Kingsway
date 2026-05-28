"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { BUSINESSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const sections: Array<{ title: string; items: { href: string; label: string }[] }> = [
  {
    title: "Workspace",
    items: [
      { href: "/", label: "Master Dashboard" },
      { href: "/tasks", label: "Tasks" },
      { href: "/calendar", label: "Calendar" },
      { href: "/ideas", label: "Ideas" },
      { href: "/pipeline", label: "Pipeline" },
      { href: "/customers", label: "Customers" },
      { href: "/finance", label: "Finance" },
      { href: "/receipts", label: "Scan receipt" },
      { href: "/mileage", label: "Mileage" },
      { href: "/inventory", label: "Inventory" },
      { href: "/automations", label: "Automations" },
      { href: "/reports", label: "Reports" },
      { href: "/notifications", label: "Notifications" },
    ],
  },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-50 transition-opacity",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[88vw] max-w-[360px] bg-bg-panel border-l border-border p-4 transition-transform overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gradient-accent">CEO Command</div>
          <button onClick={onClose} className="rounded-md p-1 text-fg-muted hover:bg-bg-hover">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sections.map((s) => (
          <div key={s.title} className="mt-4">
            <div className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">{s.title}</div>
            <ul className="space-y-0.5">
              {s.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} onClick={onClose} className="nav-item">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-4">
          <div className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Businesses</div>
          <ul className="space-y-0.5">
            {BUSINESSES.map((b) => (
              <li key={b.slug}>
                <Link href={b.href} onClick={onClose} className="nav-item">
                  <span className={cn("dot", b.dot)} />
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
