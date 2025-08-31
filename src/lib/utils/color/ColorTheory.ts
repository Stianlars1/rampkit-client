import { Scheme } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";
import { HSLColor, hslToHex } from "@/lib/utils/color/colorConverters";

export function generateHarmoniousPalette(
  baseColor: string,
  scheme: Scheme = "analogous",
): {
  accent: string;
  gray: string;
  lightBg: string;
  darkBg: string;
} {
  const hsl = hexToHSL(baseColor);

  switch (scheme) {
    case "analogous":
      return generateAnalogous(hsl);
    case "complementary":
      return generateComplementary(hsl);
    case "triadic":
      return generateTriadic(hsl);
    case "monochromatic":
      return generateMonochromatic(hsl);
    default:
      return generateAnalogous(hsl);
  }
}

export function generateAnalogous(baseHSL: HSLColor) {
  const accent = hslToHex({
    h: baseHSL.h,
    s: Math.max(70, baseHSL.s),
    l: 55,
  });

  const gray = hslToHex({
    h: (baseHSL.h + 30) % 360,
    s: 8,
    l: 50,
  });

  const lightBg = hslToHex({
    h: (baseHSL.h + 15) % 360,
    s: 20,
    l: 98,
  });

  const darkBg = hslToHex({
    h: (baseHSL.h + 15) % 360,
    s: 15,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateComplementary(baseHSL: HSLColor) {
  const accent = hslToHex({
    h: baseHSL.h,
    s: Math.max(80, baseHSL.s),
    l: 55,
  });

  const gray = hslToHex({
    h: (baseHSL.h + 180) % 360,
    s: 6,
    l: 50,
  });

  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 25,
    l: 98,
  });

  const darkBg = hslToHex({
    h: (baseHSL.h + 180) % 360,
    s: 20,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateTriadic(baseHSL: HSLColor) {
  const accent = hslToHex({
    h: baseHSL.h,
    s: Math.max(75, baseHSL.s),
    l: 55,
  });

  const gray = hslToHex({
    h: (baseHSL.h + 120) % 360,
    s: 10,
    l: 50,
  });

  const lightBg = hslToHex({
    h: (baseHSL.h + 240) % 360,
    s: 15,
    l: 98,
  });

  const darkBg = hslToHex({
    h: (baseHSL.h + 240) % 360,
    s: 12,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}

export function generateMonochromatic(baseHSL: HSLColor) {
  const accent = hslToHex({
    h: baseHSL.h,
    s: Math.max(85, baseHSL.s),
    l: 55,
  });

  const gray = hslToHex({
    h: baseHSL.h,
    s: 5,
    l: 50,
  });

  const lightBg = hslToHex({
    h: baseHSL.h,
    s: 20,
    l: 98,
  });

  const darkBg = hslToHex({
    h: baseHSL.h,
    s: 15,
    l: 8,
  });

  return { accent, gray, lightBg, darkBg };
}
