"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function recordOutcome(formData: FormData) {
  const opportunityId = String(formData.get("opportunityId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (!opportunityId || !clientId) return;

  const didBid = formData.get("didBid") === "on";
  const didWin = formData.get("didWin") === "on";
  const incumbentDisplaced = formData.get("incumbentDisplaced") === "on";
  const awardValueRaw = String(formData.get("awardValue") ?? "");
  const awardValue = awardValueRaw.trim() === "" ? null : Number(awardValueRaw);

  await prisma.clientOutcome.upsert({
    where: { opportunityId_clientId: { opportunityId, clientId } },
    update: {
      didBid, didWin, incumbentDisplaced,
      awardedSupplier: String(formData.get("awardedSupplier") ?? "").trim() || null,
      awardValue: awardValue != null && !Number.isNaN(awardValue) ? awardValue : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
    create: {
      opportunityId, clientId, surfaced: true, didBid, didWin, incumbentDisplaced,
      awardedSupplier: String(formData.get("awardedSupplier") ?? "").trim() || null,
      awardValue: awardValue != null && !Number.isNaN(awardValue) ? awardValue : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });
  revalidatePath("/performance");
}
