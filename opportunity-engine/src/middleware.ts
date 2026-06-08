import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken, authBypass } from "@/lib/session";

// Gate every route behind a valid session. /login and static assets are excluded
// via the matcher below.
export async function middleware(req: NextRequest) {
  if (authBypass()) return NextResponse.next();
  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?from=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // /api/ingest has its own token auth; everything else needs an operator session.
  matcher: ["/((?!login|api/ingest|_next/static|_next/image|favicon.ico).*)"],
};
