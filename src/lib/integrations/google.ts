/**
 * Google API adapter scaffolding for Calendar + Gmail.
 *
 * OAuth is captured by NextAuth's GoogleProvider with calendar + gmail scopes;
 * the access token lives on the `Account` row. These helpers expect the caller
 * to look up the access token via Prisma.
 */
import { prisma } from "../prisma";

export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  const acct = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    orderBy: { id: "desc" },
  });
  return acct?.access_token ?? null;
}

export async function listCalendarEvents(userId: string, params: { timeMin: Date; timeMax: Date }) {
  const token = await getGoogleAccessToken(userId);
  if (!token) return { ok: false as const, reason: "Google not connected", events: [] };
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", params.timeMin.toISOString());
  url.searchParams.set("timeMax", params.timeMax.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { ok: false as const, reason: `HTTP ${res.status}`, events: [] };
  const data = await res.json();
  return { ok: true as const, events: data.items ?? [] };
}

export async function listGmailUnread(userId: string, max = 20) {
  const token = await getGoogleAccessToken(userId);
  if (!token) return { ok: false as const, reason: "Gmail not connected", messages: [] };
  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  url.searchParams.set("q", "is:unread");
  url.searchParams.set("maxResults", String(max));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { ok: false as const, reason: `HTTP ${res.status}`, messages: [] };
  const data = await res.json();
  return { ok: true as const, messages: data.messages ?? [] };
}
