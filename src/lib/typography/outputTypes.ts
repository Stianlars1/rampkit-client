export type OutputType = "static" | "fluid";

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

export interface SizeCalculation {
  type: OutputType;
  value: string; // Either "16px" or "clamp(...)"
}
