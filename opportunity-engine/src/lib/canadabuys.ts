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
  contractNumber: string;
  amendmentNumber: string;
  gsin: string[];
  unspsc: string[];
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

// Header aliases for CanadaBuys award/contract-history exports. Real headers are
// compound bilingual (name-nom-eng); normHeader strips punctuation so these
// match regardless of casing or separators.
export const AWARD_ALIASES = {
  title: ["title-titre-eng", "title-titre", "title"],
  buyer: [
    "contractingEntityName-nomEntitContractante-eng",
    "endUserEntitiesName-nomEntitesUtilisateurFinal-eng",
    "procurementEntityName", "organization",
  ],
  supplier: ["supplierLegalName-nomLegalFournisseur-eng", "supplierName", "contractorName"],
  jurisdiction: [
    "regionsOfDelivery-regionsLivraison-eng",
    "supplierAddressProvince-fournisseurAdresseProvince-eng",
    "regionsOfDelivery",
  ],
  totalValue: ["totalContractValue-valeurTotaleContrat", "totalContractValue"],
  contractAmount: ["contractAmount-montantContrat", "contractAmount"],
  awardDate: ["contractAwardDate-dateAttributionContrat", "publicationDate-datePublication", "awardDate"],
  startDate: ["contractStartDate-contratDateDebut", "contractStartDate"],
  endDate: ["contractEndDate-dateFinContrat", "contractEndDate"],
  contractNumber: ["contractNumber-numeroContrat", "contractNumber"],
  amendmentNumber: ["amendmentNumber-numeroModification", "amendmentNumber"],
  gsin: ["gsin-nibs", "gsin"],
  unspsc: ["unspsc"],
} as const;

export function mapAwardRow(r: string[], idx: Map<string, number>): AwardRow | null {
  const title = pick(r, idx, AWARD_ALIASES.title);
  const buyer = pick(r, idx, AWARD_ALIASES.buyer);
  if (!title && !buyer) return null;
  // Entities populate either contractAmount or totalContractValue (the other is
  // 0.00), so take the larger of the two as the contract value.
  const value =
    Math.max(num(pick(r, idx, AWARD_ALIASES.totalValue)) ?? 0, num(pick(r, idx, AWARD_ALIASES.contractAmount)) ?? 0) || null;
  return {
    title: title || "Award notice",
    buyer: buyer || "Unknown",
    supplier: pick(r, idx, AWARD_ALIASES.supplier),
    jurisdiction: pick(r, idx, AWARD_ALIASES.jurisdiction),
    value,
    awardDate: pick(r, idx, AWARD_ALIASES.awardDate),
    startDate: pick(r, idx, AWARD_ALIASES.startDate),
    endDate: pick(r, idx, AWARD_ALIASES.endDate),
    contractNumber: pick(r, idx, AWARD_ALIASES.contractNumber),
    amendmentNumber: pick(r, idx, AWARD_ALIASES.amendmentNumber),
    gsin: codes(pick(r, idx, AWARD_ALIASES.gsin)),
    unspsc: codes(pick(r, idx, AWARD_ALIASES.unspsc)),
  };
}

export function parseAwards(text: string): AwardRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const idx = headerIndex(rows[0]);
  const out: AwardRow[] = [];
  for (const r of rows.slice(1)) {
    const mapped = mapAwardRow(r, idx);
    if (mapped) out.push(mapped);
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
