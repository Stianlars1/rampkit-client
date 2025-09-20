export type RatioKey =
  | "minorSecond"
  | "majorSecond"
  | "minorThird"
  | "majorThird"
  | "perfectFourth"
  | "augFourth"
  | "perfectFifth"
  | "goldenRatio";

export const defaultRatios: Record<RatioKey, number> = {
  minorSecond: 1.067,
  majorSecond: 1.125,
  minorThird: 1.2,
  majorThird: 1.25,
  perfectFourth: 1.333,
  augFourth: 1.414,
  perfectFifth: 1.5,
  goldenRatio: 1.618,
};
