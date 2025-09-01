import { Scheme } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";
import { HSLColor, hslToHex } from "@/lib/utils/color/colorConverters";

/**
 * Utility functions for color manipulation
 */
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const rotateHue = (h: number, delta: number) =>
  (((h + delta) % 360) + 360) % 360;

/**
 * Preserves the "tone quality" of original color when shifting hue
 * Ensures resulting colors maintain usable saturation/lightness ranges
 */
const preserveTone = (
  original: HSLColor,
  newHue: number,
  saturationBias = 0,
): HSLColor => ({
  h: newHue,
  s: clamp(original.s + saturationBias, 20, 90),
  l: clamp(original.l, 25, 75),
});

/**
 * Creates a tinted neutral that maintains palette temperature
 * Perfect for generating cohesive gray scales
 */
const createTintedNeutral = (hue: number): HSLColor => ({
  h: hue,
  s: 4, // Just enough to avoid "dead" gray
  l: 52, // Mid-range for versatile scaling
});

/**
 * Generate harmonious light/dark backgrounds
 * Darker backgrounds now properly dark (L: 4-5)
 */
const createBackgrounds = (
  hue: number,
  scheme: Scheme,
): { lightBg: HSLColor; darkBg: HSLColor } => {
  // Adjust saturation based on scheme for better cohesion
  const lightSaturation = scheme === "monochromatic" ? 12 : 8;
  const darkSaturation = scheme === "monochromatic" ? 20 : 14;

  return {
    lightBg: { h: hue, s: lightSaturation, l: 97 },
    darkBg: { h: hue, s: darkSaturation, l: 5 }, // Much darker!
  };
};

/**
 * Main palette generation based on color scheme
 */
export function generateHarmoniousPalette(
  baseColor: string,
  scheme: Scheme = "analogous",
): {
  accent: string;
  gray: string;
  lightBg: string;
  darkBg: string;
} {
  const baseHSL = hexToHSL(baseColor);

  let accentHSL: HSLColor;
  let backgroundHue: number = baseHSL.h;

  switch (scheme) {
    case "complementary": {
      // True complementary: accent IS the complement
      const complementHue = rotateHue(baseHSL.h, 180);
      accentHSL = preserveTone(baseHSL, complementHue, 5);
      // Mix hues for backgrounds to avoid jarring contrast
      backgroundHue = baseHSL.h;
      break;
    }

    case "triadic": {
      // First triadic color as accent (120° rotation)
      const triadicHue = rotateHue(baseHSL.h, 120);
      accentHSL = preserveTone(baseHSL, triadicHue, 8);
      // Use base hue for backgrounds for stability
      backgroundHue = baseHSL.h;
      break;
    }

    case "analogous": {
      // Adjacent color with smart direction selection
      // Avoid muddy yellow-greens (60-140°)
      const isInMuddyRange = baseHSL.h >= 60 && baseHSL.h <= 140;
      const rotation = isInMuddyRange ? -35 : 35;
      const analogousHue = rotateHue(baseHSL.h, rotation);
      accentHSL = preserveTone(baseHSL, analogousHue, 3);
      backgroundHue = baseHSL.h;
      break;
    }

    case "monochromatic":
    default: {
      // Same hue, enhanced saturation for vibrancy
      const saturationBoost = baseHSL.s < 40 ? 15 : 8;
      accentHSL = {
        h: baseHSL.h,
        s: clamp(baseHSL.s + saturationBoost, 25, 85),
        l: clamp(baseHSL.l, 35, 65),
      };
      backgroundHue = baseHSL.h;
      break;
    }
  }

  const grayHSL = createTintedNeutral(baseHSL.h);
  const { lightBg, darkBg } = createBackgrounds(backgroundHue, scheme);

  return {
    accent: hslToHex(accentHSL),
    gray: hslToHex(grayHSL),
    lightBg: hslToHex(lightBg),
    darkBg: hslToHex(darkBg),
  };
}
