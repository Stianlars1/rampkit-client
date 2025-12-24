import { Scheme } from "@/types";
import { generateHarmoniousPalette } from "@/lib/utils/color/ColorTheory";
import { generateBackgroundsOKLCH } from "@/lib/utils/color/generateBackgrounds";

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
  opts?: {
    harmonized?: boolean;
    useOKLCH?: boolean;
    pureColorTheory?: boolean;
  },
): {
  accent: string;
  gray: string;
  lightBackground: string;
  darkBackground: string;
} {
  const useHarmonized = opts?.harmonized ?? true;
  const useOKLCH = opts?.useOKLCH ?? true;
  const pureColorTheory = opts?.pureColorTheory ?? false;
  const seed = normalizeHex(brandColor) ?? "#3B82F6";

  const { accent, gray, lightBg, darkBg } = generateHarmoniousPalette(
    seed,
    scheme,
    { pureColorTheory },
  );

  // Use OKLCH-based background generation for better perceptual uniformity
  if (useOKLCH) {
    const accentColor = useHarmonized ? accent : seed;
    const { lightBackground, darkBackground } = generateBackgroundsOKLCH(
      seed,
      accentColor,
      scheme,
    );

    return {
      accent: accentColor,
      gray,
      lightBackground,
      darkBackground,
    };
  }

  // Fallback to HSL-based backgrounds
  return {
    accent: useHarmonized ? accent : seed,
    gray,
    lightBackground: lightBg,
    darkBackground: darkBg,
  };
}
