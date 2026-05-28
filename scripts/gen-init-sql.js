// Regenerate src/lib/initSql.ts and src/lib/migrateSql.ts from prisma/*.sql.
// Run after any schema change:
//   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/init.sql
//   node scripts/gen-init-sql.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function emit(sqlFile, tsFile, name) {
  const sql = fs.readFileSync(path.join(root, "prisma", sqlFile), "utf8");
  const out =
    `// AUTO-GENERATED from prisma/${sqlFile} — do not edit by hand.\n` +
    "// Regenerate: node scripts/gen-init-sql.js\n" +
    `export const ${name} = ` + JSON.stringify(sql) + ";\n";
  fs.writeFileSync(path.join(root, "src", "lib", tsFile), out);
  console.log("wrote src/lib/" + tsFile);
}

emit("init.sql", "initSql.ts", "INIT_SQL");
emit("migrate.sql", "migrateSql.ts", "MIGRATE_SQL");
