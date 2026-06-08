"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { RelStatus } from "@prisma/client";

function toDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function upsertSupplierRelationship(formData: FormData) {
  const supplierName = String(formData.get("supplierName") ?? "").trim();
  if (!supplierName) return;
  const status = String(formData.get("status") ?? "cold") as RelStatus;
  const lastContact = toDate(String(formData.get("lastContact") ?? ""));
  const notes = String(formData.get("notes") ?? "").trim() || null;
  await prisma.supplierRelationship.upsert({
    where: { supplierName },
    update: { status, lastContact, notes },
    create: { supplierName, status, lastContact, notes },
  });
  revalidatePath("/relationships");
  revalidatePath("/incumbents");
}
