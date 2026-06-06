"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "uploading" | "analyzing" | "error";

export function UploadAnalyzer() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState("");
  const [fileName, setFileName] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setErr("Choose a file first.");
      setPhase("error");
      return;
    }
    setErr("");
    setPct(0);
    setPhase("uploading");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/analyze");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setPct(Math.round((ev.loaded / ev.total) * 100));
    };
    // File fully uploaded; server is now extracting + analyzing.
    xhr.upload.onload = () => {
      setPct(100);
      setPhase("analyzing");
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.id) {
            router.push(`/documents/${data.id}`);
            return;
          }
        } catch {
          /* fall through */
        }
        setErr("Unexpected server response.");
        setPhase("error");
      } else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          const d = JSON.parse(xhr.responseText);
          if (d.error) msg = d.error;
        } catch {
          /* keep default */
        }
        setErr(msg);
        setPhase("error");
      }
    };
    xhr.onerror = () => {
      setErr("Network error during upload.");
      setPhase("error");
    };
    xhr.send(fd);
  }

  const busy = phase === "uploading" || phase === "analyzing";

  return (
    <form onSubmit={onSubmit} className="card mb-6 space-y-3">
      <h2 className="text-sm font-semibold text-fg">Upload a document</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">File (PDF, DOCX, TXT)</label>
          <input
            name="file"
            type="file"
            accept=".pdf,.docx,.txt"
            className="input"
            disabled={busy}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            required
          />
        </div>
        <div>
          <label className="label">Source (platform / URL)</label>
          <input name="source" className="input" placeholder="CanadaBuys" disabled={busy} />
        </div>
      </div>

      <button className="btn-primary" disabled={busy}>
        {phase === "uploading" ? `Uploading ${pct}%` : phase === "analyzing" ? "Analyzing..." : "Upload, extract and analyze"}
      </button>

      {busy && (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-panel2">
            <div
              className={`h-full rounded-full bg-accent transition-all duration-200 ${phase === "analyzing" ? "animate-pulse" : ""}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted">
            {phase === "uploading"
              ? `Uploading ${fileName || "file"}... ${pct}%`
              : "Uploaded. Extracting text and analyzing with AI (this can take 10-30 seconds)..."}
          </p>
        </div>
      )}

      {phase === "error" && <p className="text-sm text-bad">{err}</p>}

      {!busy && (
        <p className="text-xs text-subtle">
          Digital PDFs and DOCX are read with page markers for citations. Scanned PDFs are stored and flagged for OCR.
        </p>
      )}
    </form>
  );
}
