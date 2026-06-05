import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/ui";
import { normalizeTerm } from "@/lib/text";

export const dynamic = "force-dynamic";

async function addKeyword(formData: FormData) {
  "use server";
  const term = String(formData.get("term") ?? "").trim();
  if (!term) return;
  const weight = Number(formData.get("weight") ?? 1) || 1;
  const synonyms = String(formData.get("synonyms") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const normalized = normalizeTerm(term);
  const existing = await prisma.keyword.findFirst({ where: { normalized } });
  if (existing) {
    await prisma.keyword.update({ where: { id: existing.id }, data: { weight, synonyms } });
  } else {
    await prisma.keyword.create({ data: { term, normalized, weight, synonyms } });
  }
  revalidatePath("/keywords");
}

export default async function KeywordsPage() {
  const keywords = await prisma.keyword.findMany({ orderBy: { term: "asc" }, take: 400 }).catch(() => []);

  return (
    <>
      <PageHeader title="Keyword library" sub="Per-industry and per-service terms used to match solicitation scope to clients." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-0">
          {keywords.length === 0 ? (
            <p className="p-5 text-sm text-muted">No keywords yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2 p-5">
              {keywords.map((k) => (
                <span key={k.id} className="pill">{k.term}{k.weight > 1 ? ` ·${k.weight}` : ""}</span>
              ))}
            </div>
          )}
        </div>
        <form action={addKeyword} className="card space-y-3">
          <h2 className="text-sm font-semibold text-fg">Add keyword</h2>
          <div><label className="label">Term</label><input name="term" className="input" placeholder="custodial services" required /></div>
          <div><label className="label">Synonyms (comma separated)</label><input name="synonyms" className="input" placeholder="janitorial, cleaning" /></div>
          <div><label className="label">Weight (1 broad, 3 primary)</label><input name="weight" type="number" min={1} max={3} defaultValue={1} className="input" /></div>
          <button className="btn-primary w-full">Add</button>
        </form>
      </div>
    </>
  );
}
