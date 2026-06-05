// Province / state name -> abbreviation, used to reconcile free-text
// solicitation jurisdictions against a client's coverage list.

export const JURISDICTIONS: Record<string, string> = {
  // Canada
  alberta: "AB", "british columbia": "BC", manitoba: "MB", "new brunswick": "NB",
  "newfoundland and labrador": "NL", "nova scotia": "NS", ontario: "ON",
  "prince edward island": "PE", quebec: "QC", saskatchewan: "SK",
  "northwest territories": "NT", nunavut: "NU", yukon: "YT",
  // United States (common subset; extend as needed)
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD", massachusetts: "MA",
  michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT",
  nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX",
  utah: "UT", vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY",
};

const ALL_ABBRS = new Set(Object.values(JURISDICTIONS));

/** Pull province/state abbreviations out of a free-text jurisdiction string. */
export function abbrsFromText(text: string | null | undefined): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [name, abbr] of Object.entries(JURISDICTIONS)) {
    if (lower.includes(name)) found.add(abbr);
  }
  // Also catch bare abbreviations like "ON" or "NY".
  for (const token of text.toUpperCase().match(/\b[A-Z]{2}\b/g) ?? []) {
    if (ALL_ABBRS.has(token)) found.add(token);
  }
  return [...found];
}
