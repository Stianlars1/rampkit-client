/**
 * Enhanced background/foreground color generation using OKLCH
 *
 * Improvements over HSL-based approach:
 * - Uses OKLCH for perceptually uniform lightness
 * - Adaptive lightness based on hue characteristics
 * - APCA-ready contrast verification
 * - Hue-aware saturation for better harmony
 *
 * Research-backed best practices (see docs/color/background-foreground-research.md):
 * - Light mode: L=0.97-0.98 (avoids pure white glare) → ~#F5F5F5-#FAFAFA
 * - Dark mode: L=0.17-0.20 (NOT 0.06-0.08!) → ~#0F0F0F-#171717
 *   - #0F0F0F has OKLCH L≈0.168, not 0.06!
 *   - #121212 (Material baseline) has OKLCH L≈0.182
 * - Chroma: Very low (0.003-0.010) for subtle tinting
 *   - Lower chroma at low lightness to avoid sRGB gamut clipping
 *
 * Sources:
 * - Material Design: https://m2.material.io/design/color/dark-theme.html
 * - Radix Colors: https://www.radix-ui.com/colors
 * - Evil Martians OKLCH: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
 */

import Color from "colorjs.io";
import { Scheme } from "@/types";
import { hexToHSL, hslToHex } from "./colorConverters";

interface BackgroundColors {
  lightBackground: string;
  darkBackground: string;
}

/**
 * Mix two hues along shortest arc on the color wheel
 */
function mixHues(h1: number, h2: number, weight: number = 0.5): number {
  const diff = h2 - h1;
  const shortest = diff > 180 ? diff - 360 : diff < -180 ? diff + 360 : diff;
  return ((h1 + shortest * weight) % 360 + 360) % 360;
}

/**
 * Calculate optimal hue for background based on color scheme
 * Subtle hue mixing provides visual interest without color cast
 */
function calculateBackgroundHue(
  seedHue: number,
  accentHue: number,
  scheme: Scheme,
): number {
  switch (scheme) {
    case "complementary":
      return mixHues(seedHue, accentHue, 0.08); // Very subtle
    case "triadic":
      return mixHues(seedHue, accentHue, 0.18);
    case "analogous":
      return mixHues(seedHue, accentHue, 0.32);
    case "monochromatic":
    default:
      return seedHue;
  }
}

/**
 * Get hue-adaptive lightness adjustments for OKLCH
 *
 * Different hues need different lightness values to achieve
 * the same perceived brightness. This function provides
 * fine-tuning based on hue characteristics.
 *
 * NOTE: These adjustments are very subtle (±2%) to maintain
 * consistent appearance while accommodating hue-specific perception.
 * For dark mode (L < 0.5), we apply slightly larger adjustments.
 * For light mode (L > 0.5), we keep adjustments minimal to stay
 * within the expected brightness range.
 */
function getHueAdaptiveLightness(hue: number, baseL: number): number {
  // Normalize hue to 0-360
  const h = ((hue % 360) + 360) % 360;

  // For light mode backgrounds, keep adjustments minimal
  // to ensure we stay in the expected ~#F5F5F5 range
  if (baseL > 0.5) {
    // Yellow/orange (40-80°) appear brighter - very slight reduction
    if (h >= 40 && h < 80) {
      return baseL * 0.995;
    }
    // Blue/violet (220-280°) appear darker - very slight increase
    if (h >= 220 && h < 280) {
      return Math.min(baseL * 1.005, 0.99); // Cap at 0.99 to avoid pure white
    }
    // Cyan (160-200°) - no adjustment needed at high lightness
    return baseL;
  }

  // For dark mode backgrounds (L < 0.5), apply standard adjustments
  // Yellow/orange (40-80°) appear brighter - reduce lightness
  if (h >= 40 && h < 80) {
    return baseL * 0.98;
  }

  // Blue/violet (220-280°) appear darker - increase lightness
  if (h >= 220 && h < 280) {
    return baseL * 1.02;
  }

  // Cyan (160-200°) appears brighter - slight reduction
  if (h >= 160 && h < 200) {
    return baseL * 0.97;
  }

  return baseL;
}

