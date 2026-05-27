import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seed";

const prisma = new PrismaClient();

runSeed(prisma)
  .then((r) => console.log("Seed complete:", r))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
