"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { Pursuit } from "@prisma/client";
import { analyzePastedText, analyzeUploadedFile } from "@/lib/analyze-run";
import { analysisSchema } from "@/lib/analysis-schema";
import { runMatch } from "@/lib/match-run";

// Re-run client matching across every analyzed opportunity (#bulk). Use after
// importing or editing clients so past tenders match the current roster.
export async function rematchAll() {
  const opps = await prisma.opportunity.findMany({
    where: { analyzedAt: { not: null } },
    select: { id: true, jurisdiction: true, estimatedValue: true, analysis: true },
  });
  for (const o of opps) {
    const parsed = analysisSchema.safeParse(o.analysis);
    if (!parsed.success) continue;
    await runMatch(o.id, parsed.data, {
      jurisdiction: o.jurisdiction,
      estimatedValue: o.estimatedValue ? Number(o.estimatedValue) : null,
    });
  }
  revalidatePath("/documents");
}

export async function updatePursuit(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const pursuit = String(formData.get("pursuit") ?? "");
  if (!id || !pursuit) return;
  await prisma.opportunity.update({
    where: { id },
    data: { pursuit: pursuit as Pursuit, ...(formData.get("clearReview") ? { needsReview: false } : {}) },
  });
  revalidatePath(`/documents/${id}`);
  revalidatePath("/documents");
}

export async function analyzeText(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const title = String(formData.get("title") ?? "").trim() || "Untitled solicitation";
  const source = String(formData.get("source") ?? "").trim() || null;
  const id = await analyzePastedText(text, source, title);
  redirect(`/documents/${id}`);
}

// Kept for non-JS fallback; the dashboard upload now uses the /api/analyze
// route via the client UploadAnalyzer so it can show real upload progress.
export async function analyzeUpload(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  const source = String(formData.get("source") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim() || undefined;
  const id = await analyzeUploadedFile(file, source, title);
  redirect(`/documents/${id}`);
}
