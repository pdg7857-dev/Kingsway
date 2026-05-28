"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUSINESSES } from "@/lib/constants";
import { cn, fmtCents } from "@/lib/utils";
import { Camera, Check, Loader2, Upload, X } from "lucide-react";

type Extracted = {
  vendor?: string;
  amountCents?: number;
  taxCents?: number | null;
  date?: string | null;
  category?: string | null;
  cardLast4?: string | null;
  paymentMethod?: string | null;
  lineItems?: { name: string; amountCents: number }[] | null;
};

function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const [, mediaType, data] = result.match(/^data:(.+);base64,(.+)$/) ?? [];
      if (!data) return reject(new Error("Could not read image"));
      resolve({ data, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ReceiptScanner() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [payload, setPayload] = useState<{ data: string; mediaType: string } | null>(null);
  const [biz, setBiz] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "scanning" | "review" | "saving" | "done" | "error">("idle");
  const [extracted, setExtracted] = useState<Extracted | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setStatus("scanning");
    setError(null);
    try {
      const b64 = await fileToBase64(file);
      setPayload(b64);
      const mediaType = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(b64.mediaType)
        ? b64.mediaType
        : "image/jpeg";
      const res = await fetch("/api/ai/receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64: b64.data, mediaType, businessSlug: biz || null, create: false }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Scan failed");
        setStatus("error");
        return;
      }
      setExtracted(json.extracted);
      setStatus("review");
    } catch (err: any) {
      setError(err?.message ?? "Scan failed");
      setStatus("error");
    }
  }

  async function save() {
    if (!payload) return;
    setStatus("saving");
    const mediaType = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(payload.mediaType)
      ? payload.mediaType
      : "image/jpeg";
    const res = await fetch("/api/ai/receipt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageBase64: payload.data, mediaType, businessSlug: biz || null, create: true }),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error ?? "Save failed");
      setStatus("error");
      return;
    }
    setStatus("done");
    router.refresh();
    setTimeout(() => reset(), 1500);
  }

  function reset() {
    setPreview(null);
    setPayload(null);
    setExtracted(null);
    setError(null);
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPick}
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-fg-subtle mr-1">Business</span>
        <button
          onClick={() => setBiz("")}
          className={cn("rounded-full px-2 py-0.5 text-[11px] ring-1", biz === "" ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}
        >
          Any
        </button>
        {BUSINESSES.map((b) => (
          <button
            key={b.slug}
            onClick={() => setBiz(b.slug)}
            className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1", biz === b.slug ? "ring-accent/50 text-fg" : "ring-border text-fg-subtle")}
          >
            <span className={cn("dot", b.dot)} />
            {b.short}
          </button>
        ))}
      </div>

      {status === "idle" && (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => { if (fileRef.current) { fileRef.current.setAttribute("capture", "environment"); fileRef.current.click(); } }}>
            <Camera className="h-4 w-4" /> Take photo
          </Button>
          <Button variant="secondary" onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute("capture"); fileRef.current.click(); } }}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      )}

      {preview && (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="receipt" className="max-h-[280px] w-full object-contain bg-bg-raised" />
          {status === "scanning" && (
            <div className="absolute inset-0 grid place-items-center bg-bg/70 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-accent">
                <Loader2 className="h-4 w-4 animate-spin" /> Reading receipt…
              </div>
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-danger/40 bg-danger-soft/30 p-3 text-sm text-danger">
          {error}
          <Button variant="ghost" size="sm" onClick={reset} className="ml-2">Try again</Button>
        </div>
      )}

      {(status === "review" || status === "saving" || status === "done") && extracted && (
        <div className="rounded-xl border border-border bg-bg-raised/40 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Field label="Merchant" value={extracted.vendor ?? "—"} />
            <Field label="Total" value={extracted.amountCents != null ? fmtCents(extracted.amountCents) : "—"} />
            <Field label="Tax" value={extracted.taxCents != null ? fmtCents(extracted.taxCents) : "—"} />
            <Field label="Date" value={extracted.date ? new Date(extracted.date).toLocaleString() : "—"} />
            <Field label="Category" value={extracted.category ?? "—"} />
            <Field label="Card" value={extracted.cardLast4 ? `•••• ${extracted.cardLast4}` : (extracted.paymentMethod ?? "—")} />
          </div>
          {extracted.lineItems?.length ? (
            <div className="pt-1">
              <div className="text-[10px] uppercase tracking-widest text-fg-subtle mb-1">Line items</div>
              <ul className="text-xs text-fg-muted space-y-0.5 max-h-28 overflow-y-auto">
                {extracted.lineItems.map((li, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate">{li.name}</span>
                    <span className="font-mono">{fmtCents(li.amountCents)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-center gap-2 pt-1">
            {status === "done" ? (
              <Badge tone="success" className="gap-1"><Check className="h-3 w-3" /> Saved as expense</Badge>
            ) : (
              <>
                <Button onClick={save} disabled={status === "saving"} className="flex-1">
                  {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {status === "saving" ? "Saving…" : "Save as expense"}
                </Button>
                <Button variant="ghost" size="icon" onClick={reset}><X className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bg-panel/60 ring-1 ring-border p-2">
      <div className="text-[10px] uppercase tracking-widest text-fg-subtle">{label}</div>
      <div className="text-fg truncate">{value}</div>
    </div>
  );
}
