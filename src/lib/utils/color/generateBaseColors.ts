import { Scheme } from "@/types";
import {
  generateHarmoniousPalette,
  getAllHarmonyColors,
} from "@/lib/utils/color/ColorTheory";
import { generateBackgroundsOKLCH } from "@/lib/utils/color/generateBackgrounds";
import { DEFAULT_HEX } from "@/lib/constants";

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
    /** Index of harmony color to use (for multi-color schemes) */
    harmonyColorIndex?: number;
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
  const harmonyColorIndex = opts?.harmonyColorIndex ?? 0;
  const seed = normalizeHex(brandColor) ?? DEFAULT_HEX;

  // Get the base palette (gray, backgrounds)
  const { gray, lightBg, darkBg } = generateHarmoniousPalette(seed, scheme, {
    pureColorTheory,
  });

  // Get the selected harmony color using the index
  let accent: string;
  if (useHarmonized) {
    const harmonyColors = getAllHarmonyColors(seed, scheme, pureColorTheory);
    // Use the selected index, or fall back to recommended
    const colorIndex = Math.min(
      harmonyColorIndex,
      harmonyColors.colors.length - 1,
    );
    accent = harmonyColors.colors[colorIndex]?.hex ?? seed;
  } else {
    accent = seed;
  }

  // Use OKLCH-based background generation for better perceptual uniformity
  if (useOKLCH) {
    const { lightBackground, darkBackground } = generateBackgroundsOKLCH(
      seed,
      accent,
      scheme,
    );

    return {
      accent,
      gray,
      lightBackground,
      darkBackground,
    };
  }

  // Fallback to HSL-based backgrounds
  return {
    accent,
    gray,
    lightBackground: lightBg,
    darkBackground: darkBg,
  };
}
