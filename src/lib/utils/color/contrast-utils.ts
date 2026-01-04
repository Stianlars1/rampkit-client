import { hexToRGB } from "@/lib/utils/color-utils";

// WCAG AA minimum contrast ratios
const WCAG_AA_NORMAL_TEXT = 4.5;
const WCAG_AA_LARGE_TEXT = 3.0;

/**
 * Calculate relative luminance (WCAG 2.1 formula)
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

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Result from getBestForeground with metadata about the chosen color
 */
export interface ForegroundResult {
  /** The foreground color to use */
  color: string;
  /** The contrast ratio achieved */
  contrast: number;
  /** Where the color came from */
  source: "accent" | "gray" | "white" | "black";
  /** Step index if from a scale (undefined for white/black) */
  step?: number;
}

/**
 * Find the best foreground color that meets WCAG AA contrast requirements.
 *
 * Search order:
 * 1. All steps in accent scale (prefer brand colors)
 * 2. All steps in gray scale (neutral fallback)
 * 3. Pure white or black (always meets contrast)
 *
 * @param background - Background color hex
 * @param accentScale - 12-step accent color scale
 * @param grayScale - 12-step gray color scale
 * @param minContrast - Minimum contrast ratio (default 4.5 for WCAG AA normal text)
 */
export function getBestForeground(
  background: string,
  accentScale: string[],
  grayScale: string[],
  minContrast: number = WCAG_AA_NORMAL_TEXT,
): ForegroundResult {
  // Helper to find best step in a scale
  const findBestInScale = (
    scale: string[],
    source: "accent" | "gray",
  ): ForegroundResult | null => {
    let bestStep = -1;
    let bestContrast = 0;

    for (let i = 0; i < scale.length; i++) {
      const contrast = getContrastRatio(background, scale[i]);
      if (contrast > bestContrast) {
        bestContrast = contrast;
        bestStep = i;
      }
    }

    // Only return if meets minimum contrast
    if (bestContrast >= minContrast && bestStep >= 0) {
      return {
        color: scale[bestStep],
        contrast: bestContrast,
        source,
        step: bestStep,
      };
    }
    return null;
  };

  // 1. Try accent scale first (brand consistency)
  const accentResult = findBestInScale(accentScale, "accent");
  if (accentResult) return accentResult;

  // 2. Try gray scale (neutral fallback)
  const grayResult = findBestInScale(grayScale, "gray");
  if (grayResult) return grayResult;

  // 3. Fallback to white or black (always works)
  const whiteContrast = getContrastRatio(background, "#FFFFFF");
  const blackContrast = getContrastRatio(background, "#000000");

  if (whiteContrast > blackContrast) {
    return {
      color: "#FFFFFF",
      contrast: whiteContrast,
      source: "white",
    };
  }
  return {
    color: "#000000",
    contrast: blackContrast,
    source: "black",
  };
}

/**
 * @deprecated Use getBestForeground() instead which ensures WCAG AA compliance.
 *
 * Returns either 0 or 11 - whichever step has better contrast with background.
 * Does NOT guarantee WCAG compliance.
 */
export function getBestForegroundStep(
  backgroundHex: string,
  colorScale: string[],
  isSubtle: boolean = false,
): number {
  const step0Contrast = getContrastRatio(backgroundHex, colorScale[0]);
  const step11Contrast = getContrastRatio(
    backgroundHex,
    isSubtle ? colorScale[10] : colorScale[11],
  );

  return step0Contrast > step11Contrast ? 0 : isSubtle ? 10 : 11;
}
