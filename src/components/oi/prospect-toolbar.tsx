"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PRIMARY_INDUSTRIES, SECONDARY_INDUSTRIES, GOV_CLIENT_TYPES } from "@/lib/oi/constants";
import { Plus, Upload, Search, Loader2, X } from "lucide-react";

const ALL_IND = [...PRIMARY_INDUSTRIES, ...SECONDARY_INDUSTRIES];

export function ProspectToolbar({
  industries,
  current,
}: {
  industries: string[];
  current: { tier?: string; industry?: string; region?: string; q?: string; gov?: boolean; minScore?: string };
}) {
  const router = useRouter();
  const [q, setQ] = useState(current.q ?? "");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  function setParam(key: string, value: string | null) {
    const sp = new URLSearchParams(window.location.search);
    if (value) sp.set(key, value);
    else sp.delete(key);
    router.push(`/oi/prospects?${sp.toString()}`);
  }

  const indOptions = Array.from(new Set([...industries, ...ALL_IND]));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => { e.preventDefault(); setParam("q", q || null); }}
          className="relative flex-1 min-w-[200px]"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-bg-raised ring-1 ring-border text-sm focus:outline-none focus:ring-accent"
          />
        </form>

        <select value={current.tier ?? ""} onChange={(e) => setParam("tier", e.target.value || null)} className="h-9 rounded-lg bg-bg-raised ring-1 ring-border text-sm px-2">
          <option value="">All tiers</option>
          <option value="A">Tier A</option>
          <option value="B">Tier B</option>
          <option value="C">Tier C</option>
          <option value="D">Tier D</option>
        </select>

        <select value={current.industry ?? ""} onChange={(e) => setParam("industry", e.target.value || null)} className="h-9 rounded-lg bg-bg-raised ring-1 ring-border text-sm px-2 max-w-[180px]">
          <option value="">All industries</option>
          {indOptions.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>

        <button
          onClick={() => setParam("gov", current.gov ? null : "1")}
          className={`h-9 px-3 rounded-lg text-sm ring-1 ${current.gov ? "bg-success-soft text-success ring-success/30" : "bg-bg-raised text-fg-muted ring-border"}`}
        >
          Gov winners
        </button>

        {(current.tier || current.industry || current.region || current.q || current.gov || current.minScore) && (
          <button onClick={() => router.push("/oi/prospects")} className="h-9 px-2 rounded-lg text-sm text-fg-subtle hover:text-fg inline-flex items-center gap-1">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowImport(true)}><Upload className="h-3.5 w-3.5" /> Import</Button>
          <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-3.5 w-3.5" /> Add prospect</Button>
        </div>
      </div>

      {showAdd && <AddProspect onClose={() => setShowAdd(false)} />}
      {showImport && <ImportProspects onClose={() => setShowImport(false)} />}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg panel p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="text-fg-subtle hover:text-fg"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function field(label: string, input: React.ReactNode) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-fg-subtle">{label}</span>
      <div className="mt-1">{input}</div>
    </label>
  );
}

const inputCls = "w-full h-9 px-3 rounded-lg bg-bg-raised ring-1 ring-border text-sm focus:outline-none focus:ring-accent";

function AddProspect({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<any>({ companyName: "", country: "Canada", govClientTypes: [] as string[] });

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.companyName) return;
    setBusy(true);
    const res = await fetch("/api/oi/prospects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) { onClose(); router.refresh(); }
  }

  return (
    <Modal title="Add prospect" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">{field("Company name *", <input className={inputCls} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />)}</div>
        {field("Contact name", <input className={inputCls} onChange={(e) => set("contactName", e.target.value)} />)}
        {field("Contact title", <input className={inputCls} onChange={(e) => set("contactTitle", e.target.value)} />)}
        {field("Email", <input className={inputCls} onChange={(e) => set("email", e.target.value)} />)}
        {field("Phone", <input className={inputCls} onChange={(e) => set("phone", e.target.value)} />)}
        {field("Website", <input className={inputCls} onChange={(e) => set("website", e.target.value)} />)}
        {field("LinkedIn URL", <input className={inputCls} onChange={(e) => set("linkedinUrl", e.target.value)} />)}
        {field("Industry", (
          <select className={inputCls} onChange={(e) => set("industry", e.target.value)}>
            <option value="">—</option>
            {ALL_IND.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        ))}
        {field("Province / State", <input className={inputCls} onChange={(e) => set("region", e.target.value)} />)}
        {field("City", <input className={inputCls} onChange={(e) => set("city", e.target.value)} />)}
        {field("Procurement maturity", (
          <select className={inputCls} onChange={(e) => set("procurementMaturity", e.target.value)}>
            {["UNKNOWN", "LOW", "MEDIUM", "HIGH"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        ))}
        <div className="col-span-2">
          <span className="text-[11px] uppercase tracking-wider text-fg-subtle">Government client types</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {GOV_CLIENT_TYPES.map((t) => {
              const on = form.govClientTypes.includes(t);
              return (
                <button key={t} type="button"
                  onClick={() => set("govClientTypes", on ? form.govClientTypes.filter((x: string) => x !== t) : [...form.govClientTypes, t])}
                  className={`pill ${on ? "bg-success-soft text-success ring-1 ring-success/30" : "bg-bg-raised text-fg-muted ring-1 ring-border"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" disabled={busy || !form.companyName} onClick={submit}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add & score"}</Button>
      </div>
    </Modal>
  );
}

function ImportProspects({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setResult(null);
    // CSV: companyName,contactName,email,phone,industry,region[,website]
    const rows = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [companyName, contactName, email, phone, industry, region, website] = line.split(",").map((s) => s?.trim());
        return { companyName, contactName, email, phone, industry, region, website };
      })
      .filter((r) => r.companyName && r.companyName.toLowerCase() !== "companyname");
    const res = await fetch("/api/oi/prospects/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const json = await res.json();
    setBusy(false);
    if (res.ok) { setResult(`Imported & scored ${json.imported} prospects.`); router.refresh(); }
    else setResult(json.error ?? "Import failed.");
  }

  return (
    <Modal title="Import prospects (CSV)" onClose={onClose}>
      <p className="text-xs text-fg-subtle mb-2">One company per line: <code className="text-accent">companyName, contactName, email, phone, industry, province, website</code>. Each row is auto-scored on the GOII Index™.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"ABC Construction, Jane Doe, jane@abc.ca, 416-555-1212, Construction, Ontario, abc.ca\nClean Co, , info@cleanco.ca, , Janitorial, BC,"}
        className="w-full rounded-lg bg-bg-raised ring-1 ring-border text-sm p-3 font-mono focus:outline-none focus:ring-accent"
      />
      {result && <div className="mt-2 text-xs text-accent">{result}</div>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        <Button size="sm" disabled={busy || !text.trim()} onClick={submit}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}</Button>
      </div>
    </Modal>
  );
}
