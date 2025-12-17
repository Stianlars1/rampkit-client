import { PaletteData, Scheme } from "@/types";
import { generateBaseColors } from "@/lib/utils/color/generateBaseColors";
import { generateRadixColors } from "@/components/radix/generateRadixColors";
import { generateSemanticColors } from "@/lib/utils/color/generateSemanticColors";
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
  const baseColorsAnalogous = generateBaseColors(hex, "analogous", {
    harmonized: true,
  });

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

  const lightAnalogous = generateRadixColors({
    appearance: "light",
    accent: baseColorsAnalogous.accent,
    gray: baseColorsAnalogous.gray,
    background: baseColorsAnalogous.lightBackground,
  });
  const darkAnalogous = generateRadixColors({
    appearance: "dark",
    accent: baseColorsAnalogous.accent,
    gray: baseColorsAnalogous.gray,
    background: baseColorsAnalogous.darkBackground,
  });

  // Generate semantic colors (success, danger, warning, info)
  const semanticColors = generateSemanticColors(
    baseColors.accent,
    baseColors.gray,
    baseColors.lightBackground,
    baseColors.darkBackground,
  );

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

    analogous: {
      accent: baseColorsAnalogous.accent,
      gray: baseColorsAnalogous.gray,
      lightBackground: baseColorsAnalogous.lightBackground,
      darkBackground: baseColorsAnalogous.darkBackground,
      accentScale: {
        light: lightAnalogous.accentScale,
        dark: darkAnalogous.accentScale,
      },
      grayScale: {
        light: lightAnalogous.grayScale,
        dark: darkAnalogous.grayScale,
      },
      accentScaleAlpha: {
        light: lightAnalogous.accentScaleAlpha,
        dark: darkAnalogous.accentScaleAlpha,
      },
      grayScaleAlpha: {
        light: lightAnalogous.grayScaleAlpha,
        dark: darkAnalogous.grayScaleAlpha,
      },

      radixAnalogousLight: lightAnalogous as RadixColorTheme,
      radixAnalogousDark: darkAnalogous as RadixColorTheme,
    },

    // Add semantic colors
    semantic: semanticColors,
  };
}
