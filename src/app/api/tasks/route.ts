import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const taskCreate = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  businessId: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "WAITING", "DONE", "CANCELLED"]).optional(),
  dueAt: z.coerce.date().optional().nullable(),
  remindAt: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  const user = await requireCurrentUser();
  const url = new URL(req.url);
  const view = url.searchParams.get("view") ?? "all";
  const businessSlug = url.searchParams.get("business");

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday.getTime() + 86400000);
  const endOfWeek = new Date(now.getTime() + 7 * 86400000);

  const where: any = { userId: user.id };
  if (view === "today") where.dueAt = { gte: startOfToday, lt: endOfToday };
  else if (view === "week") where.dueAt = { gte: now, lt: endOfWeek };
  else if (view === "overdue") {
    where.dueAt = { lt: now };
    where.status = { in: ["TODO", "IN_PROGRESS"] };
  } else if (view === "priority") where.priority = { in: ["HIGH", "URGENT"] };
  else if (view === "waiting") where.status = "WAITING";

  if (businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: businessSlug as any } } });
    if (biz) where.businessId = biz.id;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ priority: "asc" }, { dueAt: "asc" }],
    include: { business: true },
    take: 200,
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = taskCreate.parse(await req.json());
  const task = await prisma.task.create({ data: { ...body, userId: user.id } });
  return NextResponse.json({ task });
}
