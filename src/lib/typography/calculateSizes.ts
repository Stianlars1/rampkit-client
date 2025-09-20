import {
  SizeCalculation,
  StaticSizeConfig,
  FluidSizeConfig,
} from "./outputTypes";

export function calculateStaticSize(
  config: StaticSizeConfig,
  step: number,
): SizeCalculation {
  const size = config.baseSize * Math.pow(config.ratio, step);
  return {
    type: "static",
    value: `${size.toFixed(3)}px`,
  };
}

export function calculateFluidSize(config: FluidSizeConfig): SizeCalculation {
  const slope =
    (config.maxSize - config.minSize) /
    (config.maxViewport - config.minViewport);
  const intercept = config.minSize - slope * config.minViewport;
  const slopeVW = slope * 100;

  const minStr = `${config.minSize.toFixed(3)}px`;
  const maxStr = `${config.maxSize.toFixed(3)}px`;
  const interceptStr = `${intercept.toFixed(3)}px`;

  return {
    type: "fluid",
    value: `clamp(${minStr}, ${interceptStr} + ${slopeVW.toFixed(3)}vw, ${maxStr})`,
  };
}
