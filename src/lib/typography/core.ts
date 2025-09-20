// src/lib/typography/core.ts
export type OutputType = "responsive" | "fluid" | "static";

/** Named intervals + golden ratio */
export const defaultRatios: Record<string, number> = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.2,
  majorThird: 1.25,
  perfectFourth: 1.333,
  augmentedFourth: 1.414,
  perfectFifth: 1.5,
  goldenRatio: 1.618,
};

type StaticSizeInput = { baseSize: number; ratio: number };
type FluidSizeInput = {
  minViewport: number;
  maxViewport: number;
  minSize: number;
  maxSize: number;
};

export type Unit = "px" | "rem";

export type StaticCalc = { kind: "static"; value: number }; // px
export type FluidCalc = {
  kind: "fluid";
  min: number;
  max: number;
  slope: number; // px per 1vw
  intercept: number; // px
};
export type SizeCalc = StaticCalc | FluidCalc;

const round = (n: number, d = 3) => Number(n.toFixed(d));

export function calculateStaticSize(
  { baseSize, ratio }: StaticSizeInput,
  step: number,
): StaticCalc {
  const value = baseSize * Math.pow(ratio, step);
  return { kind: "static", value };
}

export function calculateFluidSize({
  minViewport,
  maxViewport,
  minSize,
  maxSize,
}: FluidSizeInput): FluidCalc {
  const slope = ((maxSize - minSize) / (maxViewport - minViewport)) * 100;
  const intercept = minSize - slope * (minViewport / 100);
  return { kind: "fluid", min: minSize, max: maxSize, slope, intercept };
}

export function formatSize(calc: SizeCalc, unit: Unit): string {
  const asUnit = (px: number) =>
    unit === "px" ? `${round(px)}px` : `${round(px / 16)}rem`;
  if (calc.kind === "static") return asUnit(calc.value);
  const min = asUnit(calc.min);
  const max = asUnit(calc.max);
  const b = asUnit(calc.intercept);
  const m = `${round(calc.slope)}vw`;
  return `clamp(${min}, ${b} + ${m}, ${max})`;
}

/** read sizes from tokens created in typography.tsx */
export function readRoleSizesFromTokens(tokens: any) {
  const t = tokens?.typography;
  const role = (k: string) => String(t?.roles?.[k]?.size?.value ?? "");
  return {
    display: role("display"),
    headline: role("headline"),
    title: role("title"),
    body: role("body"),
    label: role("label"),
    fontFamily: String(t?.font?.family?.sans?.value ?? "system-ui, sans-serif"),
    rootLineHeight: String(t?.lineHeight?.root?.value ?? "1.5"),
    meta: t?.meta ?? {},
  };
}

export type RatioKey = keyof typeof defaultRatios;
