import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing, TierBadge, ComponentBar } from "@/components/oi/ui";
import { ProspectActions } from "@/components/oi/prospect-actions";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreProspect } from "@/lib/oi/scoring";
import { wasteBand } from "@/lib/oi/waste";
import { fmtCents, relTime } from "@/lib/utils";
import { fmtDollars, OUTREACH_META, type OutreachKind } from "@/lib/oi/constants";
import { ArrowLeft, Globe, Mail, Phone, MapPin, Flame, CheckCircle2, XCircle, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProspectDetail({ params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const p = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: {
      awards: { orderBy: { awardDate: "desc" } },
      outreach: { orderBy: { createdAt: "desc" } },
      renewals: { include: { buyer: true } },
    },
  });
  if (!p || p.userId !== user.id) notFound();

  const s = scoreProspect(p);
  const waste = s.waste;

  const answers: { q: string; a: React.ReactNode }[] = [
    { q: "1. Likely to buy?", a: <span className={s.likelihoodToBuy >= 65 ? "text-success" : "text-fg"}>{s.likelihoodToBuy}/100 · {s.label}</span> },
    { q: "2. Why would they buy?", a: waste.topDrivers[0] ?? "Reduce opportunity waste" },
    { q: "3. Opportunities that matter", a: p.awardCategories.slice(0, 3).join(", ") || p.industry || "—" },
    { q: "4. Platforms that matter", a: p.primaryPlatforms.join(", ") || "—" },
    { q: "5. Won gov contracts?", a: p.hasWonGov ? `Yes · ${p.awardCount} · ${fmtDollars(p.totalWonDollars)}` : "Not yet confirmed" },
    { q: "6. Who buys from them", a: p.awardingDepts.slice(0, 2).join(", ") || "—" },
    { q: "7. Renewals soon", a: p.renewals.length ? `${p.renewals.length} tracked` : "None tracked" },
    { q: "8. Opportunity waste", a: <span className="text-warn">{fmtCents(p.opportunityWasteCents ?? s.opportunityWasteCents)}/yr</span> },
    { q: "9. GOII Index™", a: <span className="font-mono">{s.score}/100</span> },
    { q: "10. Outreach angle", a: <Link href="#outreach" className="text-accent">See outreach ↓</Link> },
    { q: "11. Recommended package", a: `${s.recommendedPricingTier} · ${fmtCents(s.recommendedMonthlyFeeCents)}/mo` },
    { q: "12. Estimated LTV", a: <span className="text-success">{fmtCents(s.estLtvCents)}</span> },
    { q: "13. Contact today?", a: s.shouldContactToday ? <span className="text-danger font-medium">Yes — today</span> : "Nurture cadence" },
  ];

  return (
    <div className="px-4 lg:px-6 py-4 space-y-4">
      <Link href="/oi/prospects" className="inline-flex items-center gap-1 text-xs text-fg-subtle hover:text-fg"><ArrowLeft className="h-3.5 w-3.5" /> All prospects</Link>

      {/* Header */}
      <Panel>
        <PanelBody>
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="shrink-0 flex items-center gap-4">
              <ScoreRing score={s.score} size={96} label="GOII™" />
              <div className="lg:hidden"><TierBadge tier={p.tier} /></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight">{p.companyName}</h1>
                {s.shouldContactToday && <span className="pill bg-danger-soft text-danger ring-1 ring-danger/30"><Flame className="h-3 w-3" /> Contact today</span>}
                <span className="hidden lg:inline"><TierBadge tier={p.tier} /></span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
                {p.contactName && <span>{p.contactName}{p.contactTitle ? `, ${p.contactTitle}` : ""}</span>}
                {p.industry && <span>{p.industry}</span>}
                {(p.city || p.region) && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {[p.city, p.region].filter(Boolean).join(", ")}</span>}
                {p.website && <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent"><Globe className="h-3 w-3" /> Website</a>}
                {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {p.email}</span>}
                {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {p.phone}</span>}
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Likelihood" value={`${s.likelihoodToBuy}`} suffix="/100" />
                <Stat label="Opp. waste / yr" value={fmtCents(s.opportunityWasteCents)} tone="text-warn" />
                <Stat label="Package" value={s.recommendedPricingTier} sub={`${fmtCents(s.recommendedMonthlyFeeCents)}/mo`} />
                <Stat label="Est. LTV" value={fmtCents(s.estLtvCents)} tone="text-success" sub={`ROI ~${s.expectedRoiPct}%`} />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <ProspectActions id={p.id} stage={p.stage} />
          </div>
        </PanelBody>
      </Panel>

      {/* 13 questions */}
      <Panel>
        <PanelHeader title="Every question, answered" hint="The decisions this profile is built to make instant" />
        <PanelBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2.5">
            {answers.map((x) => (
              <div key={x.q} className="flex items-baseline justify-between gap-3 border-b border-border-subtle/50 pb-2">
                <span className="text-xs text-fg-subtle">{x.q}</span>
                <span className="text-sm text-fg text-right truncate">{x.a}</span>
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GOII breakdown */}
        <Panel>
          <PanelHeader title="Government Opportunity Intelligence Index™" hint={`${s.score}/100 · ${s.label}`} />
          <PanelBody className="space-y-3">
            {s.components.map((c) => <ComponentBar key={c.key} label={c.label} points={c.points} max={c.max} note={c.note} />)}
          </PanelBody>
        </Panel>

        {/* Opportunity waste */}
        <Panel>
          <PanelHeader title="Opportunity Waste Engine" hint={`Estimated band: ${wasteBand(s.opportunityWasteCents)}`} />
          <PanelBody>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-mono font-semibold text-warn">{fmtCents(s.opportunityWasteCents)}</div>
              <div className="text-xs text-fg-subtle">wasted / yr · recover ~{fmtCents(waste.potentialSavingsCents)}</div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Cost label="Portal triage" v={waste.costLines.reviewCost} />
              <Cost label="Estimator time" v={waste.costLines.estimatorCost} />
              <Cost label="Lost-bid proposals" v={waste.costLines.proposalCost} />
              <Cost label="Weak qualification" v={waste.costLines.qualificationCost} />
              <Cost label="Mgmt overhead" v={waste.costLines.managementCost} />
            </div>
            <div className="mt-3 text-[11px] text-fg-subtle">
              ~{waste.annualOpportunitiesReviewed.toLocaleString()} opportunities reviewed/yr → {waste.annualQualified} qualified → {waste.annualBidsPursued} pursued → {waste.annualBidsLost} lost.
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {waste.topDrivers.map((d) => <span key={d} className="pill bg-warn-soft text-warn ring-1 ring-warn/30">{d}</span>)}
            </div>
          </PanelBody>
        </Panel>

        {/* Platform relevance */}
        <Panel>
          <PanelHeader title="Platform Intelligence" hint="Which portals to monitor" />
          <PanelBody className="space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle mb-1.5">Primary</div>
              <div className="flex flex-wrap gap-1.5">
                {p.primaryPlatforms.map((x) => <Badge key={x} tone="accent">{x}</Badge>)}
                {p.primaryPlatforms.length === 0 && <span className="text-sm text-fg-subtle">—</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle mb-1.5">Secondary</div>
              <div className="flex flex-wrap gap-1.5">
                {p.secondaryPlatforms.map((x) => <Badge key={x} tone="muted">{x}</Badge>)}
                {p.secondaryPlatforms.length === 0 && <span className="text-sm text-fg-subtle">—</span>}
              </div>
            </div>
          </PanelBody>
        </Panel>

        {/* Award profile */}
        <Panel>
          <PanelHeader title="Government Award Profile" hint={p.hasWonGov ? `${p.awardCount} awards · ${fmtDollars(p.totalWonDollars)}` : "No matched awards"} />
          <PanelBody className="p-0">
            <div className="px-5 py-3 grid grid-cols-3 gap-2 text-center border-b border-border-subtle">
              <div><div className="text-[10px] uppercase text-fg-subtle">Total won</div><div className="font-mono text-sm">{fmtDollars(p.totalWonDollars)}</div></div>
              <div><div className="text-[10px] uppercase text-fg-subtle">Largest</div><div className="font-mono text-sm">{fmtDollars(p.largestAwardDollars)}</div></div>
              <div><div className="text-[10px] uppercase text-fg-subtle">Last award</div><div className="font-mono text-sm">{relTime(p.lastAwardAt)}</div></div>
            </div>
            <ul className="divide-y divide-border-subtle max-h-56 overflow-y-auto">
              {p.awards.map((a) => (
                <li key={a.id} className="px-5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-fg truncate">{a.title}</span>
                    {a.valueDollars != null && <span className="font-mono text-xs shrink-0">{fmtDollars(a.valueDollars)}</span>}
                  </div>
                  <div className="text-[11px] text-fg-subtle truncate">{a.agency ?? a.department ?? "—"}{a.category ? ` · ${a.category}` : ""}{a.awardDate ? ` · ${new Date(a.awardDate).toLocaleDateString()}` : ""}</div>
                </li>
              ))}
              {p.awards.length === 0 && <li className="px-5 py-4 text-sm text-fg-subtle">No awards ingested for this supplier yet.</li>}
            </ul>
          </PanelBody>
        </Panel>
      </div>

      {/* Renewals */}
      {p.renewals.length > 0 && (
        <Panel>
          <PanelHeader title="Linked renewals" hint="Where this company is incumbent" />
          <PanelBody className="p-0">
            <ul className="divide-y divide-border-subtle">
              {p.renewals.map((r) => (
                <li key={r.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-fg truncate">{r.title}</div>
                    <div className="text-[11px] text-fg-subtle truncate">{r.buyer?.organization ?? r.agency ?? "—"} · rebid {relTime(r.likelyRebidStart)}</div>
                  </div>
                  {r.expectedValueDollars != null && <span className="font-mono text-sm">{fmtDollars(r.expectedValueDollars)}</span>}
                </li>
              ))}
            </ul>
          </PanelBody>
        </Panel>
      )}

      {/* Research + AI summary + account plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel>
          <PanelHeader title="Research profile" hint={p.researchedAt ? `Researched ${relTime(p.researchedAt)}` : "Not researched yet"} />
          <PanelBody>
            <div className="flex flex-wrap gap-3 text-xs mb-3">
              <KV label="Company size" v={p.companySize} />
              <KV label="Employees" v={p.employeesEstimate?.toString()} />
              <KV label="Revenue" v={p.revenueEstimateDollars ? fmtDollars(p.revenueEstimateDollars) : null} />
              <KV label="Locations" v={p.locationsCount?.toString()} />
              <KV label="Maturity" v={p.procurementMaturity} />
            </div>
            <div className="flex items-center gap-2 mb-2 text-xs">
              {p.govExperience ? <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Government experience</span> : <span className="inline-flex items-center gap-1 text-fg-subtle"><XCircle className="h-3.5 w-3.5" /> No gov footprint confirmed</span>}
              {p.govClientTypes.map((t) => <Badge key={t} tone="success">{t}</Badge>)}
            </div>
            <p className="text-sm text-fg-muted whitespace-pre-wrap">{p.researchNotes ?? "Run Research to build a company intelligence profile."}</p>
            {p.researchSources.length > 0 && <div className="mt-2 text-[11px] text-fg-subtle">Sources: {p.researchSources.join(", ")}</div>}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Prospect summary" hint="AI-generated intelligence brief" />
          <PanelBody>
            <p className="text-sm text-fg-muted whitespace-pre-wrap">{p.aiSummary ?? "Click Summary to generate an intelligence brief for this prospect."}</p>
          </PanelBody>
        </Panel>
      </div>

      {p.aiAccountPlan && (
        <Panel>
          <PanelHeader title="Account plan" />
          <PanelBody><pre className="text-sm text-fg-muted whitespace-pre-wrap font-sans">{p.aiAccountPlan}</pre></PanelBody>
        </Panel>
      )}

      {/* Outreach */}
      <Panel>
        <PanelHeader title="AI Outreach" hint="Research-driven — never generic" />
        <PanelBody className="p-0">
          <div id="outreach" />
          {p.outreach.length === 0 ? (
            <div className="px-5 py-4 text-sm text-fg-subtle">Use “Generate outreach…” above to draft a cold email, LinkedIn message, call script, Loom script, or follow-up sequence.</div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {p.outreach.map((o) => (
                <li key={o.id} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="violet">{OUTREACH_META[o.kind as OutreachKind]?.label ?? o.kind}</Badge>
                    {o.subject && <span className="text-sm text-fg">{o.subject}</span>}
                    <span className="ml-auto text-[11px] text-fg-subtle">{relTime(o.createdAt)}</span>
                  </div>
                  <pre className="text-sm text-fg-muted whitespace-pre-wrap font-sans">{o.body}</pre>
                </li>
              ))}
            </ul>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

function Stat({ label, value, sub, suffix, tone }: { label: string; value: string; sub?: string; suffix?: string; tone?: string }) {
  return (
    <div className="rounded-lg bg-bg-raised/40 ring-1 ring-border p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className={`mt-0.5 font-mono text-sm ${tone ?? "text-fg"}`}>{value}{suffix && <span className="text-fg-subtle text-xs">{suffix}</span>}</div>
      {sub && <div className="text-[10px] text-fg-subtle">{sub}</div>}
    </div>
  );
}

function Cost({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-bg-raised/40 ring-1 ring-border px-2 py-1.5">
      <span className="text-fg-subtle truncate">{label}</span>
      <span className="font-mono text-fg shrink-0">{fmtDollars(v)}</span>
    </div>
  );
}

function KV({ label, v }: { label: string; v?: string | null }) {
  return <span><span className="text-fg-subtle">{label}:</span> <span className="text-fg">{v ?? "—"}</span></span>;
}
