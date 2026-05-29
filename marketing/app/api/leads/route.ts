import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side proxy: forwards a captured lead to the main GOIP app's CRM
// (POST /api/oi/leads). Keeps the main app URL server-side and avoids CORS.
// Configure MAIN_APP_URL in this project's Vercel env vars, e.g.
//   MAIN_APP_URL=https://kingsway.vercel.app
export async function POST(req: NextRequest) {
  const base = process.env.MAIN_APP_URL;
  if (!base) {
    return NextResponse.json(
      { error: "MAIN_APP_URL is not configured on the marketing site." },
      { status: 503 }
    );
  }
  const payload = await req.json();
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/oi/leads`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ error: `Could not reach CRM: ${e?.message ?? e}` }, { status: 502 });
  }
}
