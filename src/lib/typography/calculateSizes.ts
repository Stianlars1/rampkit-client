import {
  SizeCalculation,
  StaticSizeConfig,
  FluidSizeConfig,
  ResponsiveConfig,
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

// NEW: Mobile-first responsive calculation
export function calculateResponsiveSize(
  config: ResponsiveConfig,
): SizeCalculation {
  const {
    minViewport,
    maxViewport,
    mobileRatio,
    desktopRatio,
    baseSize,
    step,
    contentType = "balanced",
  } = config;

  // Content-type scaling adjustments
  const contentAdjustments = {
    marketing: { mobile: 1.0, desktop: 1.2 }, // Allow larger desktop scaling
    product: { mobile: 0.9, desktop: 0.95 }, // More conservative
    content: { mobile: 0.95, desktop: 1.05 }, // Balanced
    balanced: { mobile: 1.0, desktop: 1.1 }, // Default
  };

  const adjustment = contentAdjustments[contentType];

  // Calculate mobile and desktop sizes with content-type adjustments
  const mobileSize = baseSize * Math.pow(mobileRatio, step) * adjustment.mobile;
  const desktopSize =
    baseSize * Math.pow(desktopRatio, step) * adjustment.desktop;

  // Apply mobile-first constraints
  const constrainedMobile = Math.max(
    step === 0 ? 14 : 12, // Minimum body: 14px, others: 12px
    Math.min(mobileSize, step <= 0 ? 18 : getMaxMobileSize(step)),
  );

  const constrainedDesktop = Math.max(
    constrainedMobile * 1.1, // Desktop min 10% larger than mobile
    Math.min(desktopSize, getMaxDesktopSize(step, contentType)),
  );

  return calculateFluidSize({
    minViewport,
    maxViewport,
    minSize: constrainedMobile,
    maxSize: constrainedDesktop,
  });
}

// Mobile size constraints based on heading level
function getMaxMobileSize(step: steps): number {
  const maxSizes = {
    6: 28, // Display (H1)
    5: 24, // Headline (H2)
    4: 22, // Title (H3)
    3: 20, // H4
    2: 18, // H5
    1: 16, // H6/Label
    0: 18, // Body
    [-1]: 14, // Small
  };
  return maxSizes[step] || 16;
}

// Desktop size constraints based on content type
function getMaxDesktopSize(step: steps, contentType: string): number {
  const baseMax = {
    6: contentType === "marketing" ? 72 : 56, // Display
    5: contentType === "marketing" ? 48 : 40, // Headline
    4: contentType === "marketing" ? 36 : 32, // Title
    3: 28, // H4
    2: 24, // H5
    1: 20, // H6/Label
    0: 20, // Body
    [-1]: 16, // Small
  };
  return baseMax[step] || 20;
}

export type steps = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
