import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { getMasterDashboardData } from "@/lib/data/master";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireCurrentUser();
  const data = await getMasterDashboardData(user.id);
  // BigInts serialize cleanly because everything is Int cents.
  return NextResponse.json(data);
}
