import { PrismaClient } from "@prisma/client";
import { normalizeTerm } from "../src/lib/text";

const prisma = new PrismaClient();

async function main() {
  // A few classification codes.
  const codes = [
    { system: "UNSPSC" as const, code: "72101500", title: "Building maintenance and repair services" },
    { system: "UNSPSC" as const, code: "76111501", title: "Building cleaning / janitorial services" },
    { system: "GSIN" as const, code: "S206", title: "Janitorial services" },
    { system: "NAICS" as const, code: "561720", title: "Janitorial services" },
  ];
  for (const c of codes) {
    await prisma.classificationCode.upsert({
      where: { system_code: { system: c.system, code: c.code } },
      update: {},
      create: c,
    });
  }

  // Keyword library.
  const terms = ["janitorial", "custodial services", "building maintenance", "facilities management", "snow removal", "hvac"];
  const kw: Record<string, string> = {};
  for (const t of terms) {
    const normalized = normalizeTerm(t);
    const existing = await prisma.keyword.findFirst({ where: { normalized } });
    const k = existing ?? (await prisma.keyword.create({ data: { term: t, normalized, weight: 2 } }));
    kw[t] = k.id;
  }

  // Sample client: an Ontario janitorial contractor.
  const acme = await prisma.client.create({
    data: {
      name: "Acme Facility Services",
      status: "active",
      planTier: "Growth",
      jurisdictions: ["ON", "QC"],
      trades: ["janitorial", "facilities"],
      clearances: ["WSIB", "$2M liability insurance"],
      valueMin: 50000,
      valueMax: 2000000,
    },
  });
  const jan = await prisma.classificationCode.findFirst({ where: { code: "76111501" } });
  if (jan) await prisma.clientCode.create({ data: { clientId: acme.id, codeId: jan.id } });
  for (const t of ["janitorial", "custodial services", "building maintenance"]) {
    await prisma.clientKeyword.create({ data: { clientId: acme.id, keywordId: kw[t] } });
  }

  console.log("Seeded codes, keywords and a sample client.");
}

main().finally(() => prisma.$disconnect());
