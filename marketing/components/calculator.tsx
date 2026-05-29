"use client";
import { useState } from "react";
import { ScoreRing } from "@/components/score-ring";
import { PRIMARY_INDUSTRIES, SECONDARY_INDUSTRIES } from "@/lib/oi/constants";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const ALL_IND = [...PRIMARY_INDUSTRIES, ...SECONDARY_INDUSTRIES];
const input = "w-full h-11 px-3.5 rounded-xl bg-bg-raised ring-1 ring-border text-sm focus:outline-none focus:ring-2 focus:ring-accent";
const fc = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

type Result = {
  waste: any;
  index: number;
  label: string;
  recommendedPricingTier: string;
  recommendedMonthlyFeeCents: number;
  primaryPlatforms: string[];
};

export function Calculator() {
  const [form, setForm] = useState<any>({
    industry: "Construction", region: "Ontario", country: "Canada",
    employeesEstimate: 50, revenueEstimateDollars: 8_000_000, locationsCount: 2,
    govExperience: true, procurementMaturity: "MEDIUM",
  });
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const [lead, setLead] = useState({ companyName: "", contactName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  async function calculate() {
    setBusy(true);
    setSaved(false);
    setLeadError(null);
    const r = await fetch("/api/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setRes(await r.json());
    setBusy(false);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.companyName || !lead.email) return;
    setSaving(true);
    setLeadError(null);
    const r = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, ...lead }),
    });
    setSaving(false);
    if (r.ok) setSaved(true);
    else setLeadError("We couldn't submit right now — please try again shortly.");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="panel p-5">
        <div className="text-sm font-semibold mb-3">Tell us about the company</div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Industry</span>
            <select className={input + " mt-1"} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
              {ALL_IND.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Province / State</span>
              <input className={input + " mt-1"} value={form.region} onChange={(e) => set("region", e.target.value)} />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Locations</span>
              <input type="number" className={input + " mt-1"} value={form.locationsCount} onChange={(e) => set("locationsCount", Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Employees</span>
              <input type="number" className={input + " mt-1"} value={form.employeesEstimate} onChange={(e) => set("employeesEstimate", Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Annual revenue ($)</span>
              <input type="number" className={input + " mt-1"} value={form.revenueEstimateDollars} onChange={(e) => set("revenueEstimateDollars", Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Procurement maturity</span>
              <select className={input + " mt-1"} value={form.procurementMaturity} onChange={(e) => set("procurementMaturity", e.target.value)}>
                {["LOW", "MEDIUM", "HIGH"].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={form.govExperience} onChange={(e) => set("govExperience", e.target.checked)} className="h-4 w-4 accent-[hsl(186_100%_55%)]" />
              <span className="text-sm text-fg">Bids on government work</span>
            </label>
          </div>
          <button onClick={calculate} disabled={busy}
            className="w-full h-11 rounded-xl bg-accent text-bg font-medium inline-flex items-center justify-center gap-2 hover:bg-accent-glow disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Calculate my Opportunity Waste <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>

      <div className="panel p-5">
        {!res ? (
          <div className="h-full grid place-items-center text-center text-fg-subtle text-sm py-10">
            Your Government Opportunity Intelligence Index™ and estimated annual opportunity waste will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ScoreRing score={res.index} size={96} />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Estimated annual opportunity waste</div>
                <div className="text-4xl font-mono font-semibold text-warn leading-tight">{fc(res.waste.annualWasteCents)}</div>
                <div className="text-xs text-fg-subtle">Recoverable ~{fc(res.waste.potentialSavingsCents)} · {res.label}</div>
              </div>
            </div>

            <p className="text-sm text-fg-muted rounded-xl bg-bg-raised/50 ring-1 ring-border p-3">
              Based on this profile, your team may be spending <span className="text-warn font-medium">{fc(res.waste.annualWasteCents)}</span> a
              year reviewing opportunities across <span className="text-fg">{res.primaryPlatforms.join(", ") || "multiple portals"}</span> that
              never become bids. The biggest driver is <span className="text-fg">{res.waste.topDrivers[0]}</span>.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <Mini label="Reviewed / yr" value={res.waste.annualOpportunitiesReviewed.toLocaleString()} />
              <Mini label="Become bids" value={res.waste.annualBidsPursued.toLocaleString()} />
              <Mini label="Recommended" value={res.recommendedPricingTier} />
            </div>

            {saved ? (
              <div className="rounded-xl bg-success-soft ring-1 ring-success/30 text-success p-3 text-sm inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Thanks — your full report is on its way.
              </div>
            ) : (
              <form onSubmit={submitLead} className="space-y-2 pt-1">
                <div className="text-sm font-medium">Get your full Government Opportunity Report</div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input required placeholder="Company" className={input} value={lead.companyName} onChange={(e) => setLead({ ...lead, companyName: e.target.value })} />
                  <input placeholder="Your name" className={input} value={lead.contactName} onChange={(e) => setLead({ ...lead, contactName: e.target.value })} />
                  <input required type="email" placeholder="Work email" className={input} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                </div>
                <button type="submit" disabled={saving}
                  className="w-full h-11 rounded-xl bg-bg-raised ring-1 ring-border text-fg font-medium inline-flex items-center justify-center gap-2 hover:bg-bg-hover disabled:opacity-50">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send me the report"}
                </button>
                {leadError && <p className="text-[11px] text-danger">{leadError}</p>}
                <p className="text-[11px] text-fg-subtle">No spam. We'll send a one-page opportunity brief for your firm.</p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-raised/50 ring-1 ring-border p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5 font-mono text-sm text-fg">{value}</div>
    </div>
  );
}
