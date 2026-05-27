# API Route Plan

All routes live under `/src/app/api/*`. Server actions are used for simple form mutations; REST is used where the client needs cached fetches via TanStack Query.

## Auth
- `POST /api/auth/[...nextauth]` — NextAuth handler.

## Core
- `GET    /api/businesses` · `PATCH /api/businesses/[id]`
- `GET    /api/dashboard/master` — aggregate panel data in one call.
- `GET    /api/dashboard/business/[slug]` — per-business aggregate.

## Tasks
- `GET    /api/tasks?view=today|week|overdue|waiting|priority|all&businessId=...`
- `POST   /api/tasks`
- `PATCH  /api/tasks/[id]`
- `DELETE /api/tasks/[id]`
- `POST   /api/tasks/[id]/complete`
- `POST   /api/tasks/quick-add` — natural-language → AI parse → task.

## Ideas
- `GET/POST/PATCH/DELETE /api/ideas/...`
- `POST /api/ideas/[id]/expand` — AI feasibility + expansion.
- `POST /api/ideas/[id]/convert` — to task / project / content.

## Calendar
- `GET    /api/calendar?from=&to=`
- `POST   /api/calendar`
- `PATCH  /api/calendar/[id]`
- `POST   /api/calendar/sync/google` — manual sync.
- `POST   /api/webhooks/google-calendar` — push notifications.

## Finance
- `GET/POST/PATCH/DELETE /api/expenses/...`
- `GET    /api/revenue/...`
- `GET/POST/PATCH /api/credit-cards/...`
- `GET/POST/PATCH /api/bills/...`
- `GET    /api/finance/pl?range=`
- `GET    /api/finance/forecast?days=30`

## CRM
- `GET/POST/PATCH/DELETE /api/contacts/...`
- `GET/POST/PATCH /api/customers/...`
- `GET/POST/PATCH /api/leads/...`
- `GET/POST/PATCH /api/deals/...`

## Inventory
- `GET/POST/PATCH/DELETE /api/inventory/...`
- `GET    /api/inventory/low-stock`

## Repair (Phone)
- `GET/POST/PATCH /api/repair/tickets/...`

## Fitness
- `GET/POST/PATCH /api/fitness/clients/...`
- `GET/POST       /api/fitness/check-ins/...`

## Content
- `GET/POST/PATCH /api/content/items/...`
- `GET            /api/content/analytics?platform=...`

## Supplements
- `GET/POST/PATCH /api/supplements/products/...`
- `GET/POST       /api/supplements/orders/...`

## AI
- `POST /api/ai/chat` — streaming chat with selected agent.
- `POST /api/ai/briefing` — generate today's briefing on demand.
- `POST /api/ai/expense/categorize`
- `POST /api/ai/idea/expand`
- `POST /api/ai/email/score`
- `POST /api/ai/task/from-message`
- `POST /api/ai/draft` — generic draft (caption, email, message).

## Automations
- `GET/POST/PATCH /api/automations/...`
- `POST /api/automations/[id]/run`

## Reports
- `GET /api/reports?type=daily|weekly|monthly|business|pipeline|content|retention|inventory`

## Notifications
- `GET /api/notifications`
- `POST /api/notifications/[id]/read`

## Integrations (webhooks)
- `POST /api/webhooks/whatsapp` — Meta cloud webhook.
- `POST /api/webhooks/twilio`
- `POST /api/webhooks/inngest`
- `POST /api/webhooks/gmail` — Pub/Sub push.

## Search
- `GET /api/search?q=`
