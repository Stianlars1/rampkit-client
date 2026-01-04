/**
 * Compare scale generation with OLD vs NEW background colors
 *
 * OLD background: #000102 (the broken near-black)
 * NEW background: ~#0b1112 (the fixed dark gray)
 */

import Color from "colorjs.io";
import { generateRadixColors } from "../src/components/radix/generateRadixColors";
import { DEFAULT_HEX } from "@/lib/constants";

const inputHex = DEFAULT_HEX;

// OLD broken background (near pure black)
const oldDarkBg = "#000102";

// NEW fixed background (proper dark gray)
const newDarkBg = "#0b1112";

console.log("=".repeat(80));
console.log("COMPARISON: OLD vs NEW BACKGROUND EFFECT ON SCALE");
console.log("Input: " + DEFAULT_HEX);
console.log("=".repeat(80));
console.log();

// Generate with OLD background
const oldScale = generateRadixColors({
  appearance: "dark",
  accent: inputHex,
  gray: "#808080",
  background: oldDarkBg,
});

// Generate with NEW background
const newScale = generateRadixColors({
  appearance: "dark",
  accent: inputHex,
  gray: "#808080",
  background: newDarkBg,
});

console.log("DARK MODE SCALE COMPARISON:");
console.log("-".repeat(80));
console.log(
  "Step | OLD HEX   | NEW HEX   | OLD L   | NEW L   | L Diff   | Changed?",
);
console.log("-".repeat(80));

for (let i = 0; i < 12; i++) {
  const oldHex = oldScale.accentScale[i];
  const newHex = newScale.accentScale[i];
  const oldColor = new Color(oldHex).to("oklch");
  const newColor = new Color(newHex).to("oklch");
  const oldL = oldColor.coords[0];
  const newL = newColor.coords[0];
  const lDiff = newL - oldL;
  const changed = oldHex !== newHex ? "✅ YES" : "  no";

  console.log(
    `  ${(i + 1).toString().padStart(2)} | ${oldHex} | ${newHex} | ${oldL.toFixed(3)} | ${newL.toFixed(3)} | ${lDiff >= 0 ? "+" : ""}${lDiff.toFixed(3)} | ${changed}`,
  );
}

console.log();
console.log("CHROMA COMPARISON:");
console.log("-".repeat(80));
console.log("Step | OLD C   | NEW C   | C Diff");
console.log("-".repeat(80));

for (let i = 0; i < 12; i++) {
  const oldHex = oldScale.accentScale[i];
  const newHex = newScale.accentScale[i];
  const oldColor = new Color(oldHex).to("oklch");
  const newColor = new Color(newHex).to("oklch");
  const oldC = oldColor.coords[1];
  const newC = newColor.coords[1];
  const cDiff = newC - oldC;

  console.log(
    `  ${(i + 1).toString().padStart(2)} | ${oldC.toFixed(4)} | ${newC.toFixed(4)} | ${cDiff >= 0 ? "+" : ""}${cDiff.toFixed(4)}`,
  );
}

console.log();
console.log("=".repeat(80));
console.log("IMPACT ANALYSIS");
console.log("=".repeat(80));

// Check if any steps are significantly different
let significantChanges = 0;
for (let i = 0; i < 12; i++) {
  const oldHex = oldScale.accentScale[i];
  const newHex = newScale.accentScale[i];
  if (oldHex !== newHex) significantChanges++;
}

console.log(`Total steps changed: ${significantChanges}/12`);

if (significantChanges > 0) {
  console.log();
  console.log("⚠️ The background color DOES affect scale generation!");
  console.log(
    "This is because generateRadixColors uses transposeProgressionStart()",
  );
  console.log(
    "which adjusts the lightness curve based on the background color.",
  );
} else {
  console.log();
  console.log(
    "✅ The background color does NOT significantly affect scale generation.",
  );
}

// Also check alpha scale
console.log();
console.log("ALPHA SCALE COMPARISON (first 4 steps):");
console.log("-".repeat(80));
for (let i = 0; i < 4; i++) {
  const oldAlpha = oldScale.accentScaleAlpha[i];
  const newAlpha = newScale.accentScaleAlpha[i];
  const changed = oldAlpha !== newAlpha ? "DIFFERENT" : "same";
  console.log(
    `  Step ${i + 1}: OLD=${oldAlpha} | NEW=${newAlpha} | ${changed}`,
  );
}
