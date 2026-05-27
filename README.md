# CEO Command OS

A dark-mode, AI-augmented operations dashboard for managing six businesses and personal life from a single command center.

- **Master dashboard** with daily AI briefing, today's priorities, money, alerts, calendar, inboxes, ideas, business health.
- **Six business dashboards** — Lexus sales, fitness coaching, content, phone repair, supplements, personal.
- **Global modules** — Tasks, Ideas, Calendar, Pipeline, Customers, Finance, Inventory, Automations, Reports, Notifications, AI Assistant.
- **10 AI agents** — one Master CEO Agent + 9 specialized agents (Finance, Email, Calendar, Sales, Fitness, Content, Phone Repair, Supplement, Personal).
- **Integration adapters** for Google Calendar, Gmail, WhatsApp Cloud API, Twilio SMS, Slack — gated behind env vars.

## Tech

- Next.js 14 App Router · React 18 · TypeScript · Tailwind CSS
- PostgreSQL + Prisma
- NextAuth (Google OAuth scopes for Calendar + Gmail)
- Anthropic Claude (Sonnet 4.6) + OpenAI (optional, embeddings)
- Recharts for charts
- Inngest / Vercel Cron for scheduled jobs (wired via automation runner)

## Getting started

**Deploy to Vercel + Supabase (recommended):** see [`docs/DEPLOY_VERCEL.md`](./docs/DEPLOY_VERCEL.md).

**Local dev:**

```bash
# 1. install
npm install

# 2. configure
cp .env.example .env
# edit DATABASE_URL + DIRECT_URL (both can be the same local Postgres URL)

# 3. db schema + seed
npm run db:push
npm run db:seed

# 4. dev
npm run dev
```

Open http://localhost:3000.  The seed creates the operator user, six businesses, sample tasks, expenses, deals, content items, repair tickets, fitness clients, ideas, and a starter daily briefing.

## Architecture docs

See [`/docs`](./docs):

- `ARCHITECTURE.md` — system, stack, folder layout
- `DATABASE_SCHEMA.md` — domain model summary
- `PAGE_MAP.md` — every route
- `COMPONENT_MAP.md` — reusable components
- `AI_AGENT_ARCHITECTURE.md` — agents, tools, daily flow
- `AUTOMATION_MAP.md` — triggers / actions / seeded automations
- `API_ROUTE_PLAN.md` — every API endpoint
- `BUILD_PHASES.md` — phased delivery plan

## What ships in this initial cut

Phases 1, 2, and meaningful chunks of 3/4/5 from `docs/BUILD_PHASES.md`:

- Full app shell (sidebar, topbar, mobile bottom nav, command palette, quick add, AI side panel)
- Master dashboard with **every panel** from the spec wired to the live schema
- Six per-business dashboards with KPI strip + pipeline/queue + tasks + agent context
- Global modules: Tasks (with views), Ideas, Calendar, Pipeline, Customers, Finance, Inventory, Automations, Reports, Notifications, AI Assistant chat
- Prisma schema covering every entity in the spec (28+ models)
- AI client + 10 agent specs + daily briefing pipeline (Anthropic SDK)
- Integration **adapters** for Google, WhatsApp, SMS, Slack — connect by setting env vars
- WhatsApp inbound webhook
- Automation runner that can execute seeded automations on demand

## What's stubbed (clean extension points)

- Google OAuth flow needs `GOOGLE_CLIENT_ID/SECRET` — code paths in `src/lib/integrations/google.ts`
- Inngest job functions are wired conceptually via `/api/automations/[id]/run` — point a cron at it or swap for Inngest definitions
- pgvector / AI memory retrieval is documented but not yet enabled
