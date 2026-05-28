import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Hit = { type: string; label: string; sub?: string; href: string };

export async function GET(req: NextRequest) {
  const user = await requireCurrentUser();
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ hits: [] });

  const like = { contains: q, mode: "insensitive" as const };
  const uid = user.id;

  const [tasks, customers, deals, ideas, expenses, contracts, procClients, content, inventory, contacts] = await Promise.all([
    prisma.task.findMany({ where: { userId: uid, OR: [{ title: like }, { description: like }] }, take: 6, include: { business: true } }),
    prisma.customer.findMany({ where: { userId: uid, OR: [{ name: like }, { email: like }, { phone: like }, { notes: like }] }, take: 6 }),
    prisma.deal.findMany({ where: { userId: uid, OR: [{ title: like }, { notes: like }, { vehicle: like }] }, take: 6 }),
    prisma.idea.findMany({ where: { userId: uid, OR: [{ title: like }, { body: like }] }, take: 6 }),
    prisma.expense.findMany({ where: { userId: uid, OR: [{ vendor: like }, { description: like }, { category: like }] }, take: 6 }),
    prisma.govContract.findMany({ where: { userId: uid, OR: [{ title: like }, { agency: like }, { solicitationNumber: like }] }, take: 6 }),
    prisma.procurementClient.findMany({ where: { userId: uid, OR: [{ name: like }, { company: like }, { industry: like }, { notes: like }] }, take: 6 }),
    prisma.contentItem.findMany({ where: { userId: uid, OR: [{ hook: like }, { caption: like }] }, take: 6 }),
    prisma.inventoryItem.findMany({ where: { userId: uid, OR: [{ name: like }, { sku: like }] }, take: 6 }),
    prisma.contact.findMany({ where: { userId: uid, OR: [{ firstName: like }, { lastName: like }, { email: like }, { company: like }] }, take: 6 }),
  ]);

  const hits: Hit[] = [];
  tasks.forEach((t) => hits.push({ type: "Task", label: t.title, sub: t.status, href: "/tasks" }));
  customers.forEach((c) => hits.push({ type: "Customer", label: c.name, sub: c.phone ?? c.email ?? undefined, href: "/customers" }));
  deals.forEach((d) => hits.push({ type: "Deal", label: d.title, sub: d.stage, href: "/pipeline" }));
  ideas.forEach((i) => hits.push({ type: "Idea", label: i.title, sub: i.status, href: "/ideas" }));
  expenses.forEach((e) => hits.push({ type: "Expense", label: e.vendor, sub: `$${(e.amountCents / 100).toFixed(0)}`, href: "/finance" }));
  contracts.forEach((c) => hits.push({ type: "Contract", label: c.title, sub: c.agency ?? undefined, href: "/business/eprocurement" }));
  procClients.forEach((c) => hits.push({ type: "eProc client", label: c.company ?? c.name, sub: c.industry ?? undefined, href: "/business/eprocurement" }));
  content.forEach((c) => hits.push({ type: "Content", label: c.hook ?? "(untitled)", sub: c.platform, href: "/business/content" }));
  inventory.forEach((i) => hits.push({ type: "Inventory", label: i.name, sub: i.sku ?? undefined, href: "/inventory" }));
  contacts.forEach((c) => hits.push({ type: "Contact", label: [c.firstName, c.lastName].filter(Boolean).join(" "), sub: c.company ?? c.email ?? undefined, href: "/customers" }));

  return NextResponse.json({ hits });
}
