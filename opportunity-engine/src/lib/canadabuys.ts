// CanadaBuys open-data mappers. CanadaBuys publishes tender-notice and
// award-notice datasets with bilingual headers (name-nom). Header names drift,
// so we resolve each field through a list of known aliases and skip rows that
// lack the essentials. Confirm column names against the current export.

import { parseCsv, headerIndex, pick } from "./csv";
import { analysisSchema, type DocumentAnalysis } from "./analysis-schema";

export type TenderRow = {
  title: string;
  buyer: string;
  jurisdiction: string;
  solicitationNo: string;
  closingDate: string;
  gsin: string[];
  value: number | null;
  source: string;
};

export type AwardRow = {
  title: string;
  buyer: string;
  supplier: string;
  jurisdiction: string;
  value: number | null;
  awardDate: string;
  startDate: string;
  endDate: string;
  gsin: string[];
};

function num(s: string): number | null {
  if (!s) return null;
  const n = Number(s.replace(/[$,\s]/g, ""));
  return Number.isNaN(n) ? null : n;
}
function codes(s: string): string[] {
  return s ? s.split(/[;,|]/).map((x) => x.trim()).filter(Boolean) : [];
}

export function parseTenders(text: string): TenderRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const idx = headerIndex(rows[0]);
  const out: TenderRow[] = [];
  for (const r of rows.slice(1)) {
    const title = pick(r, idx, ["title-titre", "title", "tenderDescription-descriptionAppelOffres", "tenderDescription"]);
    if (!title) continue;
    out.push({
      title,
      buyer: pick(r, idx, ["procurementEntityName", "contactInfoOrganization", "organization", "endUserEntitiesName"]),
      jurisdiction: pick(r, idx, ["regionsOfDelivery-regionsDeLivraison", "regionsOfDelivery", "regionOfDelivery", "regionsOfOpportunity"]),
      solicitationNo: pick(r, idx, ["referenceNumber-numeroReference", "solicitationNumber-numeroSollicitation", "referenceNumber", "solicitationNumber"]),
      closingDate: pick(r, idx, ["tenderClosingDate-appelOffresDateCloture", "tenderClosingDate", "closingDate", "amendmentDate"]),
      gsin: codes(pick(r, idx, ["gsin-nibs", "gsin", "gsinDescription-nibsDescription"])),
      value: num(pick(r, idx, ["estimatedValue", "contractValue-valeurContrat"])),
      source: "CanadaBuys",
    });
  }
  return out;
}

export function parseAwards(text: string): AwardRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const idx = headerIndex(rows[0]);
  const out: AwardRow[] = [];
  for (const r of rows.slice(1)) {
    const title = pick(r, idx, ["title-titre", "title", "tenderDescription-descriptionAppelOffres"]);
    const buyer = pick(r, idx, ["procurementEntityName", "organization", "contactInfoOrganization"]);
    if (!title && !buyer) continue;
    out.push({
      title: title || "Award notice",
      buyer: buyer || "Unknown",
      supplier: pick(r, idx, ["contractorName-nomEntrepreneur", "supplierName", "vendorName", "contractorName"]),
      jurisdiction: pick(r, idx, ["regionsOfDelivery-regionsDeLivraison", "regionsOfDelivery", "regionOfDelivery"]),
      value: num(pick(r, idx, ["contractValue-valeurContrat", "totalContractValue", "awardValue", "contractValue"])),
      awardDate: pick(r, idx, ["contractDate-dateContrat", "awardDate", "publicationDate"]),
      startDate: pick(r, idx, ["contractStartDate-dateDebutContrat", "contractStartDate", "deliveryDate"]),
      endDate: pick(r, idx, ["contractEndDate-dateFinContrat", "contractEndDate", "expiryDate"]),
      gsin: codes(pick(r, idx, ["gsin-nibs", "gsin"])),
    });
  }
  return out;
}

/** Build a minimal DocumentAnalysis from feed metadata so the matching engine
 *  can run on tender-notice rows that have no full text yet. */
export function synthAnalysis(t: TenderRow): DocumentAnalysis {
  return analysisSchema.parse({
    solicitation: {
      title: t.title,
      issuing_body: t.buyer,
      jurisdiction: t.jurisdiction,
      platform: "CanadaBuys",
      solicitation_number: t.solicitationNo,
    },
    summary: t.title,
    scope_of_work: [t.title],
    classification_codes: { gsin: t.gsin, inferred: false },
    estimated_value: { amount: t.value, currency: "CAD", basis: "stated", confidence: t.value ? 0.5 : 0 },
  });
}
