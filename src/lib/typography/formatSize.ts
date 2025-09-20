import { SizeCalculation } from "./outputTypes";

export function formatSize(
  calculation: SizeCalculation,
  unit: "px" | "rem",
): string {
  if (unit === "px") {
    return calculation.value;
  }

  if (calculation.type === "static") {
    const pxValue = parseFloat(calculation.value);
    return `${(pxValue / 16).toFixed(3)}rem`;
  }

  // For fluid/clamp values, we need to convert each px value to rem
  return calculation.value.replace(/(\d+\.?\d*)px/g, (match, px) => {
    const remValue = (parseFloat(px) / 16).toFixed(3);
    return `${remValue}rem`;
  });
}
