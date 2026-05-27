# Build Phases

## Phase 1 — Foundation
- Next.js 14 + TS + Tailwind + ESLint
- Theme tokens for the dark futuristic look
- Prisma + Postgres + initial schema + seed
- NextAuth config (Email + Google)
- App shell: sidebar, topbar, mobile nav
- Command palette stub
- Routing skeleton for every page

## Phase 2 — Master Dashboard
- Implement every panel listed in the spec
- API: `GET /api/dashboard/master`
- Mocked/seeded data flowing end-to-end
- Mobile layout pass

## Phase 3 — Global Modules
- Tasks (views, kanban, quick add, recurrence)
- Ideas (inbox + AI expand stub)
- Calendar (internal first, Google sync hook)
- Contacts / Customers / Leads / Pipeline
- Finance (expenses, revenue, credit cards, bills, P&L)
- Inventory
- Notifications center

## Phase 4 — Business Dashboards
- Lexus, Fitness, Content, Phone Repair, Supplements, Personal
- Each: KPI strip + tables/boards + money snapshot + AI agent panel

## Phase 5 — AI Layer
- aiClient wrapper around Anthropic SDK
- Master CEO Agent + sub-agents + Zod-validated tool schemas
- `/ai` streaming chat
- Daily briefing cron + insight persistence

## Phase 6 — Integrations
- Google Calendar (OAuth + two-way sync)
- Gmail (read + score + draft)
- WhatsApp Cloud API (webhook + outbound)
- Slack incoming webhook
- Twilio SMS

## Phase 7 — Automations + Reports
- Automations builder UI
- Inngest functions for each seeded automation
- Report generators (daily / weekly / monthly / etc.)

## Phase 8 — Polish
- Mobile performance + gestures
- Global search with pgvector
- Offline-tolerant quick add
- Skeleton loaders, optimistic UI
- Onboarding tour

This repository ships **Phases 1 + 2 + meaningful chunks of 3, 4, 5** as the initial commit, with the integrations and automation runners stubbed behind feature flags and clean adapters so each can be turned on incrementally without refactoring.
