# CEO Command OS — Product Architecture

A single, dark-mode, AI-augmented operations system for managing six business areas (Lexus sales, Online fitness, Social content, Phone repair/resale, Supplements, Personal) from one master command center.

## 1. Goals

- One **Master Dashboard** that gives a CEO-level view in under five seconds.
- One **Business Dashboard per area** with deep, area-specific KPIs and workflows.
- Reusable **global modules** (Tasks, Projects, Ideas, Calendar, Finance, Contacts, CRM, Inventory, Notifications, Automations, Reports).
- An **AI layer** that proactively summarizes, prioritizes, drafts, and acts.
- Heavy use on **mobile and desktop** — both must feel native.

## 2. Tech Stack

| Layer        | Choice                                              | Why |
|--------------|-----------------------------------------------------|-----|
| Framework    | **Next.js 14 (App Router) + React 18 + TypeScript** | Single codebase for server + client, RSC for fast data-rich dashboards, edge-friendly. |
| Styling      | **Tailwind CSS** + **CSS variables** for theming    | Dark futuristic UI, fast iteration, mobile-first. |
| UI primitives| **Radix UI** + handcrafted shadcn-style components  | Accessible, composable, themeable. |
| State        | Server components + **TanStack Query** for client   | Cache, mutations, optimistic UI. |
| DB           | **PostgreSQL** via **Prisma ORM**                    | Best DX for typed schemas, migrations, complex relations. |
| Hosting DB   | **Supabase** or Neon (Postgres + auth + storage)    | Managed, scalable, optional realtime. |
| Auth         | **NextAuth (Auth.js)** + Email + Google OAuth       | Single sign-on with Google for Calendar/Gmail scopes. |
| AI           | **Anthropic Claude** (primary) + OpenAI (fallback)  | Claude for reasoning/long context; OpenAI for embeddings. |
| Vector store | **pgvector** in Postgres                            | Keep AI memory in same DB. |
| Calendar     | **Google Calendar API**                              | Two-way sync. |
| Email        | **Gmail API**                                        | Read + draft. |
| Messaging    | **WhatsApp Cloud API** (Meta) + Twilio SMS          | Inbound customer routing + alerts. |
| Notifications| **Slack incoming webhooks**, **Twilio SMS**, web push | Multi-channel alerts. |
| Jobs         | **Inngest** (or Vercel Cron + queue)                 | Scheduled briefings, syncs, automations. |
| File storage | Supabase Storage / S3                                | Receipts, documents. |
| Deploy       | **Vercel** (web) + Supabase (db) + Inngest (jobs)    | Zero-ops, edge-fast. |

## 3. High-level System Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          Client (Next.js)                          │
│  Desktop & Mobile UI · Command Palette · AI Chat · Quick Add       │
└──────────────────────────┬─────────────────────────────────────────┘
                           │ RSC + REST + Server Actions
┌──────────────────────────▼─────────────────────────────────────────┐
│                    Next.js Server (App Router)                     │
│  /api routes · Server Actions · NextAuth · Middleware              │
└─────┬─────────────┬─────────────┬──────────────┬───────────────────┘
      │             │             │              │
      ▼             ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────────────────┐
│ Postgres │  │ AI Layer │  │ Integrations│  │ Scheduler (Inngest) │
│ +pgvector│  │ Claude/  │  │ Google,Gmail│  │ Cron jobs, queues   │
│  Prisma  │  │ OpenAI   │  │ WhatsApp,   │  │ Daily briefing,     │
│          │  │ Agents   │  │ Twilio,Slack│  │ syncs, reminders    │
└──────────┘  └──────────┘  └─────────────┘  └─────────────────────┘
```

## 4. Core Concepts

- **Workspace = one user (you).** Designed multi-user-ready; everything keyed to `userId`.
- **Business** is a first-class entity. Six seeded businesses; expandable.
- **Everything is taggable to a Business** (task, expense, idea, customer, event, etc.).
- **AI Insights** are persisted, not just streamed — they become a searchable log.
- **Notifications** are unified across channels with a single `Notification` table.

## 5. Folder Structure

```
/
├── prisma/                # schema, migrations, seed
├── src/
│   ├── app/
│   │   ├── (auth)/        # login, register
│   │   ├── (app)/         # authenticated shell
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               → Master dashboard
│   │   │   ├── tasks/                 → Global tasks
│   │   │   ├── calendar/              → Global calendar
│   │   │   ├── ideas/                 → Idea inbox
│   │   │   ├── contacts/              → CRM contacts
│   │   │   ├── customers/             → Customer DB
│   │   │   ├── leads/                 → Lead board
│   │   │   ├── pipeline/              → Sales pipeline
│   │   │   ├── finance/               → Money OS
│   │   │   ├── inventory/             → Inventory OS
│   │   │   ├── automations/           → Workflow builder
│   │   │   ├── reports/               → Reports
│   │   │   ├── ai/                    → AI assistant
│   │   │   └── business/
│   │   │       ├── lexus/
│   │   │       ├── fitness/
│   │   │       ├── content/
│   │   │       ├── phone-repair/
│   │   │       ├── supplements/
│   │   │       └── personal/
│   │   ├── api/           # REST + webhook endpoints
│   │   ├── layout.tsx     # root
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/            # primitives
│   │   ├── layout/        # sidebar, topbar, mobile nav
│   │   ├── dashboard/     # KPI cards, panels, charts
│   │   ├── ai/            # AI chat, agent UI
│   │   ├── tasks/
│   │   ├── finance/
│   │   └── command-palette.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── ai/            # agents, prompts
│   │   ├── integrations/  # google, gmail, whatsapp, slack, twilio
│   │   ├── jobs/          # inngest functions
│   │   └── utils.ts
│   └── types/
└── docs/                  # this folder
```

## 6. Build Phases (overview)

See `BUILD_PHASES.md` for detail.

1. **Foundation** — Next.js + Tailwind + Prisma + auth shell + dark theme.
2. **Master Dashboard** — every panel wired up with real schema (mocked data ok).
3. **Global Modules** — Tasks, Ideas, Finance, Calendar, Contacts/CRM.
4. **Business Dashboards** — six dashboards, each with their own KPIs and tables.
5. **AI Layer** — Master CEO Agent + sub-agents + daily briefing job.
6. **Integrations** — Google Calendar, Gmail, WhatsApp, Slack, Twilio.
7. **Automations + Reports** — workflows, scheduled reports, weekly review.
8. **Polish** — mobile, command palette, search, performance.
