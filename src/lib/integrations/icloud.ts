/**
 * Minimal iCloud CalDAV client.
 *
 * Auth: Apple ID + an app-specific password (appleid.apple.com → Sign-In & Security).
 * Discovery: current-user-principal → calendar-home-set → list collections,
 * then pick the first VEVENT calendar and first VTODO (Reminders) list.
 *
 * Push uses deterministic UIDs (kingsway-<type>-<id>) so re-pushing updates
 * the same item instead of duplicating. Pull uses a calendar-query REPORT.
 */

const BASE = "https://caldav.icloud.com";

function authHeader(appleId: string, appPassword: string) {
  return "Basic " + Buffer.from(`${appleId.trim()}:${appPassword.trim()}`).toString("base64");
}

const DAV_HEADERS = (auth: string, depth: string) => ({
  Authorization: auth,
  "Content-Type": "application/xml; charset=utf-8",
  Depth: depth,
  "User-Agent": "Kingsway-OS/1.0 (CalDAV)",
  Accept: "application/xml, text/xml",
});

function tagBlocks(xml: string, tag: string): string[] {
  const re = new RegExp(`<(?:\\w+:)?${tag}\\b[\\s\\S]*?<\\/(?:\\w+:)?${tag}>`, "gi");
  return xml.match(re) ?? [];
}
function firstTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<(?:\\w+:)?${tag}\\b[^>]*>([\\s\\S]*?)<\\/(?:\\w+:)?${tag}>`, "i"));
  return m ? m[1].trim() : null;
}
function resolveUrl(href: string, ref: string) {
  if (/^https?:\/\//i.test(href)) return href;
  try {
    return new URL(href, ref).toString();
  } catch {
    return href;
  }
}

async function propfind(url: string, auth: string, body: string, depth = "0") {
  const res = await fetch(url, {
    method: "PROPFIND",
    headers: DAV_HEADERS(auth, depth),
    body,
    redirect: "follow",
  });
  return { ok: res.ok || res.status === 207, status: res.status, text: await res.text() };
}

const snippet = (t: string) => (t || "").replace(/\s+/g, " ").slice(0, 180);

export async function discoverICloud(appleId: string, appPassword: string) {
  const auth = authHeader(appleId, appPassword);

  // 1) current-user-principal — try the bare host then the well-known path.
  let p1 = await propfind(
    BASE + "/",
    auth,
    `<d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal/></d:prop></d:propfind>`
  );
  if (p1.status === 401) {
    return { ok: false as const, reason: "iCloud rejected the login (401). Use your Apple ID email and an APP-SPECIFIC password from appleid.apple.com — your normal Apple password won't work." };
  }
  if (!p1.ok) {
    p1 = await propfind(
      BASE + "/.well-known/caldav",
      auth,
      `<d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal/></d:prop></d:propfind>`
    );
  }
  if (!p1.ok) return { ok: false as const, reason: `Discovery failed (HTTP ${p1.status}). Response: ${snippet(p1.text)}` };
  const principalHref = firstTag(firstTag(p1.text, "current-user-principal") ?? p1.text, "href");
  if (!principalHref) return { ok: false as const, reason: `Could not find principal in iCloud response: ${snippet(p1.text)}` };
  const principalUrl = resolveUrl(principalHref, BASE);

  // 2) calendar-home-set
  const p2 = await propfind(
    principalUrl,
    auth,
    `<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav"><d:prop><c:calendar-home-set/></d:prop></d:propfind>`
  );
  if (!p2.ok) return { ok: false as const, reason: `Calendar-home lookup failed (HTTP ${p2.status}). Response: ${snippet(p2.text)}` };
  const homeHref = firstTag(firstTag(p2.text, "calendar-home-set") ?? p2.text, "href");
  if (!homeHref) return { ok: false as const, reason: `Could not find calendar home: ${snippet(p2.text)}` };
  const homeUrl = resolveUrl(homeHref, principalUrl);

  // 3) list collections
  const p3 = await propfind(
    homeUrl,
    auth,
    `<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav"><d:prop><d:resourcetype/><d:displayname/><c:supported-calendar-component-set/></d:prop></d:propfind>`,
    "1"
  );
  let calendarUrl: string | null = null;
  let remindersUrl: string | null = null;
  for (const block of tagBlocks(p3.text, "response")) {
    const href = firstTag(block, "href");
    if (!href) continue;
    const isCalendar = /<(?:\w+:)?calendar\b/i.test(block);
    if (!isCalendar) continue;
    const supportsTodo = /VTODO/i.test(block);
    const supportsEvent = /VEVENT/i.test(block);
    const full = resolveUrl(href, homeUrl);
    if (supportsEvent && !calendarUrl) calendarUrl = full;
    if (supportsTodo && !remindersUrl) remindersUrl = full;
  }

  if (!calendarUrl && !remindersUrl) return { ok: false as const, reason: "No calendars or reminder lists found." };
  return { ok: true as const, principalUrl, calendarUrl, remindersUrl };
}

