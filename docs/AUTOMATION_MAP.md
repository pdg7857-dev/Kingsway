# Automation Map

Each automation = `trigger → conditions → actions`. Stored in the `Automation` table; executed by Inngest functions.

## Triggers
- `cron` — fires on a schedule (e.g. daily 06:30).
- `email.received` — new Gmail message after AI scoring.
- `whatsapp.received` — new WhatsApp inbound.
- `task.created` / `task.overdue` / `task.completed`
- `expense.created` / `bill.due_soon`
- `inventory.low_stock`
- `deal.stage_changed`
- `fitness.client_overdue_checkin`
- `content.scheduled` / `content.posted`
- `manual` — fire from UI.

## Actions
- `task.create`
- `notification.send` (channels: in-app, SMS, Slack, email)
- `email.draft` / `email.send`
- `calendar.createEvent`
- `whatsapp.sendReply`
- `report.generate`
- `ai.run(agent, prompt)`
- `expense.categorize`

## Seeded automations

| # | Name                                | Trigger                         | Actions |
|---|-------------------------------------|---------------------------------|---------|
| 1 | Daily CEO Briefing                  | cron 06:30                      | ai.run(master) → notification.send(slack, sms), persist insight |
| 2 | Weekly Business Review              | cron Sun 17:00                  | ai.run(master, weekly), report.generate |
| 3 | Monthly Financial Report            | cron 1st 08:00                  | ai.run(finance, monthly), report.generate |
| 4 | Auto-task from important email      | email.received w/ importance≥4  | task.create, notification.send |
| 5 | Auto-task from WhatsApp inquiry     | whatsapp.received unanswered>2h | task.create, notification.send |
| 6 | Bill due in 3 days                  | cron daily + bill.due_soon      | notification.send(sms, slack), task.create |
| 7 | Credit card payment 5 days out      | cron daily                      | notification.send |
| 8 | Low inventory alert                 | inventory.low_stock             | task.create, notification.send |
| 9 | Sales follow-up 48h after test drive| deal.stage_changed → TEST_DRIVE | task.create + ai.run(sales, draft message) |
|10 | Fitness check-in nudge              | fitness.client_overdue_checkin  | whatsapp.draft + task.create |
|11 | Content posting reminder            | cron 30m before scheduledAt     | notification.send |
|12 | Voice note → task                   | manual (from quick add)         | ai.run(master, transcribe + extract), task.create |
|13 | Auto-categorize expense             | expense.created                 | ai.run(finance, categorize) → expense.update |
|14 | Repair ticket SLA at risk           | cron daily                      | notification.send + task.create |
|15 | Cash flow warning                   | cron daily                      | ai.run(finance, forecast); if low → SMS + slack |

## Idempotency
Each automation run records a `runKey` per trigger event so the same email or low-stock event cannot fire twice.
