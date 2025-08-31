import { PaletteData, Scheme } from "@/types";
import { generateBaseColors } from "@/lib/utils/color/generateBaseColors";
import { generateRadixColors } from "@/components/radix/generateRadixColors";
import { RadixColorTheme } from "@/types/radix";

interface GeneratePalette {
  hex: string;
  scheme?: Scheme;
  harmonized?: boolean;
}
export function generatePalette({
  harmonized = false,
  hex,
  scheme,
}: GeneratePalette): PaletteData {
  const baseColors = generateBaseColors(hex, scheme, { harmonized });

  const light = generateRadixColors({
    appearance: "light",
    accent: baseColors.accent,
    gray: baseColors.gray,
    background: baseColors.lightBackground,
  });

  const dark = generateRadixColors({
    appearance: "dark",
    accent: baseColors.accent,
    gray: baseColors.gray,
    background: baseColors.darkBackground,
  });

  return {
    accent: baseColors.accent,
    gray: baseColors.gray,
    lightBackground: baseColors.lightBackground,
    darkBackground: baseColors.darkBackground,
    accentScale: {
      light: light.accentScale,
      dark: dark.accentScale,
    },
    grayScale: {
      light: light.grayScale,
      dark: dark.grayScale,
    },

    accentScaleAlpha: {
      light: light.accentScaleAlpha,
      dark: dark.accentScaleAlpha,
    },
    grayScaleAlpha: {
      light: light.grayScaleAlpha,
      dark: dark.grayScaleAlpha,
    },

    radixOriginalLight: light as RadixColorTheme,
    radixOriginalDark: dark as RadixColorTheme,
  };
}
