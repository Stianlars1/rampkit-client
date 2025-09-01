import { Scheme } from "@/types";
import { generateHarmoniousPalette } from "@/lib/utils/color/ColorTheory";

/**
 * Generate base colors for palette creation
 *
 * @param brandColor - Hex color to use as base
 * @param scheme - Color harmony scheme to apply
 * @param opts.harmonized - Whether to use harmonized accent or original brand
 */
export function generateBaseColors(
  brandColor?: string,
  scheme: Scheme = "analogous",
  opts?: { harmonized?: boolean },
): {
  accent: string;
  gray: string;
  lightBackground: string;
  darkBackground: string;
} {
  const normalizeHex = (raw?: string): string | undefined => {
    if (!raw) return undefined;

    const cleaned = raw.trim().replace(/^#/, "").toUpperCase();

    // Handle 3-char hex
    if (/^[0-9A-F]{3}$/.test(cleaned)) {
      const [r, g, b] = cleaned.split("");
      return `#${r}${r}${g}${g}${b}${b}`;
    }

    // Handle 6-char hex
    if (/^[0-9A-F]{6}$/.test(cleaned)) {
      return `#${cleaned}`;
    }

    return undefined;
  };

  const useHarmonized = opts?.harmonized ?? true; // Default to harmonized
  const seed = normalizeHex(brandColor) ?? "#3B82F6"; // Tailwind blue-500

  const palette = generateHarmoniousPalette(seed, scheme);

  return {
    accent: useHarmonized ? palette.accent : seed,
    gray: palette.gray,
    lightBackground: palette.lightBg,
    darkBackground: palette.darkBg,
  };
}
