import {
  PrismaClient,
  BusinessSlug,
} from "@prisma/client";
import { seedOpportunityIntelligence } from "./oi/seed";

const BUSINESS_SEEDS: Array<{
  slug: BusinessSlug;
  name: string;
  description: string;
  color: string;
  emoji: string;
}> = [
  { slug: "lexus", name: "Lexus Sales", description: "Lexus car sales — leads, test drives, commissions", color: "biz-lexus", emoji: "🚗" },
  { slug: "fitness", name: "Fitness Coaching", description: "Online + in-person coaching, athletes", color: "biz-fitness", emoji: "🏋️" },
  { slug: "content", name: "Social Content", description: "IG / TikTok / YouTube / FB content engine", color: "biz-content", emoji: "🎬" },
  { slug: "phone_repair", name: "Phone Repair & Resale", description: "Repair tickets, buybacks, resale", color: "biz-phone", emoji: "📱" },
  { slug: "supplements", name: "Supplements", description: "Inventory, manufacturing, subscriptions", color: "biz-supplements", emoji: "💊" },
  { slug: "eprocurement", name: "eProcurement Consulting", description: "Gov-contract sourcing + summaries, $250/mo retainers", color: "biz-eprocurement", emoji: "📑" },
  { slug: "personal", name: "Personal", description: "Personal life, finance, habits, goals", color: "biz-personal", emoji: "👤" },
];

const days = (n: number) => new Date(Date.now() + n * 86400000);
const hours = (n: number) => new Date(Date.now() + n * 3600000);

/**
 * Seed the database. Idempotent on the user + business level
 * (uses upsert on the primary user and each business). Other rows
 * are only inserted when the user is freshly created so re-running
 * won't pile on duplicates.
 */
