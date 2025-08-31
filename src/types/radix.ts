/**
 * Represents a complete color theme with accent and gray scales
 * in multiple color formats for maximum compatibility and accessibility
 */
export interface RadixColorTheme {
  /** Accent color scale in hex format (12 steps from lightest to darkest) */
  accentScale: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Accent color scale with alpha transparency in hex format */
  accentScaleAlpha: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Accent color scale in OKLCH format for wide gamut displays */
  accentScaleWideGamut: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Accent color scale with alpha in wide gamut P3 color space */
  accentScaleAlphaWideGamut: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** High contrast color for accent elements */
  accentContrast: string;

  /** Gray color scale in hex format (12 steps from lightest to darkest) */
  grayScale: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Gray color scale with alpha transparency in hex format */
  grayScaleAlpha: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Gray color scale in OKLCH format for wide gamut displays */
  grayScaleWideGamut: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Gray color scale with alpha in wide gamut P3 color space */
  grayScaleAlphaWideGamut: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  /** Surface color for gray elements with transparency */
  graySurface: string;

  /** Surface color for gray elements in wide gamut P3 color space */
  graySurfaceWideGamut: string;

  /** Surface color for accent elements with transparency */
  accentSurface: string;

  /** Surface color for accent elements in wide gamut P3 color space */
  accentSurfaceWideGamut: string;

  /** Primary background color */
  background: string;
}

/**
 * Utility type for accessing individual color scale steps
 */
export type ColorScaleStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Utility type for color scale arrays
 */
export type ColorScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

/**
 * Helper type for theme color categories
 */
export type ThemeColorCategory = "accent" | "gray";

/**
 * Helper type for color formats
 */
export type ColorFormat = "hex" | "alpha" | "wideGamut" | "alphaWideGamut";
