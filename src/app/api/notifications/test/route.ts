import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { dispatchNotification, smsConfigured, slackConfigured } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await requireCurrentUser();
  if (!smsConfigured() && !slackConfigured()) {
    return NextResponse.json({ ok: false, error: "No SMS or Slack configured. Add Twilio env vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ALERT_TO_NUMBER) in Vercel." }, { status: 400 });
  }
  const r = await dispatchNotification({
    userId: user.id,
    kind: "GENERIC",
    title: "Test alert",
    body: "If you got this, Kingsway alerts are working.",
  });
  return NextResponse.json({ ok: true, channels: r.channels, sms: smsConfigured(), slack: slackConfigured() });
}
