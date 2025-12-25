/**
 * Investigation: Light mode steps 1-4 tinting
 *
 * Comparing our generated values against expected Radix behavior
 */

import Color from "colorjs.io";
import { generateRadixColors } from "../src/components/radix/generateRadixColors";
import { DEFAULT_HEX } from "@/lib/constants";

const inputHex = DEFAULT_HEX; // The blue from the screenshot

// Generate scales for both modes
const lightScale = generateRadixColors({
  appearance: "light",
  accent: inputHex,
  gray: "#808080",
  background: "#F7F7F7",
});

const darkScale = generateRadixColors({
  appearance: "dark",
  accent: inputHex,
  gray: "#808080",
  background: "#0F0F0F",
});

console.log("=".repeat(80));
console.log("LIGHT MODE STEPS 1-4 INVESTIGATION");
console.log(`Input: ${DEFAULT_HEX} (Blue)`);
console.log("=".repeat(80));
console.log();

console.log("LIGHT MODE - Steps 1-4 Analysis:");
console.log("-".repeat(80));
console.log("Step | HEX     | OKLCH L  | OKLCH C  | OKLCH H  | Assessment");
console.log("-".repeat(80));

for (let i = 0; i < 4; i++) {
  const hex = lightScale.accentScale[i];
  const color = new Color(hex).to("oklch");
  const L = color.coords[0];
  const C = color.coords[1];
  const H = color.coords[2];

  // Radix guidelines: Steps 1-2 should have very low chroma
  const chromaAssessment =
    C < 0.01 ? "✅ Low" : C < 0.02 ? "⚠️ Medium" : "❌ High";

  console.log(
    `  ${i + 1}  | ${hex} | ${L.toFixed(4)} | ${C.toFixed(4)} | ${(H || 0).toFixed(1).padStart(5)} | ${chromaAssessment}`,
  );
}

console.log();
console.log("DARK MODE - Steps 1-4 Analysis:");
console.log("-".repeat(80));
console.log("Step | HEX     | OKLCH L  | OKLCH C  | OKLCH H  | Assessment");
console.log("-".repeat(80));

for (let i = 0; i < 4; i++) {
  const hex = darkScale.accentScale[i];
  const color = new Color(hex).to("oklch");
  const L = color.coords[0];
  const C = color.coords[1];
  const H = color.coords[2];

  const chromaAssessment =
    C < 0.01 ? "✅ Low" : C < 0.02 ? "⚠️ Medium" : "❌ High";

  console.log(
    `  ${i + 1}  | ${hex} | ${L.toFixed(4)} | ${C.toFixed(4)} | ${(H || 0).toFixed(1).padStart(5)} | ${chromaAssessment}`,
  );
}

console.log();
console.log("=".repeat(80));
console.log("FULL SCALE COMPARISON");
console.log("=".repeat(80));
console.log();

console.log("Light Mode Scale:");
lightScale.accentScale.forEach((hex, i) => {
  const color = new Color(hex).to("oklch");
  console.log(
    `  Step ${(i + 1).toString().padStart(2)}: ${hex} (L=${color.coords[0].toFixed(3)}, C=${color.coords[1].toFixed(3)})`,
  );
});

console.log();
console.log("Dark Mode Scale:");
darkScale.accentScale.forEach((hex, i) => {
  const color = new Color(hex).to("oklch");
  console.log(
    `  Step ${(i + 1).toString().padStart(2)}: ${hex} (L=${color.coords[0].toFixed(3)}, C=${color.coords[1].toFixed(3)})`,
  );
});

console.log();
console.log("=".repeat(80));
console.log("BACKGROUND VALUES");
console.log("=".repeat(80));
console.log(`Light background: ${lightScale.background}`);
console.log(`Dark background: ${darkScale.background}`);

// Check background OKLCH values
const lightBg = new Color(lightScale.background).to("oklch");
const darkBg = new Color(darkScale.background).to("oklch");
console.log(
  `Light bg OKLCH: L=${lightBg.coords[0].toFixed(4)}, C=${lightBg.coords[1].toFixed(4)}, H=${lightBg.coords[2]?.toFixed(1) || "N/A"}`,
);
console.log(
  `Dark bg OKLCH: L=${darkBg.coords[0].toFixed(4)}, C=${darkBg.coords[1].toFixed(4)}, H=${darkBg.coords[2]?.toFixed(1) || "N/A"}`,
);

console.log();
console.log("=".repeat(80));
console.log("RADIX REFERENCE (approximate expected values for blue)");
console.log("=".repeat(80));
console.log(
  "Step 1 (Light): Should be ~#fdfdfe or similar (very light, minimal tint)",
);
console.log("Step 2 (Light): Should be ~#f7f9ff or similar (subtle blue tint)");
console.log("Step 3 (Light): Should have slightly more blue tint");
console.log("Step 4 (Light): Should have more visible blue tint");
