import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "@/lib/seed";
import { INIT_SQL } from "@/lib/initSql";
import { MIGRATE_SQL } from "@/lib/migrateSql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-shot setup endpoint.
 *
 *   GET/POST /api/setup?token=<SETUP_TOKEN>
 *
 * Steps:
 *   1) Connect to DIRECT_URL via `pg` (bypassing pgbouncer for DDL).
 *   2) Run prisma/init.sql to create all tables, enums, indexes.
 *      Skips silently if objects already exist.
 *   3) Seed the operator user + six businesses + sample data
 *      (idempotent — re-running won't duplicate rows).
 *
 * After it returns ok, you can delete SETUP_TOKEN from env to disable
 * the endpoint, or leave it for re-seeds.
 */
async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const provided = url.searchParams.get("token") ?? req.headers.get("x-setup-token");
  const expected = process.env.SETUP_TOKEN;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "SETUP_TOKEN env var not set on the server. Add it in Vercel → Project Settings → Environment Variables and redeploy." },
      { status: 500 }
    );
  }
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }

  const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!directUrl) {
    return NextResponse.json({ ok: false, error: "DIRECT_URL (or DATABASE_URL) is missing." }, { status: 500 });
  }

  const steps: { name: string; ok: boolean; detail?: string }[] = [];

  // Step 1: run schema migration (SQL is embedded at build time)
  const sql = INIT_SQL;

  const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    // pg supports multi-statement queries in the simple protocol.
    await client.query(sql);
    steps.push({ name: "schema", ok: true, detail: "init.sql applied" });
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    // If the schema is already in place, every statement throws "already exists".
    // That's a success — record it and move on.
    if (/already exists/i.test(msg)) {
      steps.push({ name: "schema", ok: true, detail: "already present" });
    } else {
      await client.end().catch(() => {});
      return NextResponse.json(
        { ok: false, steps, error: `Schema apply failed: ${msg}` },
        { status: 500 }
      );
    }
  } finally {
    await client.end().catch(() => {});
  }

  // Step 1b: idempotent incremental migration (adds new columns/tables to
  // already-provisioned databases). Always runs; safe on fresh installs too.
  const migrateClient = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  try {
    await migrateClient.connect();
    await migrateClient.query(MIGRATE_SQL);
    steps.push({ name: "migrate", ok: true, detail: "incremental migration applied" });
  } catch (e: any) {
    steps.push({ name: "migrate", ok: false, detail: String(e?.message ?? e) });
  } finally {
    await migrateClient.end().catch(() => {});
  }

  // Step 2: seed (uses Prisma → pooled URL → fine for inserts)
  try {
    const prisma = new PrismaClient();
    try {
      const result = await runSeed(prisma);
      steps.push({
        name: "seed",
        ok: true,
        detail: result.sampleData ? "user + businesses + sample data" : "user + businesses (sample data skipped — already seeded)",
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, steps, error: `Seed failed: ${e?.message ?? e}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    steps,
    next: "Open the root URL and start using the dashboard.",
  });
}

export async function GET(req: NextRequest) { return handle(req); }
export async function POST(req: NextRequest) { return handle(req); }
