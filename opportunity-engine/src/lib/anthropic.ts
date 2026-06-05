import Anthropic from "@anthropic-ai/sdk";
import { analysisSchema, type DocumentAnalysis } from "./analysis-schema";
import { ANALYSIS_SYSTEM, ANALYSIS_TOOL } from "./analysis-prompt";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

/**
 * Run the solicitation analysis. Forces the model to call record_analysis and
 * re-validates the result with Zod so downstream code always gets a clean
 * DocumentAnalysis (defaults fill any missing fields).
 */
export async function analyzeSolicitation(opts: {
  text: string;
  filename?: string;
}): Promise<DocumentAnalysis> {
  const anthropic = client();

  // Guard against pathological inputs. A production version chunks and maps
  // long documents; here we cap to keep a single call predictable.
  const text = opts.text.slice(0, 180_000);

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: ANALYSIS_SYSTEM,
    tools: [ANALYSIS_TOOL as Anthropic.Tool],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL.name },
    messages: [
      {
        role: "user",
        content: `Analyze the following solicitation document${
          opts.filename ? ` (${opts.filename})` : ""
        }. Page markers like [p.N] may appear in the text; use them for source_references.\n\n${text}`,
      },
    ],
  });

  const toolUse = msg.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Model did not return a structured analysis");
  }

  // Zod fills defaults and coerces, so partial tool output stays safe.
  return analysisSchema.parse(toolUse.input);
}