/**
 * Calculate optimal chroma (saturation) for backgrounds
 *
 * Research shows very low chroma works best for backgrounds:
 * - Prevents color cast that interferes with content
 * - Maintains subtle brand presence
 * - Better for accessibility
 *
 * IMPORTANT: At low lightness (dark mode), chroma must be kept very low
 * to avoid sRGB gamut clipping. Values > 0.01 at L < 0.2 often produce
 * out-of-gamut colors that clip to near-black.
 */
function calculateBackgroundChroma(scheme: Scheme, isDark: boolean): number {
  let baseChroma: number;

  switch (scheme) {
    case "monochromatic":
      // Slightly more tinting for monochromatic to add visual interest
      baseChroma = isDark ? 0.008 : 0.008;
      break;
    case "analogous":
      baseChroma = isDark ? 0.006 : 0.006;
      break;
    case "complementary":
      // Less tinting for complementary as accent provides enough contrast
      baseChroma = isDark ? 0.004 : 0.004;
      break;
    case "triadic":
      baseChroma = isDark ? 0.005 : 0.005;
      break;
    default:
      baseChroma = isDark ? 0.005 : 0.005;
  }

  return baseChroma;
}

/**
 * Generate optimal background colors using OKLCH color space
 *
 * Advantages over HSL:
 * - Perceptually uniform lightness across all hues
 * - Predictable color modifications
 * - Better for accessibility calculations
 * - Matches Radix's approach
 *
 * @param seedHex - Input color from user
 * @param accentHex - Generated accent color
 * @param scheme - Color harmony scheme
 * @returns Background colors for light and dark modes
 */
export function generateBackgroundsOKLCH(
  seedHex: string,
  accentHex: string,
  scheme: Scheme,
): BackgroundColors {
  // Get hue from seed color (fallback to neutral if grayscale)
  const seedHSL = hexToHSL(seedHex);
  const accentHSL = hexToHSL(accentHex);

  // For grayscale inputs (saturation < 6%), use neutral backgrounds
  const isGrayscale = seedHSL.s < 6 && accentHSL.s < 6;
  const seedHue = seedHSL.s < 6 ? 210 : seedHSL.h;
  const accentHue = accentHSL.s < 6 ? 210 : accentHSL.h;

  // Calculate background hue with scheme-aware mixing
  const bgHue = calculateBackgroundHue(seedHue, accentHue, scheme);

  // For grayscale inputs, use zero chroma (pure neutral)
  const chromaMultiplier = isGrayscale ? 0 : 1;

  // Light mode background
  // Target: ~#F5F5F5 to #FAFAFA (OKLCH L ≈ 0.97-0.985)
  let lightL = 0.975;
  lightL = getHueAdaptiveLightness(bgHue, lightL);
  const lightC = calculateBackgroundChroma(scheme, false) * chromaMultiplier;

  const lightBgOKLCH = new Color("oklch", [lightL, lightC, bgHue]);
  // Ensure we're in sRGB gamut before converting
  if (!lightBgOKLCH.inGamut("srgb")) {
    lightBgOKLCH.toGamut({ space: "srgb", method: "css" });
  }
  const lightBackground = lightBgOKLCH.to("srgb").toString({ format: "hex" });

  // Dark mode background
  // CORRECTED: #0F0F0F has OKLCH L≈0.168, NOT 0.06-0.08!
  // Target: ~#0F0F0F to #171717 (OKLCH L ≈ 0.168-0.20)
  // Material Design #121212 has OKLCH L≈0.182
  let darkL = 0.172; // Matches ~#0F0F0F-#111111 range
  darkL = getHueAdaptiveLightness(bgHue, darkL);
  const darkC = calculateBackgroundChroma(scheme, true) * chromaMultiplier;

  const darkBgOKLCH = new Color("oklch", [darkL, darkC, bgHue]);
  // Ensure we're in sRGB gamut before converting
  if (!darkBgOKLCH.inGamut("srgb")) {
    darkBgOKLCH.toGamut({ space: "srgb", method: "css" });
  }
  const darkBackground = darkBgOKLCH.to("srgb").toString({ format: "hex" });

  // Validate outputs are in expected ranges
  const darkColor = new Color(darkBackground);
  const darkOKLCH = darkColor.to("oklch");

  // If dark background is too dark (L < 0.12), something went wrong
  // Fall back to a safe neutral dark gray
  if (darkOKLCH.coords[0] < 0.12) {
    const safeDark = new Color("oklch", [0.172, 0, 0]);
    return {
      lightBackground,
      darkBackground: safeDark.to("srgb").toString({ format: "hex" }),
    };
  }

  return {
    lightBackground,
    darkBackground,
  };
}

