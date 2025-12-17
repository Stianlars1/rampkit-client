/**
 * Color Scale Analysis Script
 *
 * Runs comprehensive tests on the 12-step color scale generation:
 * 1. Perceptual uniformity (lightness deltas)
 * 2. Contrast compliance (WCAG AA)
 * 3. Cross-hue consistency
 * 4. Dark/Light mode balance
 *
 * Run with: npx tsx scripts/analyze-color-scales.ts
 */

import Color from "colorjs.io";
import { generateRadixColors } from "../src/components/radix/generateRadixColors";

// Test colors covering various hues
const testColors = [
  { name: "Blue", hex: "#3B82F6", hue: 217 },
  { name: "Green", hex: "#22C55E", hue: 142 },
  { name: "Red", hex: "#EF4444", hue: 0 },
  { name: "Yellow", hex: "#F59E0B", hue: 38 },
  { name: "Purple", hex: "#8B5CF6", hue: 258 },
  { name: "Cyan", hex: "#00C3EB", hue: 190 },
  { name: "Orange", hex: "#F97316", hue: 25 },
  { name: "Pink", hex: "#EC4899", hue: 330 },
];

interface ScaleAnalysis {
  color: string;
  appearance: "light" | "dark";
  lightnessValues: number[];
  lightnessDeltas: number[];
  deltaMean: number;
  deltaStdDev: number;
  contrastResults: ContrastResult[];
}

interface ContrastResult {
  bgStep: number;
  textStep: number;
  ratio: number;
  pass: boolean;
}

