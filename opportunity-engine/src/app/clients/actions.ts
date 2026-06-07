"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { normalizeTerm } from "@/lib/text";
import { parseCsv, headerIndex, pick } from "@/lib/csv";
import type { CodeSystem } from "@prisma/client";

// Split a multi-value CSV cell. Use ; or | inside a cell (commas are the CSV
// delimiter), so "ON;QC" stays one cell.
function multi(v: string): string[] {
  return v.split(/[;|]/).map((s) => s.trim()).filter(Boolean);
}

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

/**
 * Bulk-import clients from CSV. Header row required. Recognized columns:
 *   name, contactEmail, planTier, jurisdictions, trades, clearances,
 *   valueMin, valueMax, codes, keywords, notes
 * Multi-value cells (jurisdictions, trades, clearances, codes, keywords) use
 * ';' to separate. codes use SYSTEM:CODE, e.g. "GSIN:S206;UNSPSC:76111501".
 */
export async function importClients(formData: FormData) {
  const file = formData.get("file");
  let text = "";
  if (file instanceof File && file.size > 0) text = Buffer.from(await file.arrayBuffer()).toString("utf8");
  else text = String(formData.get("csv") ?? "");
  if (!text.trim()) return;

  const rows = parseCsv(text);
  if (rows.length < 2) return;
  const idx = headerIndex(rows[0]);
  const VALID = ["UNSPSC", "NIGP", "GSIN", "NAICS"];

  for (const r of rows.slice(1)) {
    const name = pick(r, idx, ["name", "client", "company"]);
    if (!name) continue;

    const client = await prisma.client.create({
      data: {
        name,
        contactEmail: pick(r, idx, ["contactemail", "email"]) || null,
        planTier: pick(r, idx, ["plantier", "plan", "tier"]) || null,
        jurisdictions: multi(pick(r, idx, ["jurisdictions", "coverage", "provinces", "states"])).map((j) => j.toUpperCase()),
        trades: multi(pick(r, idx, ["trades", "trade"])),
        clearances: multi(pick(r, idx, ["clearances", "licenses", "certifications"])),
        valueMin: num(pick(r, idx, ["valuemin", "minvalue"])),
        valueMax: num(pick(r, idx, ["valuemax", "maxvalue"])),
        notes: pick(r, idx, ["notes"]) || null,
      },
    });

    for (const tok of multi(pick(r, idx, ["codes", "code"]))) {
      const [sysRaw, code] = tok.split(":").map((x) => x.trim());
      const system = (sysRaw || "").toUpperCase();
      if (!code || !VALID.includes(system)) continue;
      const cc = await prisma.classificationCode.upsert({
        where: { system_code: { system: system as CodeSystem, code } },
        update: {},
        create: { system: system as CodeSystem, code, title: code },
      });
      await prisma.clientCode.upsert({
        where: { clientId_codeId: { clientId: client.id, codeId: cc.id } },
        update: {},
        create: { clientId: client.id, codeId: cc.id },
      });
    }

    for (const term of multi(pick(r, idx, ["keywords", "keyword"]))) {
      const normalized = normalizeTerm(term);
      let kw = await prisma.keyword.findFirst({ where: { normalized } });
      if (!kw) kw = await prisma.keyword.create({ data: { term, normalized } });
      await prisma.clientKeyword.upsert({
        where: { clientId_keywordId: { clientId: client.id, keywordId: kw.id } },
        update: {},
        create: { clientId: client.id, keywordId: kw.id },
      });
    }
  }
  revalidatePath("/clients");
}
