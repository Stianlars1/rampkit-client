import { Scheme } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";
import { HSLColor, hslToHex } from "@/lib/utils/color/colorConverters";

/** ---------- Core utilities ---------- */
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const modHue = (h: number) => ((h % 360) + 360) % 360;

const rotateHue = (h: number, delta: number) => modHue(h + delta);

const isNearGray = (s: number) => s <= 6;

/**
 * Fallback hue for grayscale seeds
 * Blue for dark grays, violet for light grays (both UI-safe)
 */
const fallbackHueFromLightness = (l: number): number => (l < 50 ? 210 : 265);

/**
 * Mix two hues along shortest arc
 * Prevents weird color jumps across the wheel
 */
const mixHues = (h1: number, h2: number, weight = 0.5): number => {
  const diff = h2 - h1;
  const shortest = diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
  return modHue(h1 + shortest * weight);
};

/**
 * Adaptive saturation algorithm
 * Gentler curve prevents oversaturation in dark mode
 */
const calculateAdaptiveSaturation = (
  lightness: number,
  baseSaturation: number,
  isDark: boolean,
): number => {
  if (isDark) {
    // Gentler exponential decay for dark backgrounds
    // Power of 0.85 prevents over-desaturation
    const multiplier = Math.pow(lightness / 100, 0.85);
    return clamp(baseSaturation * multiplier, 1.5, 8);
  }
  // Light mode: bell curve centered at L=50
  const multiplier = 1 - Math.pow((lightness - 50) / 50, 2);
  return clamp(baseSaturation * multiplier, 2, 10);
};

/**
 * Tone preservation with scheme awareness
 * Keeps accents in usable UI ranges
 */
const tonePreservingMap = (
  base: HSLColor,
  targetHue: number,
  scheme: Scheme,
): HSLColor => {
  // Scheme-specific saturation adjustments
  let saturationBias = 0;
  let sMin = 35,
    sMax = 80;
  const lMin = 38,
    lMax = 62;

  switch (scheme) {
    case "complementary":
      saturationBias = -5; // Slightly desaturate to avoid jarring
      sMin = 40; // Ensure vibrant complements
      break;
    case "triadic":
      saturationBias = 5; // Boost for vibrancy
      break;
    case "analogous":
      saturationBias = 0; // Keep natural
      break;
    case "monochromatic":
      saturationBias = 10; // Need more variation
      sMax = 85; // Allow wider range
      break;
  }

  const s = clamp(base.s + saturationBias, sMin, sMax);
  const l = clamp(base.l, lMin, lMax);
  return { h: modHue(targetHue), s, l };
};

/**
 * Tinted neutral that avoids the perceptual dead zone
 * Returns different values for light/dark contexts
 */
const createTintedNeutral = (hue: number, scheme: Scheme): HSLColor => {
  const saturation = scheme === "monochromatic" ? 5 : 3;
  // L=42 works better across both light and dark themes
  // Avoids the L=45-55 perceptual dead zone
  return { h: modHue(hue), s: saturation, l: 42 };
};

/**
 * Smart accent hue selection
 * Avoids muddy colors and picks optimal harmony
 */
const getAccentHue = (baseHue: number, scheme: Scheme): number => {
  switch (scheme) {
    case "complementary":
      return rotateHue(baseHue, 180);

    case "triadic": {
      const option1 = rotateHue(baseHue, 120);
      const option2 = rotateHue(baseHue, 240);
      // Avoid muddy yellow-green range (60-140°)
      const isMuddy = (h: number) => h >= 60 && h <= 140;
      return isMuddy(option1) ? option2 : option1;
    }

    case "analogous": {
      // Zone-based selection for optimal results
      if (baseHue >= 60 && baseHue <= 140) {
        // Yellow-green zone: go back toward yellow
        return rotateHue(baseHue, -40);
      } else if (baseHue >= 0 && baseHue < 30) {
        // Red zone: context-aware
        return rotateHue(baseHue, baseHue < 15 ? 30 : -30);
      } else if (baseHue >= 240 && baseHue < 300) {
        // Blue-purple zone: prefer purple shift
        return rotateHue(baseHue, 35);
      }
      // Default: standard analogous
      return rotateHue(baseHue, 30);
    }

    case "monochromatic":
      return baseHue;

    default:
      return rotateHue(baseHue, 30);
  }
};

/**
 * Generate accessible, harmonious backgrounds
 * Optimized for both light and dark themes
 */
const createBackgrounds = (
  seedHue: number,
  accentHue: number,
  scheme: Scheme,
): { lightBg: HSLColor; darkBg: HSLColor } => {
  // Mix hues for subtle interest (reduced weights for subtlety)
  let bgHue = seedHue;
  switch (scheme) {
    case "complementary":
      // Very subtle mix to avoid color cast
      bgHue = mixHues(seedHue, accentHue, 0.1);
      break;
    case "triadic":
      // Slightly more mix for triadic
      bgHue = mixHues(seedHue, accentHue, 0.2);
      break;
    case "analogous":
      // Moderate mix for smooth transition
      bgHue = mixHues(seedHue, accentHue, 0.35);
      break;
    case "monochromatic":
    default:
      // No mixing needed
      bgHue = seedHue;
      break;
  }

  // Light background: optimal for readability
  const lightL = 98; // Slightly off-white prevents glare
  const lightBaseSat = scheme === "monochromatic" ? 5 : 3;
  const lightS = calculateAdaptiveSaturation(lightL, lightBaseSat, false);

  // Dark background: balanced for comfort and contrast
  const darkL = 8; // Industry standard (VS Code, Discord range)
  const darkBaseSat = scheme === "monochromatic" ? 10 : 6;
  const darkS = calculateAdaptiveSaturation(darkL, darkBaseSat, true);

  return {
    lightBg: { h: bgHue, s: lightS, l: lightL },
    darkBg: { h: bgHue, s: darkS, l: darkL },
  };
};

/**
 * Main palette generation function
 * Bulletproofed for production use
 */
export function generateHarmoniousPalette(
  seedHex: string,
  scheme: Scheme = "analogous",
): {
  accent: string;
  gray: string;
  lightBg: string;
  darkBg: string;
} {
  // Validate and parse input
  const baseHSL = hexToHSL(seedHex);

  // Handle edge cases
  if (!baseHSL || isNaN(baseHSL.h) || isNaN(baseHSL.s) || isNaN(baseHSL.l)) {
    // Fallback to safe default if parsing fails
    const fallback = "#3B82F6";
    const safeHSL = hexToHSL(fallback);
    return generateHarmoniousPalette(fallback, scheme);
  }

  // Handle grayscale seeds intelligently
  const seedHue = isNearGray(baseHSL.s)
    ? fallbackHueFromLightness(baseHSL.l)
    : baseHSL.h;

  // Generate accent with proper color theory
  const targetHue = getAccentHue(seedHue, scheme);
  const accentHSL =
    scheme === "monochromatic"
      ? tonePreservingMap({ ...baseHSL, h: seedHue }, seedHue, scheme)
      : tonePreservingMap(baseHSL, targetHue, scheme);

  // Generate supporting colors
  const grayHSL = createTintedNeutral(seedHue, scheme);
  const { lightBg, darkBg } = createBackgrounds(seedHue, targetHue, scheme);

  return {
    accent: hslToHex(accentHSL),
    gray: hslToHex(grayHSL),
    lightBg: hslToHex(lightBg),
    darkBg: hslToHex(darkBg),
  };
}
