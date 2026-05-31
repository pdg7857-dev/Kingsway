import type { Block, Section } from "@/lib/site/content/types";
import { StatCallout } from "@/components/site/cite";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand-600">
          {block.items.map((it, i) => (
            <li key={i} className="pl-1">{it}</li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="my-7 rounded-2xl border-l-4 border-brand-500 bg-brand-50/60 p-5 text-[1.0625rem] leading-7 text-ink-700">
          {block.text}
        </div>
      );
    case "stat":
      return <StatCallout id={block.id} />;
  }
}

export function LongFormBody({ sections }: { sections: Section[] }) {
  return (
    <div className="prose-site">
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-24">
          <h2>{s.heading}</h2>
          {s.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </section>
      ))}
    </div>
  );
}

export function TableOfContents({ sections }: { sections: Section[] }) {
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        On this page
      </p>
      <ul className="space-y-2 border-l border-line">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="-ml-px block border-l-2 border-transparent pl-4 text-slate-600 transition hover:border-brand-500 hover:text-brand-700"
            >
              {s.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
