// Outputs the design tokens as a prettified JSON string.  This helper
// serialises the tokens with two‑space indentation so that the exported
// JSON is easy to read and diff.  Consumers can ingest the tokens via
// the Design Tokens Community Group format.

export function emitDTCG(tokens: any) {
  return JSON.stringify(tokens, null, 2);
}
