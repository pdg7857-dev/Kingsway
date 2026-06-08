import { NextResponse } from "next/server";
import { analyzePastedText, analyzeUploadedBundle } from "@/lib/analyze-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// External-ingest endpoint for a document scraper. Authenticated with
// INGEST_TOKEN (header x-ingest-token or Authorization: Bearer ...), separate
// from the operator session, so a scraper can push solicitations in.
//
//   JSON:      { "title": "...", "source": "...", "text": "full text" }
//   Multipart: file=<pdf/docx/zip> [+ title, source]
//
// Returns { id } of the created+analyzed opportunity.

function authed(req: Request): boolean {
  const token = process.env.INGEST_TOKEN;
  if (!token) return false;
  const header = req.headers.get("x-ingest-token") || (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return header === token;
}

export async function POST(req: Request) {
  if (!process.env.INGEST_TOKEN) {
    return NextResponse.json({ error: "Ingest not configured. Set INGEST_TOKEN." }, { status: 503 });
  }
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const files = form.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);
      if (files.length === 0) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      const id = await analyzeUploadedBundle(files, (form.get("source") as string) || "scraper", (form.get("title") as string) || undefined);
      return NextResponse.json({ id });
    }

    const body = await req.json().catch(() => ({}));
    const text = String(body.text ?? "").trim();
    if (!text) return NextResponse.json({ error: "Provide 'text' (JSON) or a multipart file" }, { status: 400 });
    const id = await analyzePastedText(text, body.source ?? "scraper", body.title ?? "Scraped solicitation");
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
