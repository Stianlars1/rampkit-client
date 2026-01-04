import { RadixColorTheme } from "@/types/radix";
import {
  SemanticColors,
  SemanticColorSet,
} from "@/lib/utils/color/generateSemanticColors";

export type SearchParams = {
  hex?: string;
  scheme?: string;
  harmonize?: string;
};

export type Scheme =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic";

export type ColorFormat =
  | "HEX"
  | "RGB"
  | "HSL"
  | "HSL_VALUES"
  | "OKLAB"
  | "OKLCH";

export type StylePreset =
  | "radix"
  | "shadcn"
  | "tailwind"
  | "css-variables"
  | "css-in-js"
  | "scss"
  | "material-ui"
  | "chakra-ui";

export interface ColorScale {
  light: string[];
  dark: string[];
}

export interface PaletteData {
  // Original user input - never modified by harmony transformations
  brandColor: string;
  // Generation settings used
  scheme: Scheme;
  harmonized: boolean;
  pureColorTheory: boolean;

  // Generated accent (may differ from brandColor when harmony is applied)
  accent: string;
  gray: string;
  lightBackground: string;
  darkBackground: string;
  accentScale: ColorScale;
  grayScale: ColorScale;
  accentScaleAlpha: ColorScale;
  grayScaleAlpha: ColorScale;
  radixOriginalLight: RadixColorTheme;
  radixOriginalDark: RadixColorTheme;

  analogous: {
    accent: string;
    gray: string;
    lightBackground: string;
    darkBackground: string;
    accentScale: ColorScale;
    grayScale: ColorScale;
    accentScaleAlpha: ColorScale;
    grayScaleAlpha: ColorScale;
    radixAnalogousLight: RadixColorTheme;
    radixAnalogousDark: RadixColorTheme;
  };

  complementary: {
    accent: string;
    gray: string;
    lightBackground: string;
    darkBackground: string;
    accentScale: ColorScale;
    grayScale: ColorScale;
    accentScaleAlpha: ColorScale;
    grayScaleAlpha: ColorScale;
    radixComplementaryLight: RadixColorTheme;
    radixComplementaryDark: RadixColorTheme;
  };

  // Semantic/feedback colors for light and dark modes
  semantic: {
    light: SemanticColors;
    dark: SemanticColors;
  };
}

// Re-export semantic types for convenience
export type { SemanticColors, SemanticColorSet };

export interface ExportOptions {
  preset: StylePreset;
  format: ColorFormat;
}
