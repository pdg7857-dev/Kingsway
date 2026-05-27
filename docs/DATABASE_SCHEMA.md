# Database Schema

Postgres via Prisma. Every domain table is owned by a `User` and optionally tagged to a `Business`. Soft conventions: `createdAt`, `updatedAt` everywhere, `archivedAt` where applicable.

## Entity overview

```
User ──┐
       ├── Business (6 seeded)
       ├── Task ───────── (n) Subtask
       ├── Project ─────── (n) Task
       ├── Idea
       ├── Contact ─────── (n) Customer / Lead
       ├── Customer
       ├── Lead ────────── (n) Deal
       ├── Deal (sales pipeline)
       ├── CalendarEvent
       ├── Notification
       ├── Expense ──────── CreditCard
       ├── Revenue
       ├── CreditCard
       ├── Bill
       ├── InventoryItem
       ├── Order
       ├── RepairTicket   (Phone repair)
       ├── FitnessClient   (Fitness)
       │   ├── FitnessCheckIn
       │   └── WorkoutProgram
       ├── ContentItem     (Social)
       │   └── SocialAnalytics
       ├── SupplementProduct (Supplement)
       │   └── SupplementOrder
       ├── Automation
       ├── Report
       ├── AIInsight
       ├── EmailImport
       ├── WhatsAppMessage
       └── Document
```

## Enums

- `BusinessSlug`: `lexus | fitness | content | phone_repair | supplements | personal`
- `Priority`: `LOW | MEDIUM | HIGH | URGENT`
- `TaskStatus`: `TODO | IN_PROGRESS | WAITING | DONE | CANCELLED`
- `DealStage`: `LEAD | CONTACTED | QUALIFIED | TEST_DRIVE | NEGOTIATION | WON | LOST`
- `ExpenseStatus`: `PENDING | PAID | OVERDUE`
- `RecurrenceFreq`: `NONE | DAILY | WEEKLY | MONTHLY | YEARLY`
- `NotificationChannel`: `IN_APP | EMAIL | SMS | SLACK | PUSH`
- `RepairStatus`: `RECEIVED | DIAGNOSED | IN_REPAIR | AWAITING_PARTS | READY | DELIVERED | CANCELLED`
- `OrderChannel`: `WEBSITE | MAIL_IN | PICKUP | MARKETPLACE | OTHER`
- `ContentPlatform`: `INSTAGRAM | TIKTOK | YOUTUBE | FACEBOOK | X | LINKEDIN`
- `ContentStatus`: `IDEA | SCRIPTED | FILMED | EDITING | SCHEDULED | POSTED | ARCHIVED`
- `FitnessClientStatus`: `LEAD | ONBOARDING | ACTIVE | PAUSED | CHURNED`
- `IdeaStatus`: `INBOX | EXPLORING | VALIDATED | CONVERTED | ARCHIVED`

## Key tables (Prisma-level summary)

See `prisma/schema.prisma` for the complete typed schema. Highlights:

- **Task** has `businessId`, `projectId?`, `customerId?`, `dueAt`, `remindAt`, `priority`, `status`, `recurrence`, `relatedEmailId?`, `relatedMessageId?`, `parentId?` for subtasks.
- **Expense** has `vendor`, `creditCardId?`, `paymentMethod`, `dueAt`, `status`, `recurrence`, `taxCategory`, `aiCategory`, `receiptUrl`.
- **CreditCard** tracks `balance`, `limit`, `statementDay`, `paymentDueDay`, `apr`.
- **Bill** is a recurring expense template tied to a vendor.
- **Deal** lives in the sales pipeline; stages drive the Kanban.
- **InventoryItem** is polymorphic via `businessId` (phones, supplements, etc.) with `sku`, `cost`, `price`, `quantity`, `reorderAt`.
- **RepairTicket** has `imei`, `device`, `issue`, `partsUsed[]`, `status`, `customerId`, `cost`, `price`.
- **FitnessClient** has `goal`, `program`, `coachId?`, `mrrCents`, `status`, `lastCheckInAt`, `renewalAt`.
- **ContentItem** has `platform`, `status`, `hook`, `caption`, `script`, `scheduledAt`, `postedAt`, `metricsId?`.
- **AIInsight** stores `kind`, `summary`, `payload Json`, `agent` so insights are auditable.
- **EmailImport** and **WhatsAppMessage** keep external messages with `importance` scored by AI.
- **Automation** stores a `trigger` JSON, `actions` JSON[], `lastRunAt`, `enabled`.

## Indexes

- All `userId` columns indexed.
- `(userId, businessId, dueAt)` composite on Task and Expense.
- `(userId, status)` on Deal, RepairTicket, FitnessClient.
- `(userId, scheduledAt)` on ContentItem and CalendarEvent.
- Trigram or `pg_trgm` index later for search across notes/titles.

## Money

All money stored as **integer cents** (`BigInt` not needed; `Int` is fine up to $21M). Currency assumed USD; field `currency` reserved.
