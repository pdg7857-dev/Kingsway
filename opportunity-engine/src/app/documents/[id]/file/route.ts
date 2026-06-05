import { prisma } from "@/lib/db";
import { readStoredFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

function contentType(path: string): string {
  if (path.endsWith(".pdf")) return "application/pdf";
  if (path.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const doc = await prisma.document.findFirst({
    where: { opportunityId: params.id, storagePath: { not: null } },
    orderBy: { createdAt: "asc" },
  });
  if (!doc?.storagePath) return new Response("Not found", { status: 404 });

  try {
    const buf = await readStoredFile(doc.storagePath);
    await prisma.auditLog.create({ data: { action: "document_download", detail: doc.id } });
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentType(doc.storagePath),
        "Content-Disposition": `inline; filename="${doc.title.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
      },
    });
  } catch {
    return new Response("File not available on this host (ephemeral storage). Re-upload or use durable storage.", { status: 410 });
  }
}