function getContrastRatio(color1: string, color2: string): number {
  const c1 = new Color(color1);
  const c2 = new Color(color2);

  // Use Color.js's WCAG 2.1 contrast calculation
  const l1 = c1.to("srgb").luminance;
  const l2 = c2.to("srgb").luminance;

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function analyzeScale(scale: string[], appearance: "light" | "dark"): Omit<ScaleAnalysis, "color"> {
  // Get OKLCH lightness values
  const lightnessValues = scale.map((hex) => {
    const color = new Color(hex).to("oklch");
    return color.coords[0];
  });

  // Calculate deltas between adjacent steps
  const lightnessDeltas = lightnessValues.slice(1).map((l, i) => {
    return Math.abs(lightnessValues[i] - l);
  });

  // Calculate mean and standard deviation
  const deltaMean = lightnessDeltas.reduce((a, b) => a + b, 0) / lightnessDeltas.length;
  const deltaVariance =
    lightnessDeltas.reduce((sum, d) => sum + Math.pow(d - deltaMean, 2), 0) / lightnessDeltas.length;
  const deltaStdDev = Math.sqrt(deltaVariance);

  // Test contrast for key pairs (as defined by Radix)
  const contrastPairs = [
    { bg: 0, text: 10 }, // Step 1 bg, Step 11 text
    { bg: 0, text: 11 }, // Step 1 bg, Step 12 text
    { bg: 1, text: 10 }, // Step 2 bg, Step 11 text
    { bg: 1, text: 11 }, // Step 2 bg, Step 12 text
    { bg: 2, text: 10 }, // Step 3 bg, Step 11 text
    { bg: 8, text: 11 }, // Step 9 (solid), contrast text
  ];

  const contrastResults = contrastPairs.map(({ bg, text }) => {
    const ratio = getContrastRatio(scale[bg], scale[text]);
    return {
      bgStep: bg + 1,
      textStep: text + 1,
      ratio,
      pass: ratio >= 4.5,
    };
  });

  return {
    lightnessValues,
    lightnessDeltas,
    deltaMean,
    deltaStdDev,
    contrastResults,
  };
}

function runAnalysis() {
  console.log("=".repeat(100));
  console.log("12-STEP COLOR SCALE ANALYSIS");
  console.log("=".repeat(100));
  console.log();

  const results: ScaleAnalysis[] = [];

  // Generate and analyze scales for each test color
  for (const { name, hex } of testColors) {
    for (const appearance of ["light", "dark"] as const) {
      const bg = appearance === "light" ? "#F7F7F7" : "#0F0F0F";
      const generated = generateRadixColors({
        appearance,
        accent: hex,
        gray: "#808080",
        background: bg,
      });

      const analysis = analyzeScale(generated.accentScale, appearance);
      results.push({
        color: `${name} (${hex})`,
        appearance,
        ...analysis,
      });
    }
  }

  // ========== TEST 1: PERCEPTUAL UNIFORMITY ==========
  console.log("TEST 1: PERCEPTUAL UNIFORMITY");
  console.log("=".repeat(100));
  console.log("Analyzing OKLCH lightness deltas between steps...");
  console.log("Ideal: Equal deltas across all steps (low std dev)");
  console.log();

  console.log("Color               | Mode  | Mean Delta | Std Dev | Uniformity");
  console.log("-".repeat(100));

  for (const r of results) {
    const uniformity = r.deltaStdDev < 0.02 ? "✅ Good" : r.deltaStdDev < 0.04 ? "⚠️ Fair" : "❌ Poor";
    console.log(
      `${r.color.padEnd(19)} | ${r.appearance.padEnd(5)} | ${r.deltaMean.toFixed(4).padEnd(10)} | ${r.deltaStdDev.toFixed(4).padEnd(7)} | ${uniformity}`
    );
  }

  // Show detailed lightness values for one example
  console.log();
  console.log("Detailed lightness curve (Blue - Light mode):");
  const blueLight = results.find((r) => r.color.includes("Blue") && r.appearance === "light");
  if (blueLight) {
    console.log("Step:      " + Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(6)).join(" "));
    console.log(
      "L (OKLCH): " + blueLight.lightnessValues.map((l) => l.toFixed(3).padStart(6)).join(" ")
    );
    console.log(
      "Delta:     " +
        "     -" +
        blueLight.lightnessDeltas.map((d) => d.toFixed(3).padStart(6)).join(" ")
    );
  }

  // ========== TEST 2: CONTRAST COMPLIANCE ==========
  console.log();
  console.log();
  console.log("TEST 2: CONTRAST COMPLIANCE (WCAG AA)");
  console.log("=".repeat(100));
  console.log("Testing contrast ratios for key UI pairs...");
  console.log("Requirement: 4.5:1 minimum for text on backgrounds");
  console.log();

  let totalPairs = 0;
  let passingPairs = 0;
  const failingPairs: { color: string; appearance: string; bgStep: number; textStep: number; ratio: number }[] = [];

  for (const r of results) {
    for (const cr of r.contrastResults) {
      totalPairs++;
      if (cr.pass) {
        passingPairs++;
      } else {
        failingPairs.push({
          color: r.color,
          appearance: r.appearance,
          bgStep: cr.bgStep,
          textStep: cr.textStep,
          ratio: cr.ratio,
        });
      }
    }
  }

  console.log(`Overall: ${passingPairs}/${totalPairs} pairs pass WCAG AA (${((passingPairs / totalPairs) * 100).toFixed(1)}%)`);
  console.log();

  if (failingPairs.length > 0) {
    console.log("FAILING PAIRS:");
    console.log("-".repeat(80));
    for (const fp of failingPairs) {
      console.log(
        `  ${fp.color} (${fp.appearance}): Step ${fp.bgStep} ↔ Step ${fp.textStep} = ${fp.ratio.toFixed(2)}:1 ❌`
      );
    }
  } else {
    console.log("✅ All contrast pairs pass WCAG AA!");
  }

  // ========== TEST 3: CROSS-HUE CONSISTENCY ==========
  console.log();
  console.log();
  console.log("TEST 3: CROSS-HUE CONSISTENCY");
  console.log("=".repeat(100));
  console.log("Comparing Step 9 (solid color) lightness across hues...");
  console.log("Ideal: Similar lightness for similar 'visual weight'");
  console.log();

  const step9Light: { color: string; lightness: number }[] = [];
  const step9Dark: { color: string; lightness: number }[] = [];

  for (const r of results) {
    const step9L = r.lightnessValues[8];
    if (r.appearance === "light") {
      step9Light.push({ color: r.color, lightness: step9L });
    } else {
      step9Dark.push({ color: r.color, lightness: step9L });
    }
  }

  console.log("Light Mode - Step 9 Lightness:");
  for (const s of step9Light) {
    console.log(`  ${s.color.padEnd(20)}: ${s.lightness.toFixed(4)}`);
  }

  const lightMean = step9Light.reduce((a, b) => a + b.lightness, 0) / step9Light.length;
  const lightVariance =
    step9Light.reduce((sum, s) => sum + Math.pow(s.lightness - lightMean, 2), 0) / step9Light.length;
  const lightStdDev = Math.sqrt(lightVariance);
  console.log(`  Mean: ${lightMean.toFixed(4)}, Std Dev: ${lightStdDev.toFixed(4)}`);

  console.log();
  console.log("Dark Mode - Step 9 Lightness:");
  for (const s of step9Dark) {
    console.log(`  ${s.color.padEnd(20)}: ${s.lightness.toFixed(4)}`);
  }

  const darkMean = step9Dark.reduce((a, b) => a + b.lightness, 0) / step9Dark.length;
  const darkVariance =
    step9Dark.reduce((sum, s) => sum + Math.pow(s.lightness - darkMean, 2), 0) / step9Dark.length;
  const darkStdDev = Math.sqrt(darkVariance);
  console.log(`  Mean: ${darkMean.toFixed(4)}, Std Dev: ${darkStdDev.toFixed(4)}`);

  // Identify outliers (yellow is often problematic)
  console.log();
  const outlierThreshold = 0.1;
  const lightOutliers = step9Light.filter((s) => Math.abs(s.lightness - lightMean) > outlierThreshold);
  const darkOutliers = step9Dark.filter((s) => Math.abs(s.lightness - darkMean) > outlierThreshold);

  if (lightOutliers.length > 0 || darkOutliers.length > 0) {
    console.log("⚠️ OUTLIERS (>0.1 from mean):");
    for (const o of lightOutliers) {
      console.log(`  Light: ${o.color} (L=${o.lightness.toFixed(4)}, diff=${Math.abs(o.lightness - lightMean).toFixed(4)})`);
    }
    for (const o of darkOutliers) {
      console.log(`  Dark: ${o.color} (L=${o.lightness.toFixed(4)}, diff=${Math.abs(o.lightness - darkMean).toFixed(4)})`);
    }
  } else {
    console.log("✅ No significant outliers detected");
  }

  // ========== TEST 4: DARK VS LIGHT MODE BALANCE ==========
  console.log();
  console.log();
  console.log("TEST 4: DARK VS LIGHT MODE BALANCE");
  console.log("=".repeat(100));
  console.log("Comparing corresponding steps between light and dark modes...");
  console.log();

  // For each color, compare light vs dark at each step
  const modeBalanceIssues: string[] = [];

  for (const { name, hex } of testColors) {
    const light = results.find((r) => r.color.includes(name) && r.appearance === "light");
    const dark = results.find((r) => r.color.includes(name) && r.appearance === "dark");

    if (light && dark) {
      // Step 9 should be similar in both modes (it's the solid accent)
      const step9LightL = light.lightnessValues[8];
      const step9DarkL = dark.lightnessValues[8];
      const step9Diff = Math.abs(step9LightL - step9DarkL);

      if (step9Diff > 0.15) {
        modeBalanceIssues.push(
          `${name}: Step 9 differs by ${step9Diff.toFixed(4)} (Light=${step9LightL.toFixed(4)}, Dark=${step9DarkL.toFixed(4)})`
        );
      }

      // Steps 1-2 should be inverted (light bg in light mode, dark bg in dark mode)
      // This is expected behavior, not an issue
    }
  }

  if (modeBalanceIssues.length > 0) {
    console.log("⚠️ MODE BALANCE ISSUES:");
    for (const issue of modeBalanceIssues) {
      console.log(`  ${issue}`);
    }
  } else {
    console.log("✅ Dark/Light mode balance is good");
  }

  // ========== SUMMARY ==========
  console.log();
  console.log();
  console.log("=".repeat(100));
  console.log("SUMMARY");
  console.log("=".repeat(100));

  const uniformityOK = results.every((r) => r.deltaStdDev < 0.04);
  const contrastOK = failingPairs.length === 0;
  const crossHueOK = lightStdDev < 0.1 && darkStdDev < 0.1;
  const modeBalanceOK = modeBalanceIssues.length === 0;

  console.log(`1. Perceptual Uniformity: ${uniformityOK ? "✅ PASS" : "⚠️ NEEDS REVIEW"}`);
  console.log(`2. Contrast Compliance:   ${contrastOK ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`3. Cross-Hue Consistency: ${crossHueOK ? "✅ PASS" : "⚠️ NEEDS REVIEW"}`);
  console.log(`4. Dark/Light Balance:    ${modeBalanceOK ? "✅ PASS" : "⚠️ NEEDS REVIEW"}`);
  console.log();

  if (uniformityOK && contrastOK && crossHueOK && modeBalanceOK) {
    console.log("🎉 All tests pass! The color scale generation is working well.");
  } else {
    console.log("⚠️ Some areas may benefit from review. See detailed results above.");
  }
}

runAnalysis();
