// Regenerate src/lib/initSql.ts from prisma/init.sql.
// Run after any schema change:
//   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/init.sql
//   node scripts/gen-init-sql.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sql = fs.readFileSync(path.join(root, "prisma", "init.sql"), "utf8");
const out =
  "// AUTO-GENERATED from prisma/init.sql — do not edit by hand.\n" +
  "// Regenerate: node scripts/gen-init-sql.js\n" +
  "export const INIT_SQL = " + JSON.stringify(sql) + ";\n";
fs.writeFileSync(path.join(root, "src", "lib", "initSql.ts"), out);
console.log("wrote src/lib/initSql.ts");
