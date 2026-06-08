/**
 * Generate vector embeddings for semantic search (#8). Opt-in: requires
 * pgvector on the database and an embeddings key (VOYAGE_API_KEY by default).
 * Self-creates the extension, columns and index, then embeds rows that don't
 * have a vector yet, in batches.
 *
 *   npx tsx scripts/embed.ts            # embed opportunities + awards
 *   npx tsx scripts/embed.ts --awards   # awards only
 *   npx tsx scripts/embed.ts --opps     # opportunities only
 */

import { PrismaClient } from "@prisma/client";
import { embed, toVectorLiteral, EMBEDDING_DIM, embeddingsConfigured } from "../src/lib/embeddings";

const prisma = new PrismaClient();
const BATCH = 100;

async function setup() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Opportunity" ADD COLUMN IF NOT EXISTS embedding vector(${EMBEDDING_DIM});`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "AwardedContract" ADD COLUMN IF NOT EXISTS embedding vector(${EMBEDDING_DIM});`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS opp_embedding_idx ON "Opportunity" USING hnsw (embedding vector_cosine_ops);`).catch(() => {});
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS award_embedding_idx ON "AwardedContract" USING hnsw (embedding vector_cosine_ops);`).catch(() => {});
}

async function embedTable(table: "Opportunity" | "AwardedContract") {
  let done = 0;
  for (;;) {
    const rows = await prisma.$queryRawUnsafe<{ id: string; title: string; buyer: string | null; supplier: string | null }[]>(
      `SELECT id, title, buyer, ${table === "AwardedContract" ? "supplier" : "NULL as supplier"}
       FROM "${table}" WHERE embedding IS NULL AND title IS NOT NULL LIMIT ${BATCH}`,
    );
    if (rows.length === 0) break;
    const texts = rows.map((r) => [r.title, r.buyer, r.supplier].filter(Boolean).join(" — "));
    const vectors = await embed(texts, "document");
    for (let i = 0; i < rows.length; i++) {
      await prisma.$executeRawUnsafe(
        `UPDATE "${table}" SET embedding = $1::vector WHERE id = $2`,
        toVectorLiteral(vectors[i]),
        rows[i].id,
      );
    }
    done += rows.length;
    console.log(`  ${table}: embedded ${done}...`);
  }
  console.log(`${table}: done (${done} newly embedded).`);
}

async function main() {
  if (!embeddingsConfigured()) {
    console.error("No embeddings key set. Set VOYAGE_API_KEY (or EMBEDDINGS_PROVIDER=openai + OPENAI_API_KEY).");
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const doAwards = args.includes("--awards") || !args.includes("--opps");
  const doOpps = args.includes("--opps") || !args.includes("--awards");

  console.log("Setting up pgvector (extension, columns, index)...");
  await setup();
  if (doOpps) await embedTable("Opportunity");
  if (doAwards) await embedTable("AwardedContract");
  await prisma.$disconnect();
  console.log("Embedding complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
