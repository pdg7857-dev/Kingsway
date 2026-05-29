"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { INDUSTRIES } from "@/lib/goir/industries";
import { PLATFORMS } from "@/lib/goir/platforms";
import { Loader2, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";

const REGIONS = [
  { group: "Canada", items: [
    ["ON", "Ontario"], ["QC", "Quebec"], ["BC", "British Columbia"], ["AB", "Alberta"],
    ["MB", "Manitoba"], ["SK", "Saskatchewan"], ["NS", "Nova Scotia"], ["NB", "New Brunswick"],
    ["NL", "Newfoundland & Labrador"], ["PE", "Prince Edward Island"], ["NT", "Northwest Territories"],
    ["YT", "Yukon"], ["NU", "Nunavut"],
  ] },
  { group: "United States", items: [
    ["CA", "California"], ["TX", "Texas"], ["NY", "New York"], ["FL", "Florida"], ["IL", "Illinois"],
    ["PA", "Pennsylvania"], ["OH", "Ohio"], ["GA", "Georgia"], ["NC", "North Carolina"], ["MI", "Michigan"],
    ["WA", "Washington"], ["VA", "Virginia"], ["NJ", "New Jersey"], ["MA", "Massachusetts"], ["AZ", "Arizona"],
  ] },
];

export function IntakeForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);

  function togglePlatform(key: string) {
    setPlatforms((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      companyName: String(fd.get("companyName") ?? ""),
      website: String(fd.get("website") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      region: String(fd.get("region") ?? ""),
      email: String(fd.get("email") ?? ""),
      platformsUsed: platforms,
      annualBidVolume: fd.get("annualBidVolume") ? Number(fd.get("annualBidVolume")) : null,
      employees: fd.get("employees") ? Number(fd.get("employees")) : null,
    };
    setPending(true);
    try {
      const res = await fetch("/api/goir", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setPending(false);
        return;
      }
      router.push(`/r/${json.id}`);
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  }

  const labelCls = "block text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle mb-1.5";
  const selectCls =
    "h-9 w-full rounded-lg bg-bg-raised px-3 text-sm text-fg ring-1 ring-border focus:ring-accent focus:outline-none transition-shadow appearance-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="companyName">Company name *</label>
          <Input id="companyName" name="companyName" required placeholder="e.g. Northgate Facility Services" />
        </div>
        <div>
          <label className={labelCls} htmlFor="website">Website</label>
          <Input id="website" name="website" placeholder="company.com" />
        </div>
        <div>
          <label className={labelCls} htmlFor="industry">Industry *</label>
          <div className="relative">
            <select id="industry" name="industry" required defaultValue="" className={selectCls}>
              <option value="" disabled>Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i.key} value={i.key}>{i.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="region">Province / State *</label>
          <div className="relative">
            <select id="region" name="region" required defaultValue="" className={selectCls}>
              <option value="" disabled>Select region…</option>
              {REGIONS.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(([code, name]) => (
                    <option key={g.group + code} value={code}>{name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="email">Work email *</label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
          <p className="mt-1.5 text-[11px] text-fg-subtle">We email your report link here. No spam — your data stays private.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowOptional((s) => !s)}
        className="flex items-center gap-1.5 text-xs text-accent hover:underline"
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showOptional && "rotate-180")} />
        {showOptional ? "Hide" : "Add"} optional details for a sharper report
      </button>

      {showOptional && (
        <div className="space-y-4 rounded-xl border border-border-subtle bg-bg-raised/30 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="annualBidVolume">Opportunities reviewed / year</label>
              <Input id="annualBidVolume" name="annualBidVolume" type="number" min={0} placeholder="e.g. 200" />
            </div>
            <div>
              <label className={labelCls} htmlFor="employees">Number of employees</label>
              <Input id="employees" name="employees" type="number" min={0} placeholder="e.g. 30" />
            </div>
          </div>
          <div>
            <span className={labelCls}>Procurement platforms you use today</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PLATFORMS.map((p) => {
                const on = platforms.includes(p.key);
                return (
                  <button
                    type="button"
                    key={p.key}
                    onClick={() => togglePlatform(p.key)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs text-left ring-1 transition-colors",
                      on ? "bg-accent-soft text-accent ring-accent/40" : "bg-bg-panel/60 text-fg-muted ring-border hover:bg-bg-hover"
                    )}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger ring-1 ring-danger/30">{error}</div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {pending ? "Building your intelligence report…" : "Generate my free report"}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-fg-subtle">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Takes ~15 seconds · No credit card · Instant results
      </p>
    </form>
  );
}
