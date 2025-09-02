import { hexToRGB } from "@/lib/utils/color-utils";

/**
 * Calculate relative luminance (simplified WCAG formula)
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
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns either 0 or 11 - whichever step has better contrast with background
 */
export function getBestForegroundStep(
  backgroundHex: string,
  colorScale: string[],
): number {
  const step0Contrast = getContrastRatio(backgroundHex, colorScale[0]);
  const step11Contrast = getContrastRatio(backgroundHex, colorScale[11]);

  return step0Contrast > step11Contrast ? 0 : 11;
}
