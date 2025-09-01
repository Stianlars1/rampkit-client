import { Scheme } from "@/types";
import { generateHarmoniousPalette } from "@/lib/utils/color/ColorTheory";

function normalizeHex(input?: string | null): string | null {
  if (!input) return null;
  let v = input.trim();
  if (v.startsWith("0x")) v = v.slice(2);
  if (!v.startsWith("#")) v = `#${v}`;
  if (v.length === 4) {
    const r = v[1],
      g = v[2],
      b = v[3];
    v = `#${r}${r}${g}${g}${b}${b}`;
  }
  return /^#([0-9a-fA-F]{6})$/.test(v) ? v.toUpperCase() : null;
}

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
  const useHarmonized = opts?.harmonized ?? true;
  const seed = normalizeHex(brandColor) ?? "#3B82F6"; // safe default

  const { accent, gray, lightBg, darkBg } = generateHarmoniousPalette(
    seed,
    scheme,
  );

  return {
    accent: useHarmonized ? accent : seed,
    gray,
    lightBackground: lightBg,
    darkBackground: darkBg,
  };
}
