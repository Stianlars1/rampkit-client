import { Scheme } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";
import { HSLColor, hslToHex } from "@/lib/utils/color/colorConverters";

export function generateHarmoniousPalette(
  baseColor: string,
  scheme: Scheme = "analogous",
): {
  accent: string;
  gray: string;
  lightBg: string;
  darkBg: string;
} {
  const hsl = hexToHSL(baseColor);

  switch (scheme) {
    case "analogous":
      return generateAnalogous(hsl);
    case "complementary":
      return generateComplementary(hsl);
    case "triadic":
      return generateTriadic(hsl);
    case "monochromatic":
      return generateMonochromatic(hsl);
    default:
      return generateAnalogous(hsl);
  }
}

export function generateAnalogous(baseHSL: HSLColor) {
  // Analogous: Use colors 30° adjacent for harmonious, temperature-consistent palette
  const adjacentHue1 = (baseHSL.h + 30) % 360;
  const adjacentHue2 = (baseHSL.h - 30 + 360) % 360;

  // Use the more vibrant adjacent color as accent
  const accent = hslToHex({
    h: adjacentHue1,
    s: Math.max(75, baseHSL.s),
    l: 55,
  });

  // Gray from the other adjacent hue with very low saturation
  const gray = hslToHex({
    h: adjacentHue2,
    s: 8,
    l: 50,
  });

  // Backgrounds using the base hue with subtle shifts
  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 15,
    l: 98,
  });

  const darkBg = hslToHex({
    h: baseHSL.h,
    s: 20,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateComplementary(baseHSL: HSLColor) {
  console.log("Generating complementary palette for", baseHSL);
  // Complementary: Use actual complementary color (180° opposite) for high contrast
  const complementaryHue = (baseHSL.h + 180) % 360;

  // Accent should be the complementary color, not the base
  const accent = hslToHex({
    h: complementaryHue,
    s: Math.max(70, baseHSL.s),
    l: 55,
  });

  // Gray derived from complementary but desaturated heavily to avoid visual discomfort
  const gray = hslToHex({
    h: complementaryHue,
    s: 5,
    l: 50,
  });

  // Light background from base color, very desaturated
  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 10,
    l: 98,
  });

  // Dark background from complementary, also very desaturated
  const darkBg = hslToHex({
    h: complementaryHue,
    s: 15,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateTriadic(baseHSL: HSLColor) {
  // Triadic: Three colors 120° apart forming equilateral triangle
  const triadicHue1 = (baseHSL.h + 120) % 360;
  const triadicHue2 = (baseHSL.h + 240) % 360;

  // Use first triadic color as accent (most vibrant)
  const accent = hslToHex({
    h: triadicHue1,
    s: Math.max(80, baseHSL.s),
    l: 55,
  });

  // Gray from second triadic color, heavily desaturated
  const gray = hslToHex({
    h: triadicHue2,
    s: 8,
    l: 50,
  });

  // Backgrounds alternate between base and triadic colors
  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 12,
    l: 98,
  });

  const darkBg = hslToHex({
    h: triadicHue1,
    s: 18,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateMonochromatic(baseHSL: HSLColor) {
  // Monochromatic: Same hue with varied saturation and lightness
  const accent = hslToHex({
    h: baseHSL.h,
    s: Math.max(85, baseHSL.s),
    l: 45, // Darker for more contrast
  });

  // Gray uses same hue but very low saturation
  const gray = hslToHex({
    h: baseHSL.h,
    s: 4,
    l: 55, // Slightly lighter than accent
  });

  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 12,
    l: 98,
  });

  const darkBg = hslToHex({
    h: baseHSL.h,
    s: 25,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}
