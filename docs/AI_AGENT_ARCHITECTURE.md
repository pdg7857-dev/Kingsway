# AI Agent Architecture

## Model strategy
- Default model: **Claude (Anthropic SDK)** for reasoning, long context, drafting.
- Embeddings: OpenAI `text-embedding-3-small` stored in pgvector.
- All calls go through a single `aiClient` wrapper so swapping is one-line.

## Agents

```
                ┌──────────────────────┐
                │   Master CEO Agent   │  ← top-level orchestrator
                └──────────┬───────────┘
                           │ delegates / aggregates
   ┌────────────┬──────────┼──────────┬────────────┬────────────┐
   ▼            ▼          ▼          ▼            ▼            ▼
 Finance     Email     Calendar    Sales       Content      Personal
 Agent       Agent     Agent       Agent       Agent        Agent
                                       ┌────────────┬────────────┐
                                       ▼            ▼            ▼
                                    Fitness     Phone        Supplement
                                    Agent       Repair       Agent
                                                Agent
```

Each agent has:
- **Role prompt** — its identity, scope, tone.
- **Tools** — typed functions it can call (read/write the relevant tables).
- **Context loaders** — functions that pull the right slice of data before the LLM call.
- **Output schema** — Zod-validated structured output for non-chat tasks.

## Master CEO Agent
- Scope: cross-business synthesis and orchestration.
- Tools: `listOverdueTasks`, `listUpcomingCosts`, `getCashFlowSnapshot`, `getBusinessHealth(business)`, `getInboxImportant`, `delegate(agent, prompt)`.
- Outputs: **Daily CEO Briefing**, prioritized action list, risk callouts.

## Finance Agent
- Scope: expenses, revenue, bills, credit cards, forecasting.
- Tools: `categorizeExpense`, `forecastCashFlow(days)`, `flagUpcomingBills(window)`, `suggestSavings`, `taxEstimate(year)`.

## Email Agent
- Scope: Gmail. Filters important, drafts replies, creates tasks.
- Tools: `listUnread`, `scoreImportance`, `summarizeThread`, `draftReply`, `createTaskFromEmail`.

## Calendar Agent
- Scope: Google Calendar + internal events.
- Tools: `summarizeDay`, `findConflicts`, `proposeSlot`, `createEvent`.

## Sales Agent (Lexus)
- Scope: leads, deals, follow-ups, commissions.
- Tools: `nextActionForDeal(id)`, `suggestFollowUpMessage(customer)`, `pipelineHealth`.

## Fitness Agent
- Scope: clients, check-ins, programs, retention.
- Tools: `clientsNeedingCheckIn`, `draftCheckInMessage`, `flagChurnRisk`, `programSuggestion`.

## Content Agent
- Scope: ideas → scripts → posts → analytics.
- Tools: `generateHooks(topic)`, `draftCaption(post)`, `repurposeIdeas`, `bestTimeToPost(platform)`, `analyzePerformance`.

## Phone Repair Agent
- Scope: tickets, inventory, margins.
- Tools: `quoteRepair(device, issue)`, `nextTicketAction`, `lowPartsAlert`, `marginReport`.

## Supplement Agent
- Scope: products, inventory, ads, subscriptions.
- Tools: `lowStockAlert`, `roasReport`, `churnRisk`, `launchChecklist`.

## Personal Life Agent
- Scope: tasks, habits, finances, goals.
- Tools: `dailyPlan`, `habitSummary`, `debtPayoffPlan`.

## Daily flow

1. Cron `06:30 local` fires `daily-briefing.run`.
2. Master CEO Agent calls each sub-agent's `summary()` in parallel.
3. Sub-agent summaries are reduced into one briefing.
4. Briefing is persisted as `AIInsight(kind=DAILY_BRIEFING)`.
5. Push to Slack + SMS + in-app dashboard.

## Streaming chat

`/ai` page streams responses with the Anthropic SDK. The chosen agent's tools are exposed as Claude tool definitions. Tool calls hit internal API routes that share the same Prisma client — same data, no drift.

## Memory

- Recent conversation kept in `AIConversation` + `AIMessage` tables.
- Embedded snippets of insights, ideas, and meeting notes live in `AIMemory` with a pgvector column for retrieval.
- Retrieval is run before every chat turn and added as system context.

## Safety

- Anything that writes (creates a task, sends an email, schedules a post) requires either an explicit user confirmation OR an `Automation` the user enabled.
- Outbound side-effects are logged in `AIInsight` with `kind=ACTION_TAKEN`.
