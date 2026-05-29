import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/integrations/sms";
import { postToSlack } from "@/lib/integrations/slack";
import type { NotificationKind } from "@prisma/client";

export function smsConfigured() {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER && process.env.ALERT_TO_NUMBER);
}
export function slackConfigured() {
  return !!process.env.SLACK_WEBHOOK_URL;
}

/**
 * Store an in-app notification and fan it out to whatever channels are
 * configured. SMS goes to ALERT_TO_NUMBER; Slack to the webhook.
 */
export async function dispatchNotification(opts: {
  userId: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  sms?: boolean;
  slack?: boolean;
  slackText?: string; // longer/richer text for Slack
}) {
  const channels: ("IN_APP" | "SMS" | "SLACK")[] = ["IN_APP"];
  const results: Record<string, unknown> = {};

  if (opts.sms !== false && smsConfigured()) {
    const text = `Kingsway: ${opts.title}${opts.body ? ` — ${opts.body}` : ""}`.slice(0, 320);
    results.sms = await sendSMS(process.env.ALERT_TO_NUMBER!, text);
    channels.push("SMS");
  }
  if (opts.slack !== false && slackConfigured()) {
    results.slack = await postToSlack(opts.slackText ?? `*${opts.title}*\n${opts.body ?? ""}`);
    channels.push("SLACK");
  }

  await prisma.notification.create({
    data: { userId: opts.userId, kind: opts.kind, title: opts.title, body: opts.body, channels, sentAt: new Date() },
  });

  return { channels, results };
}
