import { CITATIONS, getCitation, citationUrl, type Citation } from "@/lib/site/citations";

/**
 * Inline statistic. Renders the figure in emphasis with a small reference
 * marker that links to the source when a link is available, or shows a
 * "source pending" marker when the claim is not yet attributed.
 */
export function Stat({ id, plain = false }: { id: string; plain?: boolean }) {
  const c = getCitation(id);
  if (!c) return null;
  if (plain) return <span className="font-semibold text-ink">{c.value}</span>;
  return (
    <span className="font-semibold text-ink">
      {c.value}
      <CiteMark c={c} />
    </span>
  );
}

/** Small superscript reference marker after a claim. */
export function Cite({ id }: { id: string }) {
  const c = getCitation(id);
  if (!c) return null;
  return <CiteMark c={c} />;
}

function CiteMark({ c }: { c: Citation }) {
  const url = citationUrl(c);
  if (c.verified && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title={`${c.source}${c.year ? `, ${c.year}` : ""}`}
        className="ml-0.5 align-super text-[0.6em] font-semibold text-brand-600 no-underline hover:underline"
      >
        [src]
      </a>
    );
  }
  if (c.verified) {
    return (
      <sup title={`${c.source}${c.year ? `, ${c.year}` : ""}`} className="ml-0.5 align-super text-[0.6em] font-semibold text-slate-400">
        [src]
      </sup>
    );
  }
  return (
    <sup title="Source pending verification" className="ml-0.5 align-super text-[0.6em] font-semibold text-gold-600">
      [source pending]
    </sup>
  );
}

/** Renders the source line for a citation: name, year, and a link when known. */
function SourceLine({ c }: { c: Citation }) {
  if (!c.verified) {
    return <span className="text-gold-600">Source pending verification against the research report.</span>;
  }
  const url = citationUrl(c);
  return (
    <span className="text-slate-500">
      Source: {c.source}
      {c.year ? `, ${c.year}` : ""}
      {c.geo ? ` (${c.geo})` : ""}.
      {url ? (
        <>
          {" "}
          <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="text-brand-700 underline">
            Reference
          </a>
        </>
      ) : null}
    </span>
  );
}

/** A boxed statistic for use inside long-form bodies. */
export function StatCallout({ id }: { id: string }) {
  const c = getCitation(id);
  if (!c) return null;
  return (
    <div className="my-7 flex gap-4 rounded-xl border border-line bg-paper-soft p-5">
      <div className="text-3xl font-bold leading-none text-brand-700">{c.value}</div>
      <div className="min-w-0">
        <p className="text-ink-700">{c.claim}</p>
        <p className="mt-1 text-xs">
          <SourceLine c={c} />
        </p>
      </div>
    </div>
  );
}

/** A full references section listing every citation used on a page. */
export function References({ ids }: { ids?: string[] }) {
  const list = (ids ?? Object.keys(CITATIONS))
    .map((id) => getCitation(id))
    .filter(Boolean) as Citation[];
  if (list.length === 0) return null;
  return (
    <div className="mt-12 rounded-xl border border-line bg-paper-soft p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sources & citations</h3>
      <ol className="mt-4 space-y-3 text-sm">
        {list.map((c) => (
          <li key={c.id} className="text-ink-700">
            <span className="font-medium">{c.claim}</span>{" "}
            <SourceLine c={c} />
          </li>
        ))}
      </ol>
    </div>
  );
}
