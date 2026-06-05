/**
 * System instructions + the Claude tool definition used to analyze a
 * solicitation document into the DocumentAnalysis structure.
 *
 * Style rules mirror Phil Dave's site copy: plain, neutral, accurate, no em
 * dashes, no en dashes, no ellipses. Never fabricate.
 */

export const ANALYSIS_SYSTEM = `You analyze government procurement solicitation documents for an opportunity-intelligence service.

Your job: read the document and return a single, structured analysis using the record_analysis tool. You do not write proposals and you do not advise on winning. You describe what the document requires.

Hard rules:
- Extract only what the document supports. If a field is unknown, return null. Never guess a value, date, code, or incumbent.
- Classification codes (UNSPSC, NIGP, GSIN, NAICS) and estimated value may be inferred when not stated. If you infer anything, set the relevant inferred flag or lower the confidence.
- For every material claim (dates, value, mandatory qualifications, incumbent), add a source_references entry with the page number and a short verbatim quote.
- Mandatory qualifications: capture bonding, insurance, licensing, security clearance, certifications, minimum experience and financial requirements. Mark disqualifying_if_unmet true when failing the requirement makes a bid non-compliant.
- Write the summary and scope in plain, neutral language. No em dashes, no en dashes, no ellipses. Use commas, periods and colons.
- Dates in ISO 8601 (YYYY-MM-DD) where possible.`;

// JSON Schema for the record_analysis tool input. Kept in sync with
// analysis-schema.ts (the Zod validator that re-checks the model output).
export const ANALYSIS_TOOL = {
  name: "record_analysis",
  description: "Record the structured analysis of the solicitation document.",
  input_schema: {
    type: "object" as const,
    properties: {
      solicitation: {
        type: "object",
        properties: {
          title: { type: "string" },
          issuing_body: { type: "string" },
          jurisdiction: { type: "string" },
          platform: { type: "string" },
          solicitation_number: { type: "string" },
          type: { type: "string" },
          language: { type: "string" },
        },
      },
      key_dates: {
        type: "object",
        properties: {
          posted: { type: ["string", "null"] },
          questions_due: { type: ["string", "null"] },
          site_visit: { type: ["string", "null"] },
          closing: { type: ["string", "null"] },
          estimated_award: { type: ["string", "null"] },
          contract_start: { type: ["string", "null"] },
          contract_end: { type: ["string", "null"] },
        },
      },
      summary: { type: "string" },
      scope_of_work: { type: "array", items: { type: "string" } },
      classification_codes: {
        type: "object",
        properties: {
          unspsc: { type: "array", items: { type: "string" } },
          nigp: { type: "array", items: { type: "string" } },
          gsin: { type: "array", items: { type: "string" } },
          naics: { type: "array", items: { type: "string" } },
          inferred: { type: "boolean" },
        },
      },
      estimated_value: {
        type: "object",
        properties: {
          amount: { type: ["number", "null"] },
          currency: { type: "string" },
          basis: { type: "string", enum: ["stated", "estimated"] },
          confidence: { type: "number" },
        },
      },
      term: {
        type: "object",
        properties: {
          initial_duration: { type: "string" },
          option_years: { type: ["number", "null"] },
          renewal_notes: { type: "string" },
        },
      },
      mandatory_qualifications: {
        type: "array",
        items: {
          type: "object",
          properties: {
            requirement: { type: "string" },
            type: {
              type: "string",
              enum: ["bonding", "insurance", "license", "clearance", "certification", "experience", "financial", "other"],
            },
            detail: { type: "string" },
            disqualifying_if_unmet: { type: "boolean" },
          },
          required: ["requirement", "type"],
        },
      },
      evaluation: {
        type: "object",
        properties: {
          method: { type: "string", enum: ["lowest_price", "best_value", "other"] },
          criteria: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, weight: { type: ["number", "null"] } },
            },
          },
        },
      },
      submission: {
        type: "object",
        properties: {
          format: { type: "string" },
          portal: { type: "string" },
          mandatory_forms: { type: "array", items: { type: "string" } },
          delivery_method: { type: "string" },
        },
      },
      set_asides: {
        type: "object",
        properties: {
          indigenous: { type: "boolean" },
          small_business: { type: "boolean" },
          regional: { type: "boolean" },
          other: { type: "string" },
        },
      },
      incumbent: {
        type: "object",
        properties: {
          name: { type: ["string", "null"] },
          contract_ref: { type: ["string", "null"] },
          confidence: { type: "number" },
        },
      },
      red_flags: { type: "array", items: { type: "string" } },
      source_references: {
        type: "array",
        items: {
          type: "object",
          properties: {
            claim: { type: "string" },
            page: { type: ["number", "null"] },
            quote: { type: "string" },
          },
        },
      },
      confidence_overall: { type: "number" },
    },
    required: ["solicitation", "summary", "scope_of_work", "classification_codes"],
  },
};
