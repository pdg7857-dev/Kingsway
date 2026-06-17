"use client";
import { useState } from "react";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/oi/ui";
import { PRIMARY_INDUSTRIES, SECONDARY_INDUSTRIES, fmtDollars } from "@/lib/oi/constants";
import { Loader2 } from "lucide-react";

const ALL_IND = [...PRIMARY_INDUSTRIES, ...SECONDARY_INDUSTRIES];
const inputCls = "w-full h-9 px-3 rounded-lg bg-bg-raised ring-1 ring-border text-sm focus:outline-none focus:ring-accent";
const fc = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

export function WasteCalculator() {
  const [form, setForm] = useState<any>({ industry: "Construction", region: "Ontario", country: "Canada", employeesEstimate: 50, revenueEstimateDollars: 8000000, locationsCount: 2, govExperience: true, procurementMaturity: "MEDIUM" });
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<any>(null);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function calc() {
    setBusy(true);
    const r = await fetch("/api/oi/waste", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    setRes(await r.json());
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel>
        <PanelHeader title="Inputs" hint="Adjust to model any company" />
        <PanelBody className="space-y-3">
          <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Industry</span>
            <select className={inputCls + " mt-1"} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
              {ALL_IND.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Province / State</span>
              <input className={inputCls + " mt-1"} value={form.region} onChange={(e) => set("region", e.target.value)} />
            </label>
            <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Locations</span>
              <input type="number" className={inputCls + " mt-1"} value={form.locationsCount} onChange={(e) => set("locationsCount", Number(e.target.value))} />
            </label>
            <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Employees</span>
              <input type="number" className={inputCls + " mt-1"} value={form.employeesEstimate} onChange={(e) => set("employeesEstimate", Number(e.target.value))} />
            </label>
            <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Est. revenue ($)</span>
              <input type="number" className={inputCls + " mt-1"} value={form.revenueEstimateDollars} onChange={(e) => set("revenueEstimateDollars", Number(e.target.value))} />
            </label>
            <label className="block"><span className="text-[11px] uppercase tracking-wider text-fg-subtle">Procurement maturity</span>
              <select className={inputCls + " mt-1"} value={form.procurementMaturity} onChange={(e) => set("procurementMaturity", e.target.value)}>
                {["LOW", "MEDIUM", "HIGH"].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={form.govExperience} onChange={(e) => set("govExperience", e.target.checked)} />
              <span className="text-sm text-fg">Government experience</span>
            </label>
          </div>
          <Button disabled={busy} onClick={calc} className="w-full">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate opportunity waste"}</Button>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Estimated annual opportunity waste" hint={res ? `GOII Index™ ${res.index}/100` : "Run the calculator"} />
        <PanelBody>
          {!res ? (
            <div className="text-sm text-fg-subtle">Fill in the inputs and calculate to see the waste estimate, drivers, and recommended package.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <ScoreRing score={res.index} size={88} label="GOII™" />
                <div>
                  <div className="text-3xl font-mono font-semibold text-warn">{fc(res.waste.annualWasteCents)}</div>
                  <div className="text-xs text-fg-subtle">wasted / yr · recover ~{fc(res.waste.potentialSavingsCents)}</div>
                  <div className="mt-1"><Badge tone="accent">{res.recommendedPricingTier} · {fc(res.recommendedMonthlyFeeCents)}/mo</Badge></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Cost label="Portal triage" v={res.waste.costLines.reviewCost} />
                <Cost label="Estimator time" v={res.waste.costLines.estimatorCost} />
                <Cost label="Lost-bid proposals" v={res.waste.costLines.proposalCost} />
                <Cost label="Weak qualification" v={res.waste.costLines.qualificationCost} />
                <Cost label="Mgmt overhead" v={res.waste.costLines.managementCost} />
                <Cost label="Expected ROI" v={null} text={`${res.waste.expectedRoiPct}%`} />
              </div>
              <div className="text-[11px] text-fg-subtle">
                ~{res.waste.annualOpportunitiesReviewed.toLocaleString()} reviewed → {res.waste.annualQualified} qualified → {res.waste.annualBidsPursued} pursued → {res.waste.annualBidsLost} lost.
              </div>
              <div className="flex flex-wrap gap-1.5">{res.waste.topDrivers.map((d: string) => <span key={d} className="pill bg-warn-soft text-warn ring-1 ring-warn/30">{d}</span>)}</div>
              <div className="rounded-md bg-bg-raised/40 ring-1 ring-border p-2.5 text-xs text-fg-muted">
                “Based on our analysis, your team may be spending <span className="text-warn font-medium">{fc(res.waste.annualWasteCents)}</span> annually reviewing opportunities across {res.primaryPlatforms.join(", ") || "multiple portals"} that never become bids.”
              </div>
            </div>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

function Cost({ label, v, text }: { label: string; v: number | null; text?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-bg-raised/40 ring-1 ring-border px-2 py-1.5">
      <span className="text-fg-subtle truncate">{label}</span>
      <span className="font-mono text-fg shrink-0">{text ?? fmtDollars(v ?? 0)}</span>
    </div>
  );
}
