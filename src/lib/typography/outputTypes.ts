import { steps } from "@/lib/typography/calculateSizes";

export type OutputType = "static" | "fluid" | "responsive";
export type ContentType = "marketing" | "product" | "content" | "balanced";

export interface StaticSizeConfig {
  baseSize: number; // in px
  ratio: number;
}

export interface FluidSizeConfig {
  minViewport: number;
  maxViewport: number;
  minSize: number;
  maxSize: number;
}

export interface ResponsiveConfig {
  minViewport: number;
  maxViewport: number;
  mobileRatio: number;
  desktopRatio: number;
  baseSize: number;
  step: steps;
  contentType?: ContentType;
}

export interface SizeCalculation {
  type: OutputType;
  value: string; // Either "16px" or "clamp(...)"
}

// Responsive ratio presets
export const responsiveRatioPresets = {
  conservative: { mobile: 1.125, desktop: 1.25 },
  balanced: { mobile: 1.2, desktop: 1.333 },
  dramatic: { mobile: 1.25, desktop: 1.5 },
  extreme: { mobile: 1.333, desktop: 1.618 },
} as const;

export type ResponsiveRatioPreset = keyof typeof responsiveRatioPresets;