function icalEscape(s: string) {
  return (s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function fmtICalDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

async function putICS(collectionUrl: string, auth: string, uid: string, ics: string) {
  const url = collectionUrl.replace(/\/$/, "") + "/" + uid + ".ics";
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "text/calendar; charset=utf-8", "User-Agent": "Kingsway-OS/1.0 (CalDAV)" },
    body: ics,
  });
  return res.ok || res.status === 201 || res.status === 204;
}

export async function pushEvent(opts: {
  appleId: string; appPassword: string; calendarUrl: string;
  uid: string; summary: string; start: Date; end: Date; description?: string; location?: string;
}) {
  const auth = authHeader(opts.appleId, opts.appPassword);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kingsway OS//EN",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${fmtICalDate(new Date())}`,
    `DTSTART:${fmtICalDate(opts.start)}`,
    `DTEND:${fmtICalDate(opts.end)}`,
    `SUMMARY:${icalEscape(opts.summary)}`,
    opts.location ? `LOCATION:${icalEscape(opts.location)}` : "",
    opts.description ? `DESCRIPTION:${icalEscape(opts.description)}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return putICS(opts.calendarUrl, auth, opts.uid, ics);
}

export async function pushReminder(opts: {
  appleId: string; appPassword: string; remindersUrl: string;
  uid: string; summary: string; due?: Date | null; description?: string;
}) {
  const auth = authHeader(opts.appleId, opts.appPassword);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kingsway OS//EN",
    "BEGIN:VTODO",
    `UID:${opts.uid}`,
    `DTSTAMP:${fmtICalDate(new Date())}`,
    opts.due ? `DUE:${fmtICalDate(opts.due)}` : "",
    `SUMMARY:${icalEscape(opts.summary)}`,
    opts.description ? `DESCRIPTION:${icalEscape(opts.description)}` : "",
    "STATUS:NEEDS-ACTION",
    "END:VTODO", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return putICS(opts.remindersUrl, auth, opts.uid, ics);
}

export async function pullEvents(opts: {
  appleId: string; appPassword: string; calendarUrl: string; from: Date; to: Date;
}) {
  const auth = authHeader(opts.appleId, opts.appPassword);
  const body = `<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop><d:getetag/><c:calendar-data/></d:prop>
  <c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT">
  <c:time-range start="${fmtICalDate(opts.from)}" end="${fmtICalDate(opts.to)}"/>
  </c:comp-filter></c:comp-filter></c:filter></c:calendar-query>`;
  const res = await fetch(opts.calendarUrl, {
    method: "REPORT",
    headers: DAV_HEADERS(auth, "1"),
    body,
  });
  if (!(res.ok || res.status === 207)) return { ok: false as const, events: [] };
  const text = await res.text();
  const events: { uid: string; summary: string; start: Date; end: Date }[] = [];
  for (const block of tagBlocks(text, "response")) {
    const data = firstTag(block, "calendar-data");
    if (!data) continue;
    const uid = data.match(/UID:(.+)/)?.[1]?.trim();
    const summary = data.match(/SUMMARY:(.+)/)?.[1]?.trim() ?? "(untitled)";
    const dtStart = data.match(/DTSTART[^:]*:(.+)/)?.[1]?.trim();
    const dtEnd = data.match(/DTEND[^:]*:(.+)/)?.[1]?.trim();
    if (!uid || !dtStart) continue;
    const start = parseICalDate(dtStart);
    const end = dtEnd ? parseICalDate(dtEnd) : new Date(start.getTime() + 3600000);
    if (start) events.push({ uid, summary, start, end });
  }
  return { ok: true as const, events };
}

function parseICalDate(s: string): Date {
  // forms: 20260115T180000Z, 20260115T180000, 20260115
  const m = s.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?/);
  if (!m) return new Date(s);
  const [, y, mo, d, h = "0", mi = "0", se = "0", z] = m;
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${se}${z ? "Z" : ""}`;
  return new Date(iso);
}
