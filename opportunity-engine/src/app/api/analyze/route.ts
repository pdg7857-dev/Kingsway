import { NextResponse } from "next/server";
import { analyzeUploadedFile } from "@/lib/analyze-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const source = (form.get("source") as string) || null;
    const title = (form.get("title") as string) || undefined;
    const id = await analyzeUploadedFile(file, source, title);
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
