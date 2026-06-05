// Minimal RFC 4180 CSV parser: handles quoted fields, escaped quotes ("")
// and newlines inside quotes. Returns an array of string rows.

export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field); field = "";
    } else if (ch === "\n") {
      row.push(field); field = "";
      rows.push(row); row = [];
    } else if (ch === "\r") {
      // ignore; handled by \n
    } else field += ch;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Normalize a header cell for fuzzy alias matching. */
export function normHeader(h: string): string {
  return h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

/** Build a header lookup from the first row. */
export function headerIndex(header: string[]): Map<string, number> {
  const map = new Map<string, number>();
  header.forEach((h, i) => map.set(normHeader(h), i));
  return map;
}

/** First non-empty value among the given header aliases. */
export function pick(row: string[], idx: Map<string, number>, aliases: string[]): string {
  for (const a of aliases) {
    const i = idx.get(normHeader(a));
    if (i != null && row[i] != null && row[i].trim() !== "") return row[i].trim();
  }
  return "";
}
