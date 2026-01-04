/**
 * Background color verification script
 *
 * Verifies that background generation produces colors in the expected ranges:
 * - Dark mode: #0A0A0A - #1F1F1F (OKLCH L: 0.12 - 0.22)
 * - Light mode: #F0F0F0 - #FFFFFF (OKLCH L: 0.95 - 1.00)
 *
 * Run with: npx tsx scripts/verify-backgrounds.ts
 */

import Color from "colorjs.io";
import { generateBackgroundsOKLCH } from "../src/lib/utils/color/generateBackgrounds";
import { Scheme } from "../src/types";
import { DEFAULT_HEX } from "@/lib/constants";

interface TestResult {
  seed: string;
  scheme: Scheme;
  darkBg: string;
  lightBg: string;
  darkL: number;
  lightL: number;
  darkOk: boolean;
  lightOk: boolean;
}

// Test colors covering various hues
const testColors = [
  { name: "Cyan", hex: "#00C3EB" },
  { name: "Blue", hex: DEFAULT_HEX },
  { name: "Green", hex: "#22C55E" },
  { name: "Red", hex: "#EF4444" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Orange", hex: "#F97316" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Gray", hex: "#808080" },
  { name: "Near-black", hex: "#1A1A1A" },
  { name: "Near-white", hex: "#F5F5F5" },
  { name: "Pure black", hex: "#000000" },
  { name: "Pure white", hex: "#FFFFFF" },
];

const schemes: Scheme[] = [
  "monochromatic",
  "analogous",
  "complementary",
  "triadic",
];

// Expected ranges (OKLCH L values)
const DARK_L_MIN = 0.12;
const DARK_L_MAX = 0.22;
const LIGHT_L_MIN = 0.95;
const LIGHT_L_MAX = 1.0;

function runTests(): TestResult[] {
  const results: TestResult[] = [];

  for (const { hex } of testColors) {
    for (const scheme of schemes) {
      const { darkBackground, lightBackground } = generateBackgroundsOKLCH(
        hex,
        hex,
        scheme,
      );

      const darkOKLCH = new Color(darkBackground).to("oklch");
      const lightOKLCH = new Color(lightBackground).to("oklch");

      const darkL = darkOKLCH.coords[0];
      const lightL = lightOKLCH.coords[0];

      results.push({
        seed: hex,
        scheme,
        darkBg: darkBackground,
        lightBg: lightBackground,
        darkL,
        lightL,
        darkOk: darkL >= DARK_L_MIN && darkL <= DARK_L_MAX,
        lightOk: lightL >= LIGHT_L_MIN && lightL <= LIGHT_L_MAX,
      });
    }
  }

  return results;
}

function printResults(results: TestResult[]): void {
  console.log("=".repeat(100));
  console.log("BACKGROUND COLOR VERIFICATION");
  console.log("=".repeat(100));
  console.log();
  console.log(
    `Expected dark L range:  ${DARK_L_MIN} - ${DARK_L_MAX} (~#0A0A0A - #1F1F1F)`,
  );
  console.log(
    `Expected light L range: ${LIGHT_L_MIN} - ${LIGHT_L_MAX} (~#F0F0F0 - #FFFFFF)`,
  );
  console.log();

  const failures: TestResult[] = [];
  let passCount = 0;
  let failCount = 0;

  for (const result of results) {
    if (result.darkOk && result.lightOk) {
      passCount++;
    } else {
      failCount++;
      failures.push(result);
    }
  }

  console.log(`Results: ${passCount} passed, ${failCount} failed`);
  console.log();

  if (failures.length > 0) {
    console.log("FAILURES:");
    console.log("-".repeat(100));
    for (const f of failures) {
      console.log(`  ${f.seed} (${f.scheme}):`);
      if (!f.darkOk) {
        console.log(
          `    ❌ Dark: ${f.darkBg} (L=${f.darkL.toFixed(4)}) - OUT OF RANGE`,
        );
      }
      if (!f.lightOk) {
        console.log(
          `    ❌ Light: ${f.lightBg} (L=${f.lightL.toFixed(4)}) - OUT OF RANGE`,
        );
      }
    }
    console.log();
  }

  // Sample output table
  console.log("SAMPLE OUTPUTS (monochromatic scheme):");
  console.log("-".repeat(100));
  console.log(
    "Seed Color      | Dark BG   | Dark L  | Light BG  | Light L | Status",
  );
  console.log("-".repeat(100));

  for (const { name, hex } of testColors) {
    const result = results.find(
      (r) => r.seed === hex && r.scheme === "monochromatic",
    );
    if (result) {
      const status = result.darkOk && result.lightOk ? "✅ PASS" : "❌ FAIL";
      console.log(
        `${name.padEnd(15)} | ${result.darkBg} | ${result.darkL.toFixed(4)} | ${result.lightBg} | ${result.lightL.toFixed(4)} | ${status}`,
      );
    }
  }

  console.log();
  console.log("=".repeat(100));

  // Exit with error code if any failures
  if (failCount > 0) {
    console.log(`\n❌ ${failCount} tests failed!`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${passCount} tests passed!`);
    process.exit(0);
  }
}

// Run verification
const results = runTests();
printResults(results);
