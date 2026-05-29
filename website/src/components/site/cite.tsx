import { CITATIONS, getCitation, type Citation } from "@/lib/site/citations";

/**
 * Inline statistic. Renders the figure in emphasis with a small reference
 * marker. When the citation is not yet verified, it carries a clear
 * "source pending" affordance so an unverified number never reads as a hard,
 * attributed fact.
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
  if (c.verified && c.url) {
    return (
      <a
        href={c.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title={`${c.source}${c.year ? `, ${c.year}` : ""}`}
        className="ml-0.5 align-super text-[0.6em] font-semibold text-brand-600 no-underline hover:underline"
      >
        [src]
      </a>
    );
  }
  return (
    <sup
      title="Source pending verification"
      className="ml-0.5 align-super text-[0.6em] font-semibold text-gold-600"
    >
      [source pending]
    </sup>
  );
}

/** A boxed statistic for use inside long-form bodies. */
export function StatCallout({ id }: { id: string }) {
  const c = getCitation(id);
  if (!c) return null;
  return (
    <div className="my-7 flex gap-4 rounded-2xl border border-line bg-paper-soft p-5">
      <div className="text-3xl font-bold leading-none text-brand-700">{c.value}</div>
      <div className="min-w-0">
        <p className="text-ink-700">{c.claim}</p>
        <p className="mt-1 text-xs text-slate-500">
          {c.verified ? (
            <>
              Source: {c.source}
              {c.year ? `, ${c.year}` : ""}
              {c.url ? (
                <>
                  {" "}
                  <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="text-brand-700 underline">
                    reference
                  </a>
                </>
              ) : null}
            </>
          ) : (
            <span className="text-gold-600">Source pending verification against the research report.</span>
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * A full references section listing every citation used on a page. Pass the
 * ids referenced on that page; defaults to all.
 */
export function References({ ids }: { ids?: string[] }) {
  const list = (ids ?? Object.keys(CITATIONS))
    .map((id) => getCitation(id))
    .filter(Boolean) as Citation[];
  if (list.length === 0) return null;
  return (
    <div className="mt-12 rounded-2xl border border-line bg-paper-soft p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sources & citations</h3>
      <ol className="mt-4 space-y-3 text-sm">
        {list.map((c) => (
          <li key={c.id} className="text-ink-700">
            <span className="font-medium">{c.claim}</span>{" "}
            {c.verified ? (
              <span className="text-slate-500">
                {c.source}
                {c.year ? `, ${c.year}` : ""}.
                {c.url ? (
                  <>
                    {" "}
                    <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="text-brand-700 underline">
                      Link
                    </a>
                  </>
                ) : null}
              </span>
            ) : (
              <span className="text-gold-600">Source pending verification.</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
