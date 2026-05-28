# Page Map

All authenticated routes live under the `(app)` segment with a shared shell (sidebar + topbar + mobile bottom nav).

## Auth
- `/login` — email or Google sign-in.

## Master
- `/` — **Master Dashboard**. Panels:
  - Today's priorities
  - AI Daily Briefing
  - Overdue tasks
  - Upcoming tasks
  - Upcoming costs + bills
  - Credit card payments
  - Revenue / Profit / Costs by business (chart + KPI strip)
  - Cash flow overview
  - Upcoming calendar events
  - Important emails
  - Important WhatsApp / customer inquiries
  - Open opportunities
  - Risk alerts
  - Low inventory alerts
  - Client / customer follow-ups
  - Content schedule
  - Idea inbox preview
  - Business health score per business

## Global modules
- `/tasks` — All tasks, with views: Today / This Week / High Priority / Waiting On / Overdue / Kanban.
- `/projects` — Project list + project detail.
- `/calendar` — Month / week / day; combines events, deadlines, bills, follow-ups.
- `/ideas` — Quick-capture inbox with AI expansion.
- `/contacts` — Master contact directory.
- `/customers` — Customer records linked across businesses.
- `/leads` — Lead list with source + status.
- `/pipeline` — Kanban deal pipeline.
- `/finance` — Money OS. Tabs: Overview · Expenses · Revenue · Credit Cards · Bills · Forecast.
- `/receipts` — AI receipt scanner. Snap/upload a photo → extracts vendor, total, tax, date, card → files an expense.
- `/mileage` — Mileage tracker. From/to, reason, business vs personal, auto IRS deduction estimate.
- `/inventory` — Inventory across businesses, filterable.
- `/automations` — List + builder.
- `/reports` — Daily / weekly / monthly / business / pipeline / content / retention / inventory.
- `/ai` — Full AI assistant chat with agent picker and context.
- `/notifications` — Notification center.
- `/search` — Global search results.

## Business dashboards
- `/business/lexus`
- `/business/fitness`
- `/business/content`
- `/business/phone-repair`
- `/business/supplements`
- `/business/eprocurement` — gov-contract consulting: client pipeline w/ touch counts, retainer MRR, contract feed with AI summaries
- `/business/personal`

Each business dashboard has:
- KPI strip
- Pipeline / queue board specific to the business
- Money snapshot (revenue, profit, costs for that business)
- Tasks for that business
- AI agent panel scoped to the business
- Quick actions

## Settings
- `/settings/profile`
- `/settings/businesses`
- `/settings/integrations` — Google, Gmail, WhatsApp, Slack, Twilio.
- `/settings/notifications`
- `/settings/billing`

## Modals / overlays (not separate routes)
- Command palette (⌘K / Ctrl-K)
- Quick add (FAB on mobile, hotkey on desktop)
- AI chat slide-over (always reachable)
- Idea capture (voice or text)
