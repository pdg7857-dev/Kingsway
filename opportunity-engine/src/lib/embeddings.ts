// Pluggable text-embedding client. Default provider is Voyage AI; OpenAI is
// supported via EMBEDDINGS_PROVIDER=openai. Both are configured to output 1024
// dimensions so they fit the same pgvector column. Returns [] of vectors.

export const EMBEDDING_DIM = 1024;

export function embeddingsConfigured(): boolean {
  const provider = process.env.EMBEDDINGS_PROVIDER || "voyage";
  return provider === "openai" ? !!process.env.OPENAI_API_KEY : !!process.env.VOYAGE_API_KEY;
}

type InputType = "document" | "query";

export async function embed(texts: string[], inputType: InputType = "document"): Promise<number[][]> {
  if (texts.length === 0) return [];
  const provider = process.env.EMBEDDINGS_PROVIDER || "voyage";
  return provider === "openai" ? embedOpenAI(texts) : embedVoyage(texts, inputType);
}

async function embedVoyage(texts: string[], inputType: InputType): Promise<number[][]> {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) throw new Error("VOYAGE_API_KEY is not set");
  const model = process.env.EMBEDDING_MODEL || "voyage-3-large";
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: texts, model, input_type: inputType, output_dimension: EMBEDDING_DIM }),
  });
  if (!res.ok) throw new Error(`Voyage error ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

async function embedOpenAI(texts: string[]): Promise<number[][]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  const model = process.env.EMBEDDING_MODEL || "text-embedding-3-large";
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: texts, model, dimensions: EMBEDDING_DIM }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

/** Format a JS number[] as a pgvector literal: [0.1,0.2,...] */
export function toVectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}
