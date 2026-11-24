// Alien Field Notes: The Two Day Earth Review — one-line alien tourist review.
// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt and verifies it
// against the competition gate (UTF-8 text, 1-200 characters, not only
// whitespace, single line), then reads it back byte-identical.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Five stars for the oceans. Docked one because the dominant species apologizes to furniture and calls it manners.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
// The tie-break is on bytes (smaller text wins), so assert the byte size
// explicitly too: for this ASCII line it equals the character count.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes !== chars.length) {
  throw new Error(`entry has multibyte characters: ${chars.length} chars, ${bytes} bytes`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: output differs from the entry line");
}
