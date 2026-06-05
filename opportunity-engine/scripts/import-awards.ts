/**
 * Streaming importer for CanadaBuys award / contract-history CSV exports.
 * Handles very large files (no upload limit). Maps rows with the shared
 * CanadaBuys mapper, forecasts renewal windows, dedupes to the latest amendment
 * per contract, and bulk-inserts.
 *
 *   npx tsx scripts/import-awards.ts <file.csv> [options]
 *
 * Options:
 *   --dry-run              parse and report stats, write nothing (no DB needed)
 *   --min-value=N          skip contracts under N dollars (default 0)
 *   --require-dates        skip rows with no start/award/end date
 *   --no-dedupe            insert every row instead of latest-amendment-per-contract
 *   --limit=N              stop after N mapped rows (useful for spot checks)
 */

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { headerIndex } from "../src/lib/csv";
import { mapAwardRow, type AwardRow } from "../src/lib/canadabuys";
import { forecastRenewal } from "../src/lib/renewals";

type Opts = { dryRun: boolean; minValue: number; requireDates: boolean; dedupe: boolean; limit: number };

function parseArgs(argv: string[]): { file: string; opts: Opts } {
  const file = argv.find((a) => !a.startsWith("--")) ?? "";
  const get = (k: string) => argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
  return {
    file,
    opts: {
      dryRun: argv.includes("--dry-run"),
      minValue: Number(get("min-value") ?? 0),
      requireDates: argv.includes("--require-dates"),
      dedupe: !argv.includes("--no-dedupe"),
      limit: Number(get("limit") ?? 0),
    },
  };
}

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const { file, opts } = parseArgs(process.argv.slice(2));
  if (!file) {
    console.error("Usage: npx tsx scripts/import-awards.ts <file.csv> [--dry-run] [--min-value=N] [--require-dates] [--no-dedupe] [--limit=N]");
    process.exit(1);
  }

  const parser = createReadStream(file).pipe(
    parse({ relax_quotes: true, relax_column_count: true, skip_empty_lines: true }),
  );

  let header: string[] | null = null;
  let idx: Map<string, number> | null = null;
  let total = 0;
  let mappedCount = 0;
  let kept = 0;
  const stats = { withValue: 0, withSupplier: 0, withEnd: 0, withDates: 0 };
  // Dedupe store: contractNumber -> chosen row, keeping the highest amendment.
  const byContract = new Map<string, AwardRow>();
  const flat: AwardRow[] = [];
  const samples: AwardRow[] = [];

  for await (const record of parser as AsyncIterable<string[]>) {
    if (!header) {
      header = record;
      idx = headerIndex(header);
      continue;
    }
    total++;
    const a = mapAwardRow(record, idx!);
    if (!a) continue;

    if (opts.minValue && (a.value == null || a.value < opts.minValue)) continue;
    const hasDate = !!(a.startDate || a.awardDate || a.endDate);
    if (opts.requireDates && !hasDate) continue;
    mappedCount++;

    if (a.value != null) stats.withValue++;
    if (a.supplier) stats.withSupplier++;
    if (a.endDate) stats.withEnd++;
    if (hasDate) stats.withDates++;
    if (samples.length < 4) samples.push(a);

    if (opts.dedupe && a.contractNumber) {
      const prev = byContract.get(a.contractNumber);
      const amend = Number(a.amendmentNumber) || 0;
      const prevAmend = prev ? Number(prev.amendmentNumber) || 0 : -1;
      if (!prev || amend >= prevAmend) byContract.set(a.contractNumber, a);
    } else {
      flat.push(a);
    }
    if (opts.limit && mappedCount >= opts.limit) break;
  }

  const rows = opts.dedupe ? [...byContract.values(), ...flat] : flat;
  kept = rows.length;

  console.log(`\nParsed ${total} data rows from ${file}`);
  console.log(`Mapped after filters (min-value=${opts.minValue}, require-dates=${opts.requireDates}): ${mappedCount}`);
  console.log(`After dedupe (${opts.dedupe ? "latest amendment per contract" : "off"}): ${kept}`);
  console.log(`Signal: value ${stats.withValue}, supplier ${stats.withSupplier}, end-date ${stats.withEnd}, any-date ${stats.withDates}`);
  console.log("\nSample mapped rows:");
  for (const s of samples) {
    console.log(`  - ${s.title.slice(0, 60)} | buyer=${s.buyer.slice(0, 30)} | supplier=${s.supplier.slice(0, 30)} | $${s.value ?? "?"} | ${s.startDate || "?"}..${s.endDate || "?"} | ${s.jurisdiction.slice(0, 20)} | gsin=${s.gsin.join("/")}`);
  }

  if (opts.dryRun) {
    console.log("\nDry run: nothing written. Re-run without --dry-run (with DATABASE_URL set) to import.");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  let inserted = 0;
  const batchSize = 1000;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map((a) => {
      const awardDate = toDate(a.awardDate);
      const startDate = toDate(a.startDate);
      const endDate = toDate(a.endDate);
      const f = forecastRenewal({ awardDate, startDate, endDate });
      return {
        buyer: a.buyer, supplier: a.supplier || null, title: a.title,
        jurisdiction: a.jurisdiction || null, platform: "CanadaBuys",
        sourceRef: a.contractNumber || null, value: a.value ?? null,
        awardDate, startDate, endDate: f.endDate, endEstimated: f.endEstimated,
        rebidWindow: f.rebidWindow, status: f.status, codes: [...a.gsin, ...a.unspsc],
      };
    });
    await prisma.awardedContract.createMany({ data: batch });
    inserted += batch.length;
    if (i % 10000 === 0) console.log(`  inserted ${inserted}/${rows.length}...`);
  }
  await prisma.auditLog.create({ data: { action: "import_awards_cli", detail: `${inserted} from ${file}` } });
  await prisma.$disconnect();
  console.log(`\nDone. Inserted ${inserted} awarded contracts.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
