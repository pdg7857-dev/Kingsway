// Document vault storage. Local filesystem adapter for now, behind a small
// interface so a Supabase Storage / S3 adapter can replace it without touching
// callers. Note: on ephemeral hosts (Vercel) the local disk does not persist;
// switch to the Supabase adapter for durable originals. Extracted text always
// lives in Postgres, so cross-referencing keeps working regardless.

import { mkdir, writeFile, readFile } from "fs/promises";
import { join, dirname } from "path";
import { randomUUID } from "crypto";

const ROOT = join(process.cwd(), "uploads");

export type StoredFile = { storagePath: string };

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "file";
}

export async function storeFile(buf: Buffer, originalName: string): Promise<StoredFile> {
  const rel = join(new Date().toISOString().slice(0, 7), `${randomUUID()}-${safeName(originalName)}`);
  const abs = join(ROOT, rel);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, buf);
  return { storagePath: rel };
}

export async function readStoredFile(storagePath: string): Promise<Buffer> {
  return readFile(join(ROOT, storagePath));
}
