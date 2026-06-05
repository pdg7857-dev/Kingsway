"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { normalizeTerm } from "@/lib/text";
import type { CodeSystem } from "@prisma/client";

function list(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function num(v: FormDataEntryValue | null): number | null {
  const n = Number(v);
  return v === "" || v == null || Number.isNaN(n) ? null : n;
}

export async function createClient(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.client.create({
    data: {
      name,
      contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
      planTier: String(formData.get("planTier") ?? "").trim() || null,
      jurisdictions: list(formData.get("jurisdictions")).map((j) => j.toUpperCase()),
      trades: list(formData.get("trades")),
      clearances: list(formData.get("clearances")),
      valueMin: num(formData.get("valueMin")),
      valueMax: num(formData.get("valueMax")),
      notes: String(formData.get("notes") ?? "").trim() || null,
    },
  });
  revalidatePath("/clients");
}

export async function attachClientCode(formData: FormData) {
  const clientId = String(formData.get("clientId"));
  const system = String(formData.get("system")) as CodeSystem;
  const code = String(formData.get("code") ?? "").trim();
  if (!clientId || !code) return;

  const cc = await prisma.classificationCode.upsert({
    where: { system_code: { system, code } },
    update: {},
    create: { system, code, title: String(formData.get("title") ?? "").trim() || code },
  });
  await prisma.clientCode.upsert({
    where: { clientId_codeId: { clientId, codeId: cc.id } },
    update: {},
    create: { clientId, codeId: cc.id },
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function attachClientKeyword(formData: FormData) {
  const clientId = String(formData.get("clientId"));
  const term = String(formData.get("term") ?? "").trim();
  const exclude = formData.get("exclude") === "on";
  if (!clientId || !term) return;

  const normalized = normalizeTerm(term);
  let kw = await prisma.keyword.findFirst({ where: { normalized } });
  if (!kw) kw = await prisma.keyword.create({ data: { term, normalized } });

  await prisma.clientKeyword.upsert({
    where: { clientId_keywordId: { clientId, keywordId: kw.id } },
    update: { exclude },
    create: { clientId, keywordId: kw.id, exclude },
  });
  revalidatePath(`/clients/${clientId}`);
}
