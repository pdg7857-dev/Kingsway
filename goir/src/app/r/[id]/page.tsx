import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GoirReportView } from "@/components/goir/report-view";
import type { GoirResult, GoirNarrative } from "@/lib/goir/types";

export const dynamic = "force-dynamic";

async function load(id: string) {
  try {
    return await prisma.goirReport.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const report = await load(params.id);
  if (!report) return { title: "Report not found" };
  return {
    title: `${report.companyName} — Government Opportunity Intelligence Report™`,
    description: `Government Opportunity Intelligence Index™ of ${report.index}/100 (${report.tier}).`,
  };
}

export default async function GoirReportPage({ params }: { params: { id: string } }) {
  const report = await load(params.id);
  if (!report) notFound();

  const result = report.result as unknown as GoirResult;
  if (result && !result.companyName) result.companyName = report.companyName;
  const narrative = (report.narrative as unknown as GoirNarrative) ?? null;

  return (
    <>
      <GoirReportView id={report.id} result={result} narrative={narrative} requested={report.consultationRequested} />
      <div className="mx-auto max-w-5xl px-4 pb-10 lg:px-6 text-center">
        <Link href="/" className="text-xs text-fg-subtle hover:text-accent">← Run another report</Link>
      </div>
    </>
  );
}
