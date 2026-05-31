import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { GOIR_SQL } from "@/lib/goirSql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-shot, token-gated setup for the public site. Ensures the GoirReport table
 * exists on the shared database (the report's only table). Idempotent.
 *
 *   GET/POST /api/setup?token=<SETUP_TOKEN>
 *
 * Uses DIRECT_URL (bypasses pgbouncer for DDL) when available.
 */
async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const provided = url.searchParams.get("token") ?? req.headers.get("x-setup-token");
  const expected = process.env.SETUP_TOKEN;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "SETUP_TOKEN env var not set on the server." }, { status: 500 });
  }
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ ok: false, error: "DIRECT_URL / DATABASE_URL is missing." }, { status: 500 });
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(GOIR_SQL); // pg supports multi-statement simple queries
    return NextResponse.json({ ok: true, detail: "GoirReport table ensured." });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  } finally {
    await client.end().catch(() => {});
  }
}

export async function GET(req: NextRequest) { return handle(req); }
export async function POST(req: NextRequest) { return handle(req); }
