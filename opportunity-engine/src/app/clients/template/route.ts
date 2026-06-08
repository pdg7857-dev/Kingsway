// Downloadable CSV template for the client bulk-import.

const HEADER = "name,contactEmail,planTier,jurisdictions,trades,clearances,valueMin,valueMax,codes,keywords,notes";
const EXAMPLE = "Acme Facility Services,ops@acme.ca,Growth,ON;QC,janitorial;facilities,WSIB;$2M liability,50000,2000000,GSIN:S206;UNSPSC:76111501,janitorial;custodial services,Sample row - delete before importing";

export function GET() {
  const csv = `${HEADER}\n${EXAMPLE}\n`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clients-template.csv"',
    },
  });
}
