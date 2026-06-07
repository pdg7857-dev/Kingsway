import Link from "next/link";
import { Prisma, AwardStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PageHeader, BackLink } from "@/components/ui";
import { money, fmtDate } from "@/lib/text";
import { INDUSTRY_FILTERS, getIndustryFilter } from "@/lib/industry-filter";

export const dynamic = "force-dynamic";

const PER_PAGE = 50;

type SP = {
  q?: string; ind?: string; code?: string; jur?: string; min?: string; max?: string;
  status?: string; sort?: string; page?: string;
};

const SORTS: Record<string, Prisma.AwardedContractOrderByWithRelationInput> = {
  value_desc: { value: "desc" },
  value_asc: { value: "asc" },
  award_desc: { awardDate: "desc" },
  end_asc: { endDate: "asc" },
};

const STATUS_COLOR: Record<string, string> = {
  rebid_open: "border-good/40 text-good",
  expiring: "border-warn/40 text-warn",
  active: "border-border text-muted",
  closed: "border-border text-subtle",
};

export default async function BrowseAwards({ searchParams }: { searchParams: SP }) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const sortKey = searchParams.sort && SORTS[searchParams.sort] ? searchParams.sort : "value_desc";

  // Each condition is its own group; ANDed together so search + industry +
  // filters all apply at once.
  const and: Prisma.AwardedContractWhereInput[] = [];
  const q = searchParams.q?.trim();
  if (q) {
    and.push({ OR: [
      { title: { contains: q, mode: "insensitive" } },
      { buyer: { contains: q, mode: "insensitive" } },
      { supplier: { contains: q, mode: "insensitive" } },
    ] });
  }
  const industry = getIndustryFilter(searchParams.ind);
  if (industry) {
    and.push({ OR: industry.keywords.map((k) => ({ title: { contains: k, mode: "insensitive" as const } })) });
  }
  if (searchParams.code?.trim()) and.push({ codes: { has: searchParams.code.trim() } });
  if (searchParams.jur?.trim()) and.push({ jurisdiction: { contains: searchParams.jur.trim(), mode: "insensitive" } });
  const min = Number(searchParams.min);
  const max = Number(searchParams.max);
  const hasMin = !!searchParams.min && !Number.isNaN(min);
  const hasMax = !!searchParams.max && !Number.isNaN(max);
  if (hasMin || hasMax) and.push({ value: { ...(hasMin ? { gte: min } : {}), ...(hasMax ? { lte: max } : {}) } });
  if (searchParams.status) and.push({ status: searchParams.status as AwardStatus });
  const where: Prisma.AwardedContractWhereInput = and.length ? { AND: and } : {};

  const [total, rows] = await Promise.all([
    prisma.awardedContract.count({ where }).catch(() => 0),
    prisma.awardedContract.findMany({ where, orderBy: SORTS[sortKey], skip: (page - 1) * PER_PAGE, take: PER_PAGE }).catch(() => []),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const qs = (overrides: Partial<SP>) => {
    const p = new URLSearchParams();
    const merged: Record<string, string | undefined> = { ...searchParams, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    return `?${p.toString()}`;
  };

  return (
    <>
      <div className="mb-2"><BackLink href="/awards">← Awards & renewals</BackLink></div>
      <PageHeader title="Browse awards" sub={`${total.toLocaleString()} contracts match`} />

      <form className="card mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="label">Search (title, buyer, supplier)</label>
          <input name="q" defaultValue={searchParams.q} className="input" placeholder="e.g. janitorial, City of Toronto, Acme" />
        </div>
        <div>
          <label className="label">Industry</label>
          <select name="ind" defaultValue={searchParams.ind} className="input">
            <option value="">Any</option>
            {INDUSTRY_FILTERS.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
          </select>
        </div>
        <div><label className="label">Region contains</label><input name="jur" defaultValue={searchParams.jur} className="input" placeholder="Ontario" /></div>
        <div><label className="label">GSIN / UNSPSC (exact)</label><input name="code" defaultValue={searchParams.code} className="input" placeholder="N7030" /></div>
        <div><label className="label">Min value</label><input name="min" type="number" defaultValue={searchParams.min} className="input" placeholder="25000" /></div>
        <div><label className="label">Max value</label><input name="max" type="number" defaultValue={searchParams.max} className="input" /></div>
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={searchParams.status} className="input">
            <option value="">Any</option>
            <option value="rebid_open">Re-bid open</option>
            <option value="expiring">Expiring</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="label">Sort by</label>
          <select name="sort" defaultValue={sortKey} className="input">
            <option value="value_desc">Value (high to low)</option>
            <option value="value_asc">Value (low to high)</option>
            <option value="award_desc">Award date (newest)</option>
            <option value="end_asc">End date (soonest)</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button className="btn-primary">Apply</button>
          <Link href="/awards/browse" className="btn-ghost">Clear</Link>
        </div>
      </form>

      <div className="card overflow-x-auto p-0">
        {rows.length === 0 ? (
          <p className="p-5 text-sm text-muted">No contracts match these filters.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Contract</th>
                <th className="th">Supplier</th>
                <th className="th">Value</th>
                <th className="th">Region</th>
                <th className="th">Ends</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="td">
                    <Link href={`/awards/${a.id}`} className="text-accent hover:underline">{a.title}</Link>
                    <div className="text-xs text-subtle">{a.buyer}</div>
                  </td>
                  <td className="td">{a.supplier ?? "n/a"}</td>
                  <td className="td tabular-nums">{money(a.value ? Number(a.value) : null, a.currency)}</td>
                  <td className="td">{a.jurisdiction ?? "n/a"}</td>
                  <td className="td">{fmtDate(a.endDate)}{a.endEstimated && <span className="text-subtle"> (est)</span>}</td>
                  <td className="td"><span className={`pill ${STATUS_COLOR[a.status]}`}>{a.status.replace(/_/g, " ")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>Page {page} of {pages.toLocaleString()}</span>
        <div className="flex gap-2">
          {page > 1 && <Link href={qs({ page: String(page - 1) })} className="btn-ghost">← Prev</Link>}
          {page < pages && <Link href={qs({ page: String(page + 1) })} className="btn-ghost">Next →</Link>}
        </div>
      </div>
    </>
  );
}
