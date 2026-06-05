import { z } from "zod";

/**
 * DocumentAnalysis: the structured output Claude must return for a solicitation.
 * Every material claim should be backed by a page citation in source_references.
 * Unknown fields are null, never guessed. Codes/values may be inferred but must
 * be flagged with lower confidence.
 */

export const codeSetSchema = z.object({
  unspsc: z.array(z.string()).default([]),
  nigp: z.array(z.string()).default([]),
  gsin: z.array(z.string()).default([]),
  naics: z.array(z.string()).default([]),
  inferred: z.boolean().default(false),
});

export const qualificationSchema = z.object({
  requirement: z.string(),
  type: z.enum([
    "bonding",
    "insurance",
    "license",
    "clearance",
    "certification",
    "experience",
    "financial",
    "other",
  ]),
  detail: z.string().default(""),
  disqualifying_if_unmet: z.boolean().default(false),
});

export const sourceRefSchema = z.object({
  claim: z.string(),
  page: z.number().nullable().default(null),
  quote: z.string().default(""),
});

export const analysisSchema = z.object({
  solicitation: z.object({
    title: z.string().default(""),
    issuing_body: z.string().default(""),
    jurisdiction: z.string().default(""),
    platform: z.string().default(""),
    solicitation_number: z.string().default(""),
    type: z.string().default(""),
    language: z.string().default("en"),
  }),
  key_dates: z.object({
    posted: z.string().nullable().default(null),
    questions_due: z.string().nullable().default(null),
    site_visit: z.string().nullable().default(null),
    closing: z.string().nullable().default(null),
    estimated_award: z.string().nullable().default(null),
    contract_start: z.string().nullable().default(null),
    contract_end: z.string().nullable().default(null),
  }),
  summary: z.string().default(""),
  scope_of_work: z.array(z.string()).default([]),
  classification_codes: codeSetSchema,
  estimated_value: z.object({
    amount: z.number().nullable().default(null),
    currency: z.string().default("CAD"),
    basis: z.enum(["stated", "estimated"]).default("estimated"),
    confidence: z.number().min(0).max(1).default(0),
  }),
  term: z.object({
    initial_duration: z.string().default(""),
    option_years: z.number().nullable().default(null),
    renewal_notes: z.string().default(""),
  }),
  mandatory_qualifications: z.array(qualificationSchema).default([]),
  evaluation: z.object({
    method: z.enum(["lowest_price", "best_value", "other"]).default("other"),
    criteria: z
      .array(z.object({ name: z.string(), weight: z.number().nullable().default(null) }))
      .default([]),
  }),
  submission: z.object({
    format: z.string().default(""),
    portal: z.string().default(""),
    mandatory_forms: z.array(z.string()).default([]),
    delivery_method: z.string().default(""),
  }),
  set_asides: z.object({
    indigenous: z.boolean().default(false),
    small_business: z.boolean().default(false),
    regional: z.boolean().default(false),
    other: z.string().default(""),
  }),
  incumbent: z.object({
    name: z.string().nullable().default(null),
    contract_ref: z.string().nullable().default(null),
    confidence: z.number().min(0).max(1).default(0),
  }),
  red_flags: z.array(z.string()).default([]),
  source_references: z.array(sourceRefSchema).default([]),
  confidence_overall: z.number().min(0).max(1).default(0),
});

export type DocumentAnalysis = z.infer<typeof analysisSchema>;
export type Qualification = z.infer<typeof qualificationSchema>;
