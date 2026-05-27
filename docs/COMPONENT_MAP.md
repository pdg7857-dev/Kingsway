# Component Map

## Layout
- `AppShell` — wraps authenticated app; holds sidebar, topbar, content, AI panel.
- `Sidebar` — primary nav, collapsible, hidden on mobile.
- `Topbar` — search trigger, AI button, notifications, profile.
- `MobileNav` — bottom tab bar for phones (Dashboard / Tasks / Add / AI / Menu).
- `CommandPalette` — global jump-to + actions.
- `QuickAddFab` — floating action button (mobile + keyboard).
- `AIChatPanel` — slide-over chat with agent picker + context chips.

## UI primitives (`/components/ui`)
- `Button`, `Input`, `Textarea`, `Select`, `Switch`, `Checkbox`, `Badge`, `Tabs`, `Dialog`, `DropdownMenu`, `Tooltip`, `Skeleton`, `Card`, `Separator`, `ScrollArea`, `Avatar`, `Progress`, `Toast`.
- Each is unstyled-Radix wrapped with Tailwind in the Command-OS dark palette.

## Dashboard components
- `KpiCard` — label, value, delta, sparkline.
- `KpiStrip` — row of KpiCards.
- `Panel` — titled section with optional CTA.
- `PriorityList` — task chips with priority colors.
- `BriefingCard` — markdown-rendered AI summary with refresh.
- `RevenueByBusinessChart` — stacked bar.
- `CashFlowChart` — area.
- `CalendarMini` — next N events.
- `AlertList` — risk + low inventory + overdue.
- `BusinessHealthGrid` — six tiles with score 0–100 and trend.
- `FollowUpList` — customers that need a touch.
- `ContentSchedulePreview` — next posts.
- `IdeaInboxPreview` — last N ideas with one-tap expand.
- `InboxPreview` — emails / WhatsApp ranked by importance.

## Tasks
- `TaskRow`, `TaskList`, `TaskBoard` (Kanban), `TaskDrawer` (detail), `TaskQuickAdd`.

## Finance
- `ExpenseRow`, `ExpenseTable`, `ExpenseForm`, `CreditCardCard`, `BillRow`, `ProfitLossChart`, `BusinessPLTable`, `ForecastChart`.

## CRM
- `ContactRow`, `CustomerCard`, `LeadCard`, `DealCard`, `PipelineBoard`, `FollowUpRow`.

## Calendar
- `CalendarGrid`, `EventDrawer`, `EventQuickAdd`.

## Ideas
- `IdeaCard`, `IdeaQuickCapture`, `IdeaExpansionDrawer`.

## Inventory
- `InventoryRow`, `InventoryTable`, `LowStockBadge`.

## AI
- `AgentSwitcher`, `MessageBubble`, `ContextChips`, `InsightCard`.

## Business-specific
- **Lexus**: `DealPipeline`, `TestDriveList`, `TradeInRow`, `CommissionTable`.
- **Fitness**: `FitnessClientRow`, `CheckInForm`, `ProgramEditor`, `RetentionChart`.
- **Content**: `ContentBoard`, `ContentRow`, `PlatformBadge`, `MetricsChart`.
- **Phone Repair**: `TicketRow`, `TicketBoard`, `IMEILookup`, `PartsUsedList`.
- **Supplements**: `ProductRow`, `OrderRow`, `ROASChart`, `SubscriptionList`.
- **Personal**: `HabitGrid`, `NetWorthCard`, `DebtPayoffChart`, `GoalRow`.
