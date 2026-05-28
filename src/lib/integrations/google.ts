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
  url.searchParams.set("q", "is:unread newer_than:14d");
  url.searchParams.set("maxResults", String(max));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return { ok: false as const, reason: `HTTP ${res.status}`, messages: [] };
  const data = await res.json();
  return { ok: true as const, messages: data.messages ?? [] };
}

export async function getGmailMessage(token: string, id: string) {
  const url = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`);
  url.searchParams.set("format", "metadata");
  ["From", "Subject", "Date", "To"].forEach((h) => url.searchParams.append("metadataHeaders", h));
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  const headers: Record<string, string> = {};
  for (const h of data.payload?.headers ?? []) headers[h.name] = h.value;
  return {
    id: data.id as string,
    threadId: data.threadId as string,
    snippet: (data.snippet as string) ?? "",
    from: headers.From ?? "",
    to: headers.To ?? "",
    subject: headers.Subject ?? "",
    date: headers.Date ? new Date(headers.Date) : new Date(),
    labels: (data.labelIds as string[]) ?? [],
  };
}
