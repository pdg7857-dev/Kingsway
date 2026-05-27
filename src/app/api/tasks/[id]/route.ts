import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patch = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "WAITING", "DONE", "CANCELLED"]).optional(),
  dueAt: z.coerce.date().nullable().optional(),
  remindAt: z.coerce.date().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const body = patch.parse(await req.json());
  const data: any = { ...body };
  if (body.status === "DONE") data.completedAt = new Date();
  const task = await prisma.task.update({
    where: { id: params.id },
    data,
  });
  if (task.userId !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task || task.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
