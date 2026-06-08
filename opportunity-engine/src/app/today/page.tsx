import Link from "next/link";
import { prisma } from "@/lib/db";
import { Pursuit } from "@prisma/client";
import { PageHeader } from "@/components/ui";
import { fmtDate, money } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const now = new Date();
  const in14 = new Date(Date.now() + 14 * 86_400_000);

  const [closing, rebids, review] = await Promise.all([
    prisma.opportunity.findMany({
      where: { closingDate: { gte: now, lte: in14 }, pursuit: { notIn: [Pursuit.won, Pursuit.lost] } },
      orderBy: { closingDate: "asc" }, take: 25,
    }).catch(() => []),
    prisma.awardedContract.findMany({
      where: { status: { in: ["rebid_open", "expiring"] } },
      orderBy: { rebidWindow: "asc" }, take: 20,
    }).catch(() => []),
    prisma.opportunity.findMany({ where: { needsReview: true }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
  ]);

  return (
    <>
      <PageHeader title="Today" sub="What needs attention: deadlines, renewals opening, and analyses to verify." />

      <Block title={`Closing within 14 days (${closing.length})`} empty="Nothing closing soon.">
        {closing.map((o) => (
          <Row key={o.id} href={`/documents/${o.id}`} main={o.title} sub={[o.buyer, o.jurisdiction].filter(Boolean).join(" · ")} right={fmtDate(o.closingDate)} />
        ))}
      </Block>

      <Block title={`Renewals in window (${rebids.length})`} empty="No contracts entering their re-bid window." href="/awards">
        {rebids.map((a) => (
          <Row key={a.id} href={`/awards/${a.id}`} main={a.title} sub={`${a.buyer}${a.supplier ? ` · incumbent ${a.supplier}` : ""}`} right={`re-bid ${fmtDate(a.rebidWindow)}${a.endEstimated ? " (est)" : ""}`} />
        ))}
      </Block>

      <Block title={`Needs review (${review.length})`} empty="Nothing flagged for review." href="/documents?review=1">
        {review.map((o) => (
          <Row key={o.id} href={`/documents/${o.id}`} main={o.title} sub={[o.buyer, o.jurisdiction].filter(Boolean).join(" · ")} right={money(o.estimatedValue ? Number(o.estimatedValue) : null, o.currency)} />
        ))}
      </Block>
    </>
  );
}

function Block({ title, empty, href, children }: { title: string; empty: string; href?: string; children: React.ReactNode[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">{title}</h2>
        {href && <Link href={href} className="text-xs text-accent hover:underline">See all</Link>}
      </div>
      {children.length === 0 ? <div className="card text-sm text-muted">{empty}</div> : <div className="card divide-y divide-border p-0">{children}</div>}
    </section>
  );
}

function Row({ href, main, sub, right }: { href: string; main: string; sub?: string; right?: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-panel">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-fg">{main}</div>
        {sub && <div className="truncate text-xs text-subtle">{sub}</div>}
      </div>
      {right && <div className="shrink-0 text-xs text-muted">{right}</div>}
    </Link>
  );
}