export async function runSeed(prisma: PrismaClient, email = "pdg7857@gmail.com") {
  const existing = await prisma.user.findUnique({ where: { email } });
  const isFresh = !existing;
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Operator", timezone: "America/Los_Angeles" },
  });

  const businessMap: Record<BusinessSlug, string> = {} as any;
  for (const b of BUSINESS_SEEDS) {
    const biz = await prisma.business.upsert({
      where: { userId_slug: { userId: user.id, slug: b.slug } },
      update: { name: b.name, description: b.description, color: b.color, emoji: b.emoji },
      create: { ...b, userId: user.id },
    });
    businessMap[b.slug] = biz.id;
  }

  if (!isFresh) {
    // Backfill the Opportunity Intelligence book on existing installs too
    // (it self-skips when prospects already exist).
    await seedOpportunityIntelligence(prisma, user.id, businessMap.eprocurement).catch(() => {});
    return { user, businesses: Object.keys(businessMap).length, sampleData: false };
  }

  // Credit card
  const card = await prisma.creditCard.create({
    data: {
      userId: user.id,
      name: "Amex Platinum",
      last4: "1009",
      network: "amex",
      limitCents: 2_500_000,
      balanceCents: 432_120,
      apr: 0,
      statementDay: 4,
      paymentDueDay: 28,
      nextStatementAt: days(7),
      nextDueAt: days(12),
      minPaymentCents: 30_000,
      color: "#1f3e7c",
    },
  });

  await prisma.financialAccount.createMany({
    data: [
      { userId: user.id, name: "Chase Operating", kind: "checking", institution: "Chase", balanceCents: 4_312_800 },
      { userId: user.id, name: "High Yield Savings", kind: "savings", institution: "Marcus", balanceCents: 12_500_000 },
      { userId: user.id, name: "Brokerage", kind: "brokerage", institution: "Fidelity", balanceCents: 38_200_000 },
      { userId: user.id, name: "Crypto", kind: "crypto", institution: "Coinbase", balanceCents: 5_600_000 },
    ],
  });

  const taskSeed: any[] = [
    { title: "Call back lead — Jasmine R. (RX 350)", businessId: businessMap.lexus, priority: "URGENT", dueAt: hours(2), status: "TODO" },
    { title: "Send check-in template to Coach team", businessId: businessMap.fitness, priority: "HIGH", dueAt: hours(5), status: "TODO" },
    { title: "Film 3 hooks for Friday batch", businessId: businessMap.content, priority: "HIGH", dueAt: days(1), status: "TODO" },
    { title: "Diagnose iPhone 13 logic board (Ticket #1043)", businessId: businessMap.phone_repair, priority: "MEDIUM", dueAt: days(1), status: "IN_PROGRESS" },
    { title: "Approve next supplement label revision", businessId: businessMap.supplements, priority: "MEDIUM", dueAt: days(2), status: "WAITING" },
    { title: "Pay Amex statement", businessId: businessMap.personal, priority: "HIGH", dueAt: days(5), status: "TODO" },
    { title: "Quarterly tax estimate — Q2", businessId: businessMap.personal, priority: "HIGH", dueAt: days(14), status: "TODO" },
    { title: "Reach out to Toyota trade-in customer", businessId: businessMap.lexus, priority: "MEDIUM", dueAt: days(-1), status: "TODO" },
    { title: "Edit Tuesday reel batch", businessId: businessMap.content, priority: "MEDIUM", dueAt: days(-2), status: "TODO" },
    { title: "Follow up — Marcus (athlete)", businessId: businessMap.fitness, priority: "LOW", dueAt: hours(8), status: "TODO" },
    { title: "Reorder whey isolate (40 units)", businessId: businessMap.supplements, priority: "HIGH", dueAt: days(3), status: "TODO" },
    { title: "Reply to mail-in customer (S22 Ultra)", businessId: businessMap.phone_repair, priority: "URGENT", dueAt: hours(1), status: "WAITING" },
  ];
  for (const t of taskSeed) await prisma.task.create({ data: { userId: user.id, ...t } });

  await prisma.idea.createMany({
    data: [
      { userId: user.id, businessId: businessMap.content, title: "Lexus vs. BMW: silent killers", priority: "HIGH", status: "INBOX", body: "Reel comparing reliability data and TCO." },
      { userId: user.id, businessId: businessMap.fitness, title: "Athlete progress wall on site", priority: "MEDIUM", status: "EXPLORING" },
      { userId: user.id, businessId: businessMap.supplements, title: "Recovery stack bundle for athletes", priority: "HIGH", status: "INBOX" },
      { userId: user.id, businessId: businessMap.phone_repair, title: "iPhone 11/12 buyback campaign", priority: "MEDIUM", status: "INBOX" },
      { userId: user.id, businessId: businessMap.personal, title: "Family travel itinerary template", priority: "LOW", status: "INBOX" },
    ],
  });

  const customers = await prisma.$transaction(
    [
      { name: "Jasmine Reyes", phone: "+13105550143", businessId: businessMap.lexus },
      { name: "Marcus Lee", phone: "+13105550199", businessId: businessMap.fitness },
      { name: "Daniel K.", phone: "+13105550112", businessId: businessMap.phone_repair },
      { name: "Brenda Walsh", phone: "+13105550127", businessId: businessMap.supplements },
    ].map((c) =>
      prisma.customer.create({
        data: { userId: user.id, ...c, status: "active", totalSpentCents: 250_000 },
      })
    )
  );

  await prisma.lead.createMany({
    data: [
      { userId: user.id, businessId: businessMap.lexus, name: "Tony Park", source: "WEBSITE", score: 78, status: "new" },
      { userId: user.id, businessId: businessMap.lexus, name: "Lana Cho", source: "REFERRAL", score: 86, status: "contacted" },
      { userId: user.id, businessId: businessMap.fitness, name: "Sebastian R.", source: "SOCIAL", score: 64, status: "new" },
    ],
  });

  await prisma.deal.createMany({
    data: [
      { userId: user.id, businessId: businessMap.lexus, customerId: customers[0].id, title: "RX 350 — Jasmine", stage: "TEST_DRIVE", valueCents: 5_200_000, costCents: 4_700_000, probability: 70, nextAction: "Schedule delivery walkthrough", nextActionAt: days(1), vehicle: "2024 RX 350 Premium" },
      { userId: user.id, businessId: businessMap.lexus, title: "IS 350 F Sport — referral", stage: "NEGOTIATION", valueCents: 4_800_000, costCents: 4_500_000, probability: 60, nextAction: "Run finance with 700 FICO" },
      { userId: user.id, businessId: businessMap.lexus, title: "GX 550 — fleet inquiry", stage: "QUALIFIED", valueCents: 8_900_000, costCents: 8_300_000, probability: 35 },
    ],
  });

  await prisma.calendarEvent.createMany({
    data: [
      { userId: user.id, businessId: businessMap.lexus, title: "Test drive — Jasmine", startAt: hours(3), endAt: hours(4), location: "Showroom" },
      { userId: user.id, businessId: businessMap.fitness, title: "Coaches huddle", startAt: days(1), endAt: days(1), allDay: false },
      { userId: user.id, businessId: businessMap.content, title: "Filming batch", startAt: days(2), endAt: days(2) },
      { userId: user.id, businessId: businessMap.personal, title: "Dentist", startAt: days(4), endAt: days(4) },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { userId: user.id, businessId: businessMap.content, vendor: "Adobe", amountCents: 5400, date: days(-2), paymentMethod: "CREDIT_CARD", creditCardId: card.id, category: "Software", recurrence: "MONTHLY" },
      { userId: user.id, businessId: businessMap.supplements, vendor: "BulkSupplements", amountCents: 248_000, date: days(-10), paymentMethod: "CREDIT_CARD", creditCardId: card.id, category: "COGS" },
      { userId: user.id, businessId: businessMap.phone_repair, vendor: "iFixit", amountCents: 32_400, date: days(-5), paymentMethod: "CREDIT_CARD", creditCardId: card.id, category: "Parts" },
      { userId: user.id, businessId: businessMap.fitness, vendor: "Trainerize", amountCents: 9900, date: days(-1), paymentMethod: "CREDIT_CARD", creditCardId: card.id, category: "Software", recurrence: "MONTHLY" },
      { userId: user.id, businessId: businessMap.lexus, vendor: "Carfax", amountCents: 4900, date: days(-12), paymentMethod: "CREDIT_CARD", creditCardId: card.id, category: "Tools" },
      { userId: user.id, businessId: businessMap.personal, vendor: "Rent — Office", amountCents: 240_000, date: days(7), dueAt: days(7), status: "PENDING", paymentMethod: "ACH", recurrence: "MONTHLY", isUpcoming: true },
      { userId: user.id, businessId: businessMap.supplements, vendor: "Shopify", amountCents: 7900, date: days(4), dueAt: days(4), status: "PENDING", paymentMethod: "CREDIT_CARD", creditCardId: card.id, recurrence: "MONTHLY", isUpcoming: true },
    ],
  });

  await prisma.revenue.createMany({
    data: [
      { userId: user.id, businessId: businessMap.lexus, source: "RX 350 sale", amountCents: 5_200_000, date: days(-9) },
      { userId: user.id, businessId: businessMap.fitness, source: "Monthly retainer (5 clients)", amountCents: 250_000, date: days(-3) },
      { userId: user.id, businessId: businessMap.content, source: "Sponsorship — Brand X", amountCents: 380_000, date: days(-7) },
      { userId: user.id, businessId: businessMap.phone_repair, source: "Repair tickets x12", amountCents: 142_000, date: days(-4) },
      { userId: user.id, businessId: businessMap.supplements, source: "Shopify orders", amountCents: 612_300, date: days(-5) },
    ],
  });

  await prisma.bill.createMany({
    data: [
      { userId: user.id, vendor: "Amex Platinum payment", amountCents: 432_120, dueAt: days(12), recurrence: "MONTHLY", creditCardId: card.id, autopay: false },
      { userId: user.id, businessId: businessMap.personal, vendor: "Internet", amountCents: 9900, dueAt: days(6), recurrence: "MONTHLY", autopay: true },
      { userId: user.id, businessId: businessMap.personal, vendor: "Phone", amountCents: 8500, dueAt: days(9), recurrence: "MONTHLY", autopay: true },
      { userId: user.id, businessId: businessMap.supplements, vendor: "3PL warehouse", amountCents: 120_000, dueAt: days(3), recurrence: "MONTHLY" },
    ],
  });

  await prisma.inventoryItem.createMany({
    data: [
      { userId: user.id, businessId: businessMap.phone_repair, sku: "IP13-LCD", name: "iPhone 13 LCD assembly", quantity: 4, reorderAt: 5, costCents: 5200, priceCents: 14900 },
      { userId: user.id, businessId: businessMap.phone_repair, sku: "S22-BAT", name: "Galaxy S22 battery", quantity: 2, reorderAt: 5, costCents: 1800, priceCents: 7900 },
      { userId: user.id, businessId: businessMap.supplements, sku: "WHEY-CHOC", name: "Whey Isolate — Chocolate (5lb)", quantity: 18, reorderAt: 25, costCents: 2400, priceCents: 6900 },
      { userId: user.id, businessId: businessMap.supplements, sku: "CREATINE", name: "Creatine Monohydrate (500g)", quantity: 50, reorderAt: 30, costCents: 700, priceCents: 2900 },
    ],
  });

  await prisma.repairTicket.createMany({
    data: [
      { userId: user.id, businessId: businessMap.phone_repair, customerId: customers[2].id, device: "iPhone 13", imei: "356789012345678", issue: "No power after water damage", status: "IN_REPAIR", channel: "MAIL_IN", quotedCents: 14900, costCents: 5400 },
      { userId: user.id, businessId: businessMap.phone_repair, device: "Galaxy S22 Ultra", imei: "356123412341234", issue: "Cracked screen + battery", status: "AWAITING_PARTS", channel: "PICKUP", quotedCents: 22900, costCents: 9800 },
      { userId: user.id, businessId: businessMap.phone_repair, device: "Pixel 7", issue: "Charging port", status: "READY", channel: "MAIL_IN", quotedCents: 8900, finalCents: 8900, costCents: 1900 },
    ],
  });

  const fitClients = await Promise.all(
    ["Marcus L.", "Sarah V.", "DeShawn P.", "Anika R.", "Tommy G."].map((n, i) =>
      prisma.fitnessClient.create({
        data: {
          userId: user.id,
          businessId: businessMap.fitness,
          name: n,
          goal: i % 2 === 0 ? "Strength + recomp" : "Hypertrophy",
          programName: "Foundations 12W",
          status: "ACTIVE",
          mrrCents: 25_000 + i * 5_000,
          startedAt: days(-30 * (i + 1)),
          renewalAt: days(30 - i * 4),
          lastCheckInAt: days(-(i + 1)),
        },
      })
    )
  );
  for (const c of fitClients) {
    await prisma.fitnessCheckIn.create({
      data: { clientId: c.id, weightKg: 84 + Math.random() * 6, bodyFatPct: 12 + Math.random() * 4, energy: 7, adherence: 8 },
    });
  }

  await prisma.contentItem.createMany({
    data: [
      { userId: user.id, businessId: businessMap.content, platform: "INSTAGRAM", status: "SCHEDULED", hook: "Why the RX 350 is the smartest buy under 60k", scheduledAt: days(1) },
      { userId: user.id, businessId: businessMap.content, platform: "TIKTOK", status: "EDITING", hook: "Stop benching like this" },
      { userId: user.id, businessId: businessMap.content, platform: "YOUTUBE", status: "SCRIPTED", hook: "I bought 12 broken iPhones — here's the margin" },
      { userId: user.id, businessId: businessMap.content, platform: "FACEBOOK", status: "POSTED", hook: "Athlete transformation: 90 days", postedAt: days(-3) },
    ],
  });

  await prisma.supplementProduct.createMany({
    data: [
      { userId: user.id, businessId: businessMap.supplements, name: "Whey Isolate — Chocolate", sku: "WHEY-CHOC", costCents: 2400, priceCents: 6900, inventory: 18, reorderAt: 25, subscriptionEnabled: true },
      { userId: user.id, businessId: businessMap.supplements, name: "Creatine Mono 500g", sku: "CREATINE", costCents: 700, priceCents: 2900, inventory: 50, reorderAt: 30, subscriptionEnabled: true },
      { userId: user.id, businessId: businessMap.supplements, name: "Recovery Stack", sku: "RECOV-STK", costCents: 4200, priceCents: 12900, inventory: 32, reorderAt: 20, subscriptionEnabled: false },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { userId: user.id, kind: "TASK_OVERDUE", title: "2 overdue tasks", body: "Reach out to Toyota trade-in customer · Edit Tuesday reel batch", channels: ["IN_APP", "SLACK"] },
      { userId: user.id, kind: "BILL_DUE", title: "3PL warehouse bill due in 3 days", body: "$1,200.00", channels: ["IN_APP", "SMS"] },
      { userId: user.id, kind: "CARD_DUE", title: "Amex statement closes in 7 days", body: "Current balance $4,321.20", channels: ["IN_APP"] },
      { userId: user.id, kind: "INVENTORY_LOW", title: "iPhone 13 LCD low stock", body: "4 left · reorder at 5", channels: ["IN_APP", "SLACK"] },
      { userId: user.id, kind: "EMAIL_IMPORTANT", title: "Important email from Lana Cho", body: "Re: IS 350 F Sport financing", channels: ["IN_APP"] },
    ],
  });

  await prisma.habit.createMany({
    data: [
      { userId: user.id, name: "Train", cadence: "daily", streak: 12, longest: 41 },
      { userId: user.id, name: "Read 20 pages", cadence: "daily", streak: 6, longest: 22 },
      { userId: user.id, name: "Plan tomorrow night", cadence: "daily", streak: 3, longest: 30 },
    ],
  });

  await prisma.goal.createMany({
    data: [
      { userId: user.id, title: "Hit 50k MRR across coaching + supplements", area: "business", progress: 38 },
      { userId: user.id, title: "Net worth +25% YoY", area: "personal", progress: 17 },
      { userId: user.id, title: "Publish 4x/week on all platforms", area: "content", progress: 62 },
      { userId: user.id, title: "Land 20 eProcurement retainers (5k MRR)", area: "business", progress: 15 },
    ],
  });

  // eProcurement clients + contracts
  const procClients = await Promise.all([
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Karen Diaz", company: "Apex Electrical LLC", industry: "Electrical contracting", status: "ACTIVE", touchCount: 4, touchesToSign: 4, monthlyFeeCents: 25000, signedAt: days(-40), lastTouchAt: days(-3), renewalAt: days(20), businessInfo: "Licensed electrical contractor, 12 employees, SAM registered, no set-aside certs yet.", notes: "Wants small-dollar facilities contracts to start." },
    }),
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Marcus Webb", company: "Webb HVAC Services", industry: "Electrical contracting", status: "ACTIVE", touchCount: 6, touchesToSign: 6, monthlyFeeCents: 25000, signedAt: days(-15), lastTouchAt: days(-2), renewalAt: days(45), businessInfo: "HVAC + electrical, WOSB-eligible (owner's wife), strong bonding capacity.", notes: "High intent, responsive. Good case study candidate." },
    }),
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Priya Nair", company: "Voltline Co", industry: "Electrical contracting", status: "PROPOSAL", touchCount: 3, monthlyFeeCents: 25000, lastTouchAt: days(-1), notes: "Sent proposal, waiting on partner sign-off. Follow up in 2 days." },
    }),
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Tom Bauer", company: "Bauer Electric", industry: "Electrical contracting", status: "QUALIFIED", touchCount: 2, monthlyFeeCents: 25000, lastTouchAt: days(-4), notes: "Qualified, needs a sample contract summary to see value." },
    }),
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Lena Ortiz", company: "Ortiz Power Systems", industry: "Electrical contracting", status: "LEAD", touchCount: 1, monthlyFeeCents: 25000, lastTouchAt: days(-6), notes: "Cold outreach replied. Book a discovery call." },
    }),
    prisma.procurementClient.create({
      data: { userId: user.id, businessId: businessMap.eprocurement, name: "Greg Pope", company: "Pope Contracting", industry: "Electrical contracting", status: "LOST", touchCount: 5, monthlyFeeCents: 25000, lostReason: "Went with an in-house bid writer.", lastTouchAt: days(-25) },
    }),
  ]);

  await prisma.govContract.createMany({
    data: [
      { userId: user.id, businessId: businessMap.eprocurement, clientId: procClients[0].id, title: "Electrical maintenance — VA Medical Center", agency: "Dept. of Veterans Affairs", industry: "Electrical contracting", solicitationNumber: "36C24625R0042", valueCents: 18_500_000, responseDueAt: days(11), status: "SENT", summary: "**Summary**\n- Recurring electrical preventive maintenance at a VA hospital campus.\n- 12-month base + 4 option years.\n- Requires licensed electricians + after-hours coverage.\n- Estimated $185k/yr." },
      { userId: user.id, businessId: businessMap.eprocurement, clientId: procClients[1].id, title: "HVAC/Electrical upgrade — Army Reserve Center", agency: "U.S. Army Corps of Engineers", industry: "Electrical contracting", solicitationNumber: "W912DR25B0007", valueCents: 42_000_000, responseDueAt: days(19), status: "SUMMARIZED" },
      { userId: user.id, businessId: businessMap.eprocurement, title: "Switchgear replacement — Federal Courthouse", agency: "GSA", industry: "Electrical contracting", solicitationNumber: "47PE0125R0011", valueCents: 76_000_000, responseDueAt: days(28), status: "FOUND" },
      { userId: user.id, businessId: businessMap.eprocurement, title: "Emergency generator service contract", agency: "Dept. of Homeland Security", industry: "Electrical contracting", valueCents: 9_900_000, responseDueAt: days(6), status: "FOUND" },
    ],
  });

  await prisma.task.createMany({
    data: [
      { userId: user.id, businessId: businessMap.eprocurement, title: "Follow up with Voltline on proposal", priority: "HIGH", dueAt: days(2), status: "TODO" },
      { userId: user.id, businessId: businessMap.eprocurement, title: "Send sample contract summary to Bauer Electric", priority: "HIGH", dueAt: hours(20), status: "TODO" },
      { userId: user.id, businessId: businessMap.eprocurement, title: "Summarize switchgear solicitation (GSA)", priority: "MEDIUM", dueAt: days(3), status: "TODO" },
      { userId: user.id, businessId: businessMap.eprocurement, title: "Book discovery call — Ortiz Power Systems", priority: "MEDIUM", dueAt: days(1), status: "TODO" },
    ],
  });

  await prisma.revenue.createMany({
    data: [
      { userId: user.id, businessId: businessMap.eprocurement, source: "Retainers — 2 active clients", amountCents: 50000, date: days(-5) },
    ],
  });

  // Mileage / travel logs (km + transport modes)
  await prisma.mileageLog.createMany({
    data: [
      { userId: user.id, businessId: businessMap.lexus, fromLocation: "Dealership", toLocation: "Customer home (delivery)", reason: "RX 350 delivery", distanceKm: 22.8, miles: 14.2, transportMode: "CAR", purpose: "BUSINESS", date: days(-2) },
      { userId: user.id, businessId: businessMap.phone_repair, fromLocation: "Shop", toLocation: "Post office", reason: "Mail-in shipments", distanceKm: 21.9, miles: 13.6, transportMode: "CAR", purpose: "BUSINESS", roundTrip: true, date: days(-1) },
      { userId: user.id, businessId: businessMap.eprocurement, fromLocation: "Office", toLocation: "Client HQ (downtown)", reason: "Client onboarding meeting", distanceKm: 12.0, miles: 7.5, transportMode: "UBER", costCents: 2400, purpose: "BUSINESS", date: days(-4) },
      { userId: user.id, businessId: businessMap.content, fromLocation: "Home city", toLocation: "Creator conference", reason: "Networking / filming", distanceKm: 1850, miles: 1149, transportMode: "PLANE", costCents: 32000, purpose: "BUSINESS", date: days(-12) },
      { userId: user.id, fromLocation: "Home", toLocation: "Gym", reason: "Training", distanceKm: 5.0, miles: 3.1, transportMode: "CAR", purpose: "PERSONAL", date: days(-1) },
    ],
  });

  await prisma.aIInsight.create({
    data: {
      userId: user.id,
      agent: "MASTER",
      kind: "DAILY_BRIEFING",
      title: "Daily CEO Briefing",
      summary: [
        "**Top of the day**",
        "- Test drive with Jasmine (RX 350) at 11am — bring trade-in offer.",
        "- 2 overdue tasks need 15 minutes total — knock out before noon.",
        "- Cash position healthy: $431k across accounts. Amex statement closes in 7 days at $4,321.",
        "",
        "**Risks**",
        "- iPhone 13 LCD stock below reorder threshold — order today.",
        "- One coaching client check-in is 3 days late (Marcus).",
        "",
        "**Wins to chase**",
        "- 2 hot Lexus leads ($53k pipeline) — Lana Cho needs a finance run.",
        "- Recovery Stack idea looks high-leverage — score it.",
      ].join("\n"),
      payload: { topPriorities: 5 },
    },
  });

  await prisma.automation.createMany({
    data: [
      { userId: user.id, name: "Daily CEO Briefing", trigger: "CRON", config: { cron: "30 6 * * *" }, actions: [{ kind: "ai.run", agent: "MASTER" }, { kind: "notification.send", channels: ["SLACK", "SMS"] }], enabled: true },
      { userId: user.id, name: "Weekly Business Review", trigger: "CRON", config: { cron: "0 17 * * 0" }, actions: [{ kind: "ai.run", agent: "MASTER", mode: "weekly" }], enabled: true },
      { userId: user.id, name: "Auto-task from important email", trigger: "EMAIL_RECEIVED", config: { minImportance: 4 }, actions: [{ kind: "task.create" }, { kind: "notification.send" }], enabled: false },
      { userId: user.id, name: "Bill due in 3 days", trigger: "BILL_DUE_SOON", config: { days: 3 }, actions: [{ kind: "notification.send", channels: ["SMS", "SLACK"] }], enabled: true },
      { userId: user.id, name: "Low inventory alert", trigger: "INVENTORY_LOW", config: {}, actions: [{ kind: "task.create" }, { kind: "notification.send" }], enabled: true },
    ],
  });

  await seedOpportunityIntelligence(prisma, user.id, businessMap.eprocurement).catch(() => {});

  return { user, businesses: Object.keys(businessMap).length, sampleData: true };
}
