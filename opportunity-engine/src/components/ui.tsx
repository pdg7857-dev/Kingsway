import Link from "next/link";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-fg">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card">
      <div className="text-xs font-semibold uppercase tracking-wide text-subtle">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums text-fg">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

const REC_COLOR: Record<string, string> = {
  strong: "text-good border-good/40 bg-good/10",
  worth_a_look: "text-accent border-accent/40 bg-accent/10",
  weak: "text-warn border-warn/40 bg-warn/10",
  no: "text-subtle border-border bg-panel2",
};

export function RecBadge({ rec, score }: { rec: string; score?: number }) {
  return (
    <span className={`pill ${REC_COLOR[rec] ?? ""}`}>
      {rec.replace(/_/g, " ")}
      {score != null ? ` · ${score}` : ""}
    </span>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card text-sm text-muted">{children}</div>;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-accent hover:underline">
      {children}
    </Link>
  );
}
