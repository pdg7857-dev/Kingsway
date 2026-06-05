import { cookies } from "next/headers";

// Minimal single-operator gate. A long random OPERATOR_ACCESS_TOKEN is required
// to sign in; the same value is stored in an httpOnly cookie. This is a
// deliberately small v1; swap for NextAuth when a client read-only portal is
// added (the Client/role model is already reserved for it).

const COOKIE = "oie_operator";

export function isAuthed(): boolean {
  const token = process.env.OPERATOR_ACCESS_TOKEN;
  if (!token) return true; // no token configured (local dev) => open
  return cookies().get(COOKIE)?.value === token;
}

export function signIn(candidate: string): boolean {
  const token = process.env.OPERATOR_ACCESS_TOKEN;
  if (!token || candidate !== token) return false;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export function signOut() {
  cookies().delete(COOKIE);
}
