// Defines the common ratio presets used when generating a musical type scale.
// These ratios are derived from musical intervals and widely used in
// typographic scales to achieve a pleasing progression between sizes.  The
// values here originate from the Utopia type scale recommendations.

export type RatioKey =
  | "minorSecond"
  | "majorSecond"
  | "minorThird"
  | "majorThird"
  | "perfectFourth"
  | "augFourth"
  | "perfectFifth";

export const defaultRatios: Record<RatioKey, number> = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.2,
  majorThird: 1.25,
  perfectFourth: 1.333,
  augFourth: 1.414,
  perfectFifth: 1.5,
};
