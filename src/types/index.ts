import { RadixColorTheme } from "@/types/radix";

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
}

export interface ExportOptions {
  preset: StylePreset;
  format: ColorFormat;
}
