"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { CodeSystem } from "@prisma/client";

const SYSTEMS = ["UNSPSC", "NIGP", "GSIN", "NAICS"];

export async function importCodes(formData: FormData) {
  // CSV lines: system,code,title[,parentCode]
  const raw = String(formData.get("csv") ?? "");
  const rows = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let imported = 0;
  for (const line of rows) {
    const [system, code, ...rest] = line.split(",").map((s) => s.trim());
    if (!SYSTEMS.includes(system) || !code) continue;
    const title = rest[0] || code;
    const parentCode = rest[1] || null;
    await prisma.classificationCode.upsert({
      where: { system_code: { system: system as CodeSystem, code } },
      update: { title, parentCode },
      create: { system: system as CodeSystem, code, title, parentCode },
    });
    imported++;
  }
  revalidatePath("/codes");
}