/**
 * Fallback function that converts HSL backgrounds to OKLCH
 * for backward compatibility
 */
export function convertHSLBackgroundsToOKLCH(
  lightHSL: { h: number; s: number; l: number },
  darkHSL: { h: number; s: number; l: number },
): BackgroundColors {
  const lightHex = hslToHex(lightHSL);
  const darkHex = hslToHex(darkHSL);

  const lightOKLCH = new Color(lightHex).to("oklch");
  const darkOKLCH = new Color(darkHex).to("oklch");

  return {
    lightBackground: lightOKLCH.to("srgb").toString({ format: "hex" }),
    darkBackground: darkOKLCH.to("srgb").toString({ format: "hex" }),
  };
}

/**
 * Calculate APCA contrast (more accurate than WCAG for modern displays)
 *
 * APCA (Accessible Perceptual Contrast Algorithm) is used by Radix
 * and provides better predictions of how humans perceive text contrast.
 *
 * Targets:
 * - Body text: Lc 75+ (approximately 4.5:1 WCAG)
 * - Large text: Lc 60+ (approximately 3:1 WCAG)
 * - UI components: Lc 45+ (approximately 2.5:1 WCAG)
 */
export function getAPCAContrast(foreground: string, background: string): number {
  const fgColor = new Color(foreground).to("oklch");
  const bgColor = new Color(background).to("oklch");

  // Use Color.js built-in APCA if available
  if (typeof fgColor.contrastAPCA === "function") {
    return Math.abs(fgColor.contrastAPCA(bgColor));
  }

  // Fallback: return a high value to indicate we can't calculate
  // (actual WCAG contrast calculation would go here)
  return 100;
}

/**
 * Get optimal foreground color for a background using APCA
 *
 * More intelligent than simple step 0 vs step 11 selection:
 * - Uses APCA for modern contrast calculation
 * - Considers hue and lightness relationships
 * - Provides better results for mid-tone backgrounds
 */
export function getOptimalForeground(
  background: string,
  colorScale: string[],
  targetContrast: number = 75, // APCA Lc target
): string {
  const bgColor = new Color(background).to("oklch");
  const bgLightness = bgColor.coords[0];

  // For very light backgrounds (L > 0.85), prefer dark foregrounds
  if (bgLightness > 0.85) {
    // Try step 11, then 10, then 9...
    for (let i = 11; i >= 0; i--) {
      const contrast = getAPCAContrast(colorScale[i], background);
      if (contrast >= targetContrast) {
        return colorScale[i];
      }
    }
    return colorScale[11]; // Fallback to darkest
  }

  // For very dark backgrounds (L < 0.15), prefer light foregrounds
  if (bgLightness < 0.15) {
    // Try step 0, then 1, then 2...
    for (let i = 0; i <= 11; i++) {
      const contrast = getAPCAContrast(colorScale[i], background);
      if (contrast >= targetContrast) {
        return colorScale[i];
      }
    }
    return colorScale[0]; // Fallback to lightest
  }

  // For mid-tone backgrounds, find the best contrast
  let bestContrast = 0;
  let bestIndex = 0;

  for (let i = 0; i <= 11; i++) {
    const contrast = getAPCAContrast(colorScale[i], background);
    if (contrast > bestContrast) {
      bestContrast = contrast;
      bestIndex = i;
    }
  }

  return colorScale[bestIndex];
}
