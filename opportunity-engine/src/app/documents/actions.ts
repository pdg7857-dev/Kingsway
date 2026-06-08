"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { Pursuit } from "@prisma/client";
import { analyzePastedText, analyzeUploadedFile } from "@/lib/analyze-run";

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
