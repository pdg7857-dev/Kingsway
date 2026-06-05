"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { forecastRenewal } from "@/lib/renewals";

function d(v: string | undefined | null): Date | null {
  if (!v) return null;
  const date = new Date(v.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}
function n(v: string | undefined | null): number | null {
  if (v == null || v.trim() === "") return null;
  const x = Number(v);
  return Number.isNaN(x) ? null : x;
}

async function saveAward(input: {
  buyer: string; supplier?: string | null; title: string; jurisdiction?: string | null;
  value?: number | null; awardDate?: Date | null; startDate?: Date | null;
  endDate?: Date | null; initialTermMonths?: number | null; optionYears?: number | null;
  codes?: string[];
}) {
  const f = forecastRenewal({
    awardDate: input.awardDate, startDate: input.startDate, endDate: input.endDate,
    initialTermMonths: input.initialTermMonths, optionYears: input.optionYears,
  });
  await prisma.awardedContract.create({
    data: {
      buyer: input.buyer, supplier: input.supplier ?? null, title: input.title,
      jurisdiction: input.jurisdiction ?? null, value: input.value ?? null,
      awardDate: input.awardDate ?? null, startDate: input.startDate ?? null,
      endDate: f.endDate, endEstimated: f.endEstimated, rebidWindow: f.rebidWindow,
      status: f.status, initialTermMonths: input.initialTermMonths ?? null,
      optionYears: input.optionYears ?? null, codes: input.codes ?? [],
    },
  });
}

export async function addAward(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const buyer = String(formData.get("buyer") ?? "").trim();
  if (!title || !buyer) return;
  await saveAward({
    buyer, title,
    supplier: String(formData.get("supplier") ?? "").trim() || null,
    jurisdiction: String(formData.get("jurisdiction") ?? "").trim().toUpperCase() || null,
    value: n(String(formData.get("value"))),
    awardDate: d(String(formData.get("awardDate"))),
    startDate: d(String(formData.get("startDate"))),
    endDate: d(String(formData.get("endDate"))),
    initialTermMonths: n(String(formData.get("initialTermMonths"))),
    optionYears: n(String(formData.get("optionYears"))),
  });
  revalidatePath("/awards");
}

export async function importAwards(formData: FormData) {
  // CSV: buyer,supplier,title,jurisdiction,value,awardDate,startDate,endDate,initialTermMonths,optionYears
  const raw = String(formData.get("csv") ?? "");
  const rows = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of rows) {
    const p = line.split(",").map((s) => s.trim());
    if (p.length < 3 || !p[0] || !p[2]) continue;
    await saveAward({
      buyer: p[0], supplier: p[1] || null, title: p[2], jurisdiction: (p[3] || "").toUpperCase() || null,
      value: n(p[4]), awardDate: d(p[5]), startDate: d(p[6]), endDate: d(p[7]),
      initialTermMonths: n(p[8]), optionYears: n(p[9]),
    });
  }
  revalidatePath("/awards");
}
