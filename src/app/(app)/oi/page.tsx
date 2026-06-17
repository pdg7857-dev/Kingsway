import Link from "next/link";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge, MiniScore } from "@/components/oi/ui";
import { requireCurrentUser } from "@/lib/auth";
import { getOiOverview } from "@/lib/data/oi";
import { fmtCents, relTime } from "@/lib/utils";
import { fmtDollars, TIER_META, ALERT_WINDOW_META } from "@/lib/oi/constants";
import { platformName } from "@/lib/oi/platforms";
import { Target, Flame, CalendarClock, Building2, Layers, Trophy, ArrowUpRight, Gauge, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OiDashboard() {
  const user = await requireCurrentUser();
  const o = await getOiOverview(user.id);

  const kpis = [
    { label: "Prospects", value: o.counts.total, hint: `${o.counts.scored} scored`, icon: Target, tone: "text-accent" },
    { label: "Contact today", value: o.counts.contactToday, hint: "GOII Index™ ≥ 80", icon: Flame, tone: "text-danger" },
    { label: "Tier A / B / C", value: `${o.counts.tier.A} / ${o.counts.tier.B} / ${o.counts.tier.C}`, hint: "ranked book", icon: Gauge, tone: "text-success" },
    { label: "Pipeline ARR", value: fmtCents(o.pipelineAnnualCents), hint: "A/B/C annual value", icon: Wallet, tone: "text-violet" },
    { label: "Book LTV", value: fmtCents(o.pipelineLtvCents), hint: "est. lifetime value", icon: Trophy, tone: "text-success" },
    { label: "Renewals tracked", value: o.counts.renewals, hint: `${o.counts.buyers} buyers`, icon: CalendarClock, tone: "text-warn" },
  ];

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gradient-accent">Opportunity Intelligence</h1>
          <p className="text-xs text-fg-subtle mt-0.5">CEO command view — who to contact, why, and what they're worth.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/oi/prospects" className="pill bg-accent-soft text-accent ring-1 ring-accent/30">All prospects →</Link>
          <Link href="/oi/waste" className="pill bg-bg-raised text-fg-muted ring-1 ring-border">Waste calculator</Link>
          <a href="/goii" target="_blank" rel="noreferrer" className="pill bg-bg-raised text-fg-muted ring-1 ring-border">Public site ↗</a>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="panel p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-fg-subtle">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.tone}`} />
            </div>
            <div className="mt-2 stat-value text-[20px]">{k.value}</div>
            <div className="mt-1 text-xs text-fg-subtle">{k.hint}</div>
          </div>
        ))}
      </section>

      {/* Tier distribution */}
      <Panel>
        <PanelHeader title="Tier distribution" hint="Ranked by likelihood to become recurring clients" />
        <PanelBody>
          <div className="flex h-3 rounded-full overflow-hidden ring-1 ring-border">
            {(["A", "B", "C", "D"] as const).map((t) => {
              const n = o.counts.tier[t];
              const pct = o.counts.total ? (n / o.counts.total) * 100 : 0;
              const bg = t === "A" ? "hsl(150 70% 50%)" : t === "B" ? "hsl(186 100% 55%)" : t === "C" ? "hsl(210 90% 60%)" : "hsl(220 10% 35%)";
              return <div key={t} style={{ width: `${pct}%`, background: bg }} title={`${TIER_META[t].label}: ${n}`} />;
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {(["A", "B", "C", "D"] as const).map((t) => (
              <div key={t} className="rounded-lg bg-bg-raised/40 ring-1 ring-border p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg">{TIER_META[t].label}</span>
                  <span className="font-mono text-sm">{o.counts.tier[t]}</span>
                </div>
                <div className="text-[10px] text-fg-subtle">{TIER_META[t].action}</div>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top prospects */}
        <Panel>
          <PanelHeader title="Top prospects" hint="Highest GOII Index™" action={<Link href="/oi/prospects" className="text-xs text-accent">View all</Link>} />
          <PanelBody className="p-0">
            <ProspectRows rows={o.topProspects} />
          </PanelBody>
        </Panel>

        {/* Highest value accounts */}
        <Panel>
          <PanelHeader title="Highest-value accounts" hint="By estimated lifetime value" />
          <PanelBody className="p-0">
            <ul className="divide-y divide-border-subtle">
              {o.highestValue.map((p) => (
                <li key={p.id} className="px-5 py-2.5 flex items-center gap-3">
                  <MiniScore score={p.score} />
                  <Link href={`/oi/prospects/${p.id}`} className="min-w-0 flex-1 hover:text-accent">
                    <div className="text-sm text-fg truncate">{p.companyName}</div>
                    <div className="text-[11px] text-fg-subtle truncate">{p.industry ?? "—"} · {p.recommendedPricingTier ?? "—"}</div>
                  </Link>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm text-success">{fmtCents(p.estLtvCents ?? 0)}</div>
                    <div className="text-[10px] text-fg-subtle">{fmtCents(p.estAnnualValueCents ?? 0)}/yr</div>
                  </div>
                </li>
              ))}
              {o.highestValue.length === 0 && <li className="px-5 py-4 text-sm text-fg-subtle">No scored prospects yet.</li>}
            </ul>
          </PanelBody>
        </Panel>

        {/* Upcoming renewals */}
        <Panel>
          <PanelHeader title="Upcoming renewals" hint="Predicted rebid windows" action={<Link href="/oi/renewals" className="text-xs text-accent">View all</Link>} />
          <PanelBody className="p-0">
            <ul className="divide-y divide-border-subtle">
              {o.upcomingRenewals.map((r) => {
                const w = r.alertWindow ? ALERT_WINDOW_META[r.alertWindow as keyof typeof ALERT_WINDOW_META] : null;
                return (
                  <li key={r.id} className="px-5 py-2.5 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-fg truncate">{r.title}</div>
                      <div className="text-[11px] text-fg-subtle truncate">{r.buyer?.organization ?? r.agency ?? "—"} · rebid {relTime(r.likelyRebidStart)}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {r.expectedValueDollars != null && <div className="font-mono text-sm">{fmtDollars(r.expectedValueDollars)}</div>}
                      {w && <Badge tone={w.tone as any}>{w.label}</Badge>}
                    </div>
                  </li>
                );
              })}
              {o.upcomingRenewals.length === 0 && <li className="px-5 py-4 text-sm text-fg-subtle">No renewals tracked yet.</li>}
            </ul>
          </PanelBody>
        </Panel>

        {/* Top buyers */}
        <Panel>
          <PanelHeader title="Most valuable buyers" hint="By total awarded" action={<Link href="/oi/buyers" className="text-xs text-accent">View all</Link>} />
          <PanelBody className="p-0">
            <ul className="divide-y divide-border-subtle">
              {o.topBuyers.map((b) => (
                <li key={b.id} className="px-5 py-2.5 flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-fg-subtle shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-fg truncate">{b.organization}</div>
                    <div className="text-[11px] text-fg-subtle truncate">{b.region ?? "—"} · {b.commodityCategories.slice(0, 2).join(", ") || "categories tbd"}</div>
                  </div>
                  <div className="font-mono text-sm shrink-0">{fmtDollars(b.totalAwardedDollars)}</div>
                </li>
              ))}
              {o.topBuyers.length === 0 && <li className="px-5 py-4 text-sm text-fg-subtle">No buyers yet.</li>}
            </ul>
          </PanelBody>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <PanelHeader title="Most common platforms" hint="Across the prospect book" />
          <PanelBody>
            <div className="flex flex-wrap gap-2">
              {o.topPlatforms.map(([name, n]) => (
                <span key={name} className="pill bg-bg-raised text-fg ring-1 ring-border">
                  <Layers className="h-3 w-3 text-accent" /> {platformName(name)} <span className="text-fg-subtle">×{n}</span>
                </span>
              ))}
              {o.topPlatforms.length === 0 && <span className="text-sm text-fg-subtle">No platform data yet.</span>}
            </div>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader title="Most valuable industries" hint="By summed lifetime value" />
          <PanelBody className="p-0">
            <ul className="divide-y divide-border-subtle">
              {o.topIndustries.map(([name, v]) => (
                <li key={name} className="px-5 py-2 flex items-center justify-between">
                  <span className="text-sm text-fg">{name}</span>
                  <span className="text-xs text-fg-subtle">{v.count} · <span className="font-mono text-success">{fmtCents(v.ltv)}</span></span>
                </li>
              ))}
              {o.topIndustries.length === 0 && <li className="px-5 py-4 text-sm text-fg-subtle">No industry data yet.</li>}
            </ul>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

function ProspectRows({ rows }: { rows: any[] }) {
  if (rows.length === 0) return <div className="px-5 py-4 text-sm text-fg-subtle">No prospects yet — import or add one.</div>;
  return (
    <ul className="divide-y divide-border-subtle">
      {rows.map((p) => (
        <li key={p.id} className="px-5 py-2.5 flex items-center gap-3">
          <MiniScore score={p.score} />
          <Link href={`/oi/prospects/${p.id}`} className="min-w-0 flex-1 group">
            <div className="text-sm text-fg truncate group-hover:text-accent flex items-center gap-1">
              {p.companyName} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="text-[11px] text-fg-subtle truncate">{p.industry ?? "—"}{p.region ? ` · ${p.region}` : ""}</div>
          </Link>
          <TierBadge tier={p.tier} />
        </li>
      ))}
    </ul>
  );
}
