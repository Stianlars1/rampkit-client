import { generateRadixColors } from "@/components/radix/generateRadixColors";
import { hexToHSL, hslToHex } from "@/lib/utils/color/colorConverters";
import { getBestForegroundStep } from "@/lib/utils/color/contrast-utils";
import { hexToRGB } from "@/lib/utils/color-utils";

/**
 * Semantic color target hues (in degrees)
 * These are starting points - actual hues are calculated dynamically to avoid conflicts
 */
const SEMANTIC_HUES = {
  success: 140, // Green
  danger: 10, // Red
  warning: 35, // Orange/Amber
  info: 215, // Blue
} as const;

type SemanticColorType = keyof typeof SEMANTIC_HUES;

/**
 * A simplified semantic color set (not a full 12-step scale)
 * Follows shadcn/ui patterns for semantic colors
 */
export interface SemanticColorSet {
  base: string; // Primary solid color (Radix step 9)
  foreground: string; // Text color on base background
  muted: string; // Subtle background (Radix step 3)
  mutedForeground: string; // Text color on muted background
  border: string; // Border color (Radix step 7)
}

/**
 * All semantic colors for a single theme (light or dark)
 */
export interface SemanticColors {
  success: SemanticColorSet;
  danger: SemanticColorSet;
  warning: SemanticColorSet;
  info: SemanticColorSet;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRGB(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate shortest distance between two hues on the color wheel
 */
function hueDistance(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
}

/**
 * Dynamically calculate optimal hue that avoids conflicts with accent
 * If target hue is too close to accent, shift it to maintain distinction
 */
function calculateOptimalHue(
  targetHue: number,
  accentHue: number,
  minDistance: number = 35,
): number {
  const distance = hueDistance(targetHue, accentHue);

  // If far enough apart, use target directly
  if (distance >= minDistance) {
    return targetHue;
  }

  // Need to shift - calculate both directions
  const shift1 = (targetHue + minDistance) % 360;
  const shift2 = (targetHue - minDistance + 360) % 360;

  // Choose direction that maximizes distance from accent
  const dist1 = hueDistance(shift1, accentHue);
  const dist2 = hueDistance(shift2, accentHue);

  // Also avoid the muddy yellow-green zone (60-140°) when shifting
  const isMuddy1 = shift1 >= 60 && shift1 <= 140;
  const isMuddy2 = shift2 >= 60 && shift2 <= 140;

  if (isMuddy1 && !isMuddy2) return shift2;
  if (isMuddy2 && !isMuddy1) return shift1;

  return dist1 > dist2 ? shift1 : shift2;
}

/**
 * Avoid the muddy yellow-green zone (60-140°) that ColorTheory identifies
 * If we land in this zone, shift to cleaner alternatives
 */
function avoidMuddyZone(hue: number, type: SemanticColorType): number {
  // If in muddy zone
  if (hue >= 60 && hue <= 140) {
    // For success (green), use cleaner green
    if (type === "success") {
      return 145; // Clean kelly green
    }
    // For warning (should be orange), shift warmer
    if (type === "warning") {
      return 35; // Clean orange
    }
  }
  return hue;
}

/**
 * Generate base semantic color with appropriate saturation and lightness
 * Handles edge cases: grayscale, near-white, near-black, already-semantic
 */
function generateSemanticBase(
  type: SemanticColorType,
  accentHex: string,
  accentHue: number,
): string {
  const targetHue = SEMANTIC_HUES[type];
  const accentHSL = hexToHSL(accentHex);

  // Calculate optimal hue avoiding conflicts
  let optimalHue = calculateOptimalHue(targetHue, accentHue);
  optimalHue = avoidMuddyZone(optimalHue, type);

  // Handle edge cases for saturation
  const isGrayscale = accentHSL.s < 6;
  const isNearWhite = accentHSL.l > 95;
  const isNearBlack = accentHSL.l < 5;

  // Base saturation: use moderate-high saturation for semantic clarity
  let saturation: number;
  if (isGrayscale || isNearWhite || isNearBlack) {
    // For grayscale/extreme lightness inputs, use strong saturation
    saturation = 68;
  } else {
    // Reference accent saturation, but ensure semantic colors are saturated enough
    saturation = Math.max(55, Math.min(75, accentHSL.s + 10));
  }

  // Base lightness: mid-range for good contrast potential
  // Success slightly lighter, danger slightly darker for psychological effect
  let lightness: number;
  switch (type) {
    case "success":
      lightness = 52;
      break;
    case "danger":
      lightness = 48;
      break;
    case "warning":
      lightness = 50;
      break;
    case "info":
      lightness = 51;
      break;
  }

  return hslToHex({ h: optimalHue, s: saturation, l: lightness });
}

/**
 * Generate a complete semantic color set for one type (success/danger/warning/info)
 * Uses Radix color generation to ensure perceptual balance and WCAG compliance
 */
function generateSemanticColorSet(
  type: SemanticColorType,
  accentHex: string,
  grayHex: string,
  backgroundHex: string,
  appearance: "light" | "dark",
): SemanticColorSet {
  const accentHSL = hexToHSL(accentHex);

  // Handle grayscale accent - use fallback hue
  const accentHue = accentHSL.s < 6 ? 210 : accentHSL.h;

  // Generate base semantic color with optimal hue
  const semanticBaseHex = generateSemanticBase(type, accentHex, accentHue);

  // Use Radix color generation to create perceptually-balanced 12-step scale
  // This ensures consistency with the rest of the palette
  const radixScale = generateRadixColors({
    appearance,
    accent: semanticBaseHex,
    gray: grayHex,
    background: backgroundHex,
  });

  // Extract specific steps from the generated scale
  const base = radixScale.accentScale[8]; // Step 9 (index 8) - solid color for buttons/badges
  const muted = radixScale.accentScale[2]; // Step 3 (index 2) - subtle background
  const border = radixScale.accentScale[6]; // Step 7 (index 6) - border color

  // Calculate best foreground colors for WCAG AA contrast (4.5:1)
  // getBestForegroundStep automatically selects step 0 or 11 based on contrast
  let foregroundStep = getBestForegroundStep(base, radixScale.accentScale);
  let foreground = radixScale.accentScale[foregroundStep];

  // Verify WCAG AA compliance (4.5:1) and adjust if needed
  let baseForegroundContrast = getContrastRatio(base, foreground);
  if (baseForegroundContrast < 4.5) {
    // Try the opposite extreme (step 0 vs step 11)
    foregroundStep = foregroundStep === 0 ? 11 : 0;
    foreground = radixScale.accentScale[foregroundStep];
    baseForegroundContrast = getContrastRatio(base, foreground);

    // If still not enough contrast, force pure white or pure black
    // Use luminance for more accurate determination than HSL lightness
    if (baseForegroundContrast < 4.5) {
      const baseLuminance = getLuminance(base);
      // Luminance threshold of 0.18 is equivalent to approximately L=50
      foreground = baseLuminance > 0.18 ? "#000000" : "#FFFFFF";
    }
  }

  let mutedForegroundStep = getBestForegroundStep(
    muted,
    radixScale.accentScale,
  );
  let mutedForeground = radixScale.accentScale[mutedForegroundStep];

  // Verify WCAG AA compliance for muted foreground
  let mutedContrast = getContrastRatio(muted, mutedForeground);
  if (mutedContrast < 4.5) {
    // Try the opposite extreme
    mutedForegroundStep = mutedForegroundStep === 0 ? 11 : 0;
    mutedForeground = radixScale.accentScale[mutedForegroundStep];
    mutedContrast = getContrastRatio(muted, mutedForeground);

    // If still not enough contrast, use gray scale extremes
    if (mutedContrast < 4.5) {
      const mutedLuminance = getLuminance(muted);
      mutedForeground =
        mutedLuminance > 0.18
          ? radixScale.grayScale[11]
          : radixScale.grayScale[0];
    }
  }

  return {
    base,
    foreground,
    muted,
    mutedForeground,
    border,
  };
}

/**
 * Generate all semantic colors (success, danger, warning, info) for both light and dark modes
 *
 * @param accentHex - Main accent color from palette
 * @param grayHex - Gray color from palette
 * @param lightBackgroundHex - Light mode background
 * @param darkBackgroundHex - Dark mode background
 * @returns Semantic colors for both themes, algorithmically generated and WCAG AA compliant
 */
export function generateSemanticColors(
  accentHex: string,
  grayHex: string,
  lightBackgroundHex: string,
  darkBackgroundHex: string,
): {
  light: SemanticColors;
  dark: SemanticColors;
} {
  const semanticTypes: SemanticColorType[] = [
    "success",
    "danger",
    "warning",
    "info",
  ];

  const light = {} as SemanticColors;
  const dark = {} as SemanticColors;

  for (const type of semanticTypes) {
    light[type] = generateSemanticColorSet(
      type,
      accentHex,
      grayHex,
      lightBackgroundHex,
      "light",
    );

    dark[type] = generateSemanticColorSet(
      type,
      accentHex,
      grayHex,
      darkBackgroundHex,
      "dark",
    );
  }

  return { light, dark };
}
