import Anthropic from "@anthropic-ai/sdk";
import { analysisSchema, type DocumentAnalysis } from "./analysis-schema";
import { ANALYSIS_SYSTEM, ANALYSIS_TOOL } from "./analysis-prompt";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

// Chars before we map-reduce the document into a digest first.
const DIRECT_LIMIT = 140_000;
const CHUNK = 60_000;
const MAX_CHUNKS = 10;

export type Usage = { input: number; output: number };

function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

function textOf(msg: Anthropic.Message): string {
  return msg.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.TextBlock).text).join("\n");
}

/** Map step: condense a very long document into a dense digest of the facts the
 *  analyzer needs, so coverage isn't lost to truncation (#9). */
async function condense(anthropic: Anthropic, text: string, usage: Usage): Promise<string> {
  const chunks: string[] = [];
  for (let i = 0; i < text.length && chunks.length < MAX_CHUNKS; i += CHUNK) chunks.push(text.slice(i, i + CHUNK));
  const parts: string[] = [];
  for (const chunk of chunks) {
    const m = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: "You condense sections of government solicitation documents. Keep page markers like [p.N]. Extract only facts: scope, mandatory qualifications, dates, classification codes, values, submission rules, evaluation criteria. Be terse. Do not invent.",
      messages: [{ role: "user", content: `Condense this section into the key facts:\n\n${chunk}` }],
    });
    parts.push(textOf(m));
    usage.input += m.usage.input_tokens;
    usage.output += m.usage.output_tokens;
  }
  return parts.join("\n\n");
}

/**
 * Run the solicitation analysis. Returns the validated analysis plus token
 * usage. Long documents are map-reduced into a digest first.
 */
export async function analyzeSolicitation(opts: { text: string; filename?: string }): Promise<{ analysis: DocumentAnalysis; usage: Usage }> {
  const anthropic = client();
  const usage: Usage = { input: 0, output: 0 };

  const working = opts.text.length > DIRECT_LIMIT
    ? await condense(anthropic, opts.text, usage)
    : opts.text;

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: ANALYSIS_SYSTEM,
    tools: [ANALYSIS_TOOL as Anthropic.Tool],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL.name },
    messages: [
      {
        role: "user",
        content: `Analyze the following solicitation${opts.filename ? ` (${opts.filename})` : ""}. Page markers like [p.N] may appear; use them for source_references.\n\n${working}`,
      },
    ],
  });
  usage.input += msg.usage.input_tokens;
  usage.output += msg.usage.output_tokens;

  const toolUse = msg.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("Model did not return a structured analysis");

  return { analysis: analysisSchema.parse(toolUse.input), usage };
}

/** Estimated USD cost for a run (override per-1M prices via env). */
export function costUsd(usage: Usage): number {
  const inPer = Number(process.env.ANTHROPIC_PRICE_IN ?? 3) / 1_000_000;
  const outPer = Number(process.env.ANTHROPIC_PRICE_OUT ?? 15) / 1_000_000;
  return usage.input * inPer + usage.output * outPer;
}
