import { Scheme } from "@/types";
import { generateHarmoniousPalette } from "@/lib/utils/color/ColorTheory";

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
  const normalize = (raw?: string): string | undefined => {
    if (!raw) return undefined;
    const cleaned = raw.trim().replace(/^#/, "").toUpperCase();
    if (/^[0-9A-F]{6}$/.test(cleaned)) return `#${cleaned}`;
    if (/^[0-9A-F]{3}$/.test(cleaned)) {
      const [r, g, b] = cleaned.split("");
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return undefined;
  };

  const useHarmonized = !!opts?.harmonized;

  const seed = normalize(brandColor) ?? "#3B82F6";
  const theory = generateHarmoniousPalette(seed, scheme);

  return {
    accent: useHarmonized ? theory.accent : seed,
    gray: theory.gray,
    lightBackground: theory.lightBg,
    darkBackground: theory.darkBg,
  };
}
