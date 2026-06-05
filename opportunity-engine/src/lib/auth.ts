import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_MS, createSessionToken, verifySessionToken } from "./session";

// Server-side helpers that touch the cookie store (Node runtime only).
// Middleware uses verifySessionToken from ./session directly.

export async function isAuthed(): Promise<boolean> {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

export async function startSession(): Promise<void> {
  const token = await createSessionToken();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function endSession(): void {
  cookies().delete(SESSION_COOKIE);
}

/** Constant-time string compare (length is not secret here). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
