import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, Hash, Tags, FileSearch, Award, BarChart3, Download, Crosshair, LogOut } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { logout } from "./login/actions";

export const metadata: Metadata = {
  title: "Opportunity Intelligence Engine",
  description: "Internal ops tool: solicitation analysis, client matching, renewal forecasting.",
};

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Analyze", icon: FileSearch },
  { href: "/imports", label: "CanadaBuys import", icon: Download },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/codes", label: "Codes", icon: Hash },
  { href: "/keywords", label: "Keywords", icon: Tags },
  { href: "/awards", label: "Awards & Renewals", icon: Award },
  { href: "/incumbents", label: "Incumbents", icon: Crosshair },
  { href: "/performance", label: "Performance", icon: BarChart3 },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();
  return (
    <html lang="en">
      <body>
        {authed ? (
          <div className="flex min-h-screen">
            <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-panel2 p-4 lg:flex">
              <div className="px-2 py-3">
                <div className="text-sm font-bold text-fg">Opportunity Intelligence</div>
                <div className="text-xs text-subtle">Engine</div>
              </div>
              <nav className="mt-4 space-y-1">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-panel hover:text-fg"
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                ))}
              </nav>
              <form action={logout} className="mt-auto pt-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-panel hover:text-fg">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </form>
            </aside>
            <main className="flex-1 p-6 lg:p-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
