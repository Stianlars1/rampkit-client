export type OpacityVariant =
  | "linear"
  | "reverse"
  | "quadratic-ease-in"
  | "quadratic-ease-out"
  | "cubic-ease-in"
  | "cubic-ease-out"
  | "sine-ease-in-out"
  | "exponential-ease-in"
  | "exponential-ease-out"
  | "center-peak"
  | "edge-peak"
  | "alternating"
  | "stepped-3"
  | "stepped-5"
  | "wave-sine"
  | "wave-cosine"
  | "bounce"
  | "spiral"
  | "logarithmic"
  | "power-of-4"
  | "bell-curve"
  | "valley"
  | "zigzag"
  | "random-consistent"
  | "fibonacci-based"
  | "golden-ratio"
  | "perlin-like"
  | "sawtooth"
  | "triangle-wave"
  | "square-wave";
export function getOpacityByVariant(
  index: number,
  totalSteps: number,
  variant: OpacityVariant,
): number {
  const normalized = index / (totalSteps - 1);
  let opacity: number;

  switch (variant) {
    case "linear":
      opacity = normalized;
      break;

    case "reverse":
      opacity = 1 - normalized;
      break;

    case "quadratic-ease-in":
      opacity = Math.pow(normalized, 2);
      break;

    case "quadratic-ease-out":
      opacity = 1 - Math.pow(1 - normalized, 2);
      break;

    case "cubic-ease-in":
      opacity = Math.pow(normalized, 3);
      break;

    case "cubic-ease-out":
      opacity = 1 - Math.pow(1 - normalized, 3);
      break;

    case "sine-ease-in-out":
      opacity = 0.5 - 0.5 * Math.cos(Math.PI * normalized);
      break;

    case "exponential-ease-in":
      opacity = normalized === 0 ? 0 : Math.pow(2, 10 * (normalized - 1));
      break;

    case "exponential-ease-out":
      opacity = normalized === 1 ? 1 : 1 - Math.pow(2, -10 * normalized);
      break;

    case "center-peak":
      opacity =
        1 - Math.abs((index - (totalSteps - 1) / 2) / ((totalSteps - 1) / 2));
      break;

    case "edge-peak":
      opacity = Math.abs(
        (index - (totalSteps - 1) / 2) / ((totalSteps - 1) / 2),
      );
      break;

    case "alternating":
      opacity = index % 2 === 0 ? 1 : 0.3;
      break;

    case "stepped-3":
      opacity = Math.floor(normalized * 3) / 3;
      break;

    case "stepped-5":
      opacity = Math.floor(normalized * 5) / 5;
      break;

    case "wave-sine":
      opacity = 0.5 + 0.5 * Math.sin(normalized * Math.PI * 2);
      break;

    case "wave-cosine":
      opacity = 0.5 + 0.5 * Math.cos(normalized * Math.PI * 2);
      break;

    case "bounce":
      opacity = Math.abs(Math.sin(normalized * Math.PI * 3)) * normalized;
      break;

    case "spiral":
      opacity =
        (normalized + Math.sin(normalized * Math.PI * 4) * 0.3) * 0.8 + 0.2;
      break;

    case "logarithmic":
      opacity =
        normalized === 0 ? 0 : Math.log10(1 + normalized * 9) / Math.log10(10);
      break;

    case "power-of-4":
      opacity = Math.pow(normalized, 4);
      break;

    case "bell-curve":
      const x = (normalized - 0.5) * 6;
      opacity = (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) * 2.5;
      break;

    case "valley":
      opacity = 1 - Math.exp(-Math.pow((normalized - 0.5) * 4, 2));
      break;

    case "zigzag":
      opacity = normalized < 0.5 ? normalized * 2 : 2 - normalized * 2;
      break;

    case "random-consistent":
      const seed = Math.sin(index * 12.9898) * 43758.5453;
      opacity = Math.abs(seed - Math.floor(seed));
      break;

    case "fibonacci-based":
      const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
      const fibIndex = Math.min(index, fib.length - 1);
      opacity = (fib[fibIndex] / 89) * 0.8 + 0.2;
      break;

    case "golden-ratio":
      const phi = (1 + Math.sqrt(5)) / 2;
      opacity = Math.abs(Math.sin(index * phi)) * 0.8 + 0.2;
      break;

    case "perlin-like":
      const t1 = Math.sin(normalized * Math.PI * 2) * 0.3;
      const t2 = Math.sin(normalized * Math.PI * 4) * 0.2;
      const t3 = Math.sin(normalized * Math.PI * 8) * 0.1;
      opacity = 0.5 + t1 + t2 + t3;
      break;

    case "sawtooth":
      opacity = (normalized * 3) % 1;
      break;

    case "triangle-wave":
      const t = (normalized * 2) % 2;
      opacity = t <= 1 ? t : 2 - t;
      break;

    case "square-wave":
      opacity = Math.floor(normalized * 4) % 2;
      break;

    default:
      opacity = normalized;
      break;
  }

  // Ensure opacity is always between 0.1 and 1
  return Math.max(0.05, Math.min(1, opacity));
}

export type HeightVariant =
  | "linear-ascending"
  | "linear-descending"
  | "exponential-growth"
  | "exponential-decay"
  | "quadratic-growth"
  | "quadratic-decay"
  | "cubic-growth"
  | "cubic-decay"
  | "sine-wave"
  | "cosine-wave"
  | "bounce-up"
  | "bounce-down"
  | "mountain-peak"
  | "valley-dip"
  | "stepped-3"
  | "stepped-5"
  | "stepped-7"
  | "zigzag"
  | "sawtooth"
  | "triangle-wave"
  | "pyramid"
  | "inverted-pyramid"
  | "fibonacci-growth"
  | "golden-spiral"
  | "logarithmic-growth"
  | "random-consistent"
  | "alternating-high-low"
  | "bell-curve"
  | "spiral-growth"
  | "accordion"
  | "double-peak"
  | "triple-peak"
  | "cascade"
  | "reverse-cascade"
  | "elastic-bounce";

export function getHeightByVariant(
  index: number,
  totalSteps = 12,
  variant = "linear-ascending",
  minHeight = 50,
  maxHeight = 500,
) {
  const normalized = index / (totalSteps - 1);
  const range = maxHeight - minHeight;
  let heightFactor: number;

  switch (variant) {
    case "linear-ascending":
      heightFactor = normalized;
      break;

    case "linear-descending":
      heightFactor = 1 - normalized;
      break;

    case "exponential-growth":
      heightFactor = Math.pow(normalized, 0.5);
      break;

    case "exponential-decay":
      heightFactor = 1 - Math.pow(normalized, 2);
      break;

    case "quadratic-growth":
      heightFactor = Math.pow(normalized, 2);
      break;

    case "quadratic-decay":
      heightFactor = 1 - Math.pow(1 - normalized, 2);
      break;

    case "cubic-growth":
      heightFactor = Math.pow(normalized, 3);
      break;

    case "cubic-decay":
      heightFactor = 1 - Math.pow(normalized, 3);
      break;

    case "sine-wave":
      heightFactor = 0.5 + 0.5 * Math.sin(normalized * Math.PI * 4);
      break;

    case "cosine-wave":
      heightFactor = 0.5 + 0.5 * Math.cos(normalized * Math.PI * 4);
      break;

    case "bounce-up":
      heightFactor = Math.abs(Math.sin(normalized * Math.PI * 3)) * normalized;
      break;

    case "bounce-down":
      heightFactor =
        Math.abs(Math.sin((1 - normalized) * Math.PI * 3)) * (1 - normalized);
      break;

    case "mountain-peak":
      heightFactor = 1 - Math.abs((normalized - 0.5) * 2);
      break;

    case "valley-dip":
      heightFactor = Math.abs((normalized - 0.5) * 2);
      break;

    case "stepped-3":
      heightFactor = Math.floor(normalized * 3) / 3;
      break;

    case "stepped-5":
      heightFactor = Math.floor(normalized * 5) / 5;
      break;

    case "stepped-7":
      heightFactor = Math.floor(normalized * 7) / 7;
      break;

    case "zigzag":
      const zigzagPeriod = Math.floor(normalized * 4);
      heightFactor =
        zigzagPeriod % 2 === 0
          ? (normalized * 4) % 1
          : 1 - ((normalized * 4) % 1);
      break;

    case "sawtooth":
      heightFactor = (normalized * 3) % 1;
      break;

    case "triangle-wave":
      const t = (normalized * 2) % 2;
      heightFactor = t <= 1 ? t : 2 - t;
      break;

    case "pyramid":
      heightFactor = normalized <= 0.5 ? normalized * 2 : (1 - normalized) * 2;
      break;

    case "inverted-pyramid":
      heightFactor =
        normalized <= 0.5 ? 1 - normalized * 2 : normalized * 2 - 1;
      break;

    case "fibonacci-growth":
      const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
      const fibIndex = Math.min(
        Math.floor(normalized * fib.length),
        fib.length - 1,
      );
      heightFactor = fib[fibIndex] / 144;
      break;

    case "golden-spiral":
      const phi = (1 + Math.sqrt(5)) / 2;
      heightFactor =
        (Math.pow(phi, normalized * 5) - 1) / (Math.pow(phi, 5) - 1);
      break;

    case "logarithmic-growth":
      heightFactor =
        normalized === 0 ? 0 : Math.log10(1 + normalized * 9) / Math.log10(10);
      break;

    case "random-consistent":
      const seed = Math.sin(index * 12.9898) * 43758.5453;
      heightFactor = Math.abs(seed - Math.floor(seed));
      break;

    case "alternating-high-low":
      heightFactor =
        index % 2 === 0 ? 0.8 + normalized * 0.2 : 0.2 + normalized * 0.3;
      break;

    case "bell-curve":
      const x = (normalized - 0.5) * 6;
      heightFactor = (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) * 2.5;
      break;

    case "spiral-growth":
      heightFactor = normalized + Math.sin(normalized * Math.PI * 6) * 0.2;
      break;

    case "accordion":
      heightFactor = 0.3 + 0.7 * Math.abs(Math.sin(normalized * Math.PI * 2));
      break;

    case "double-peak":
      const peak1 = Math.exp(-Math.pow((normalized - 0.25) * 8, 2));
      const peak2 = Math.exp(-Math.pow((normalized - 0.75) * 8, 2));
      heightFactor = (peak1 + peak2) * 0.5;
      break;

    case "triple-peak":
      const p1 = Math.exp(-Math.pow((normalized - 0.2) * 10, 2));
      const p2 = Math.exp(-Math.pow((normalized - 0.5) * 10, 2));
      const p3 = Math.exp(-Math.pow((normalized - 0.8) * 10, 2));
      heightFactor = (p1 + p2 + p3) * 0.4;
      break;

    case "cascade":
      heightFactor =
        Math.pow(normalized, 0.3) + Math.sin(normalized * Math.PI) * 0.2;
      break;

    case "reverse-cascade":
      heightFactor =
        1 -
        Math.pow(normalized, 0.3) +
        Math.sin((1 - normalized) * Math.PI) * 0.2;
      break;

    case "elastic-bounce":
      if (normalized === 0) {
        heightFactor = 0;
      } else if (normalized === 1) {
        heightFactor = 1;
      } else {
        const p = 0.3;
        const s = p / 4;
        heightFactor =
          Math.pow(2, -10 * normalized) *
            Math.sin(((normalized - s) * (2 * Math.PI)) / p) +
          1;
      }
      break;

    default:
      heightFactor = normalized;
      break;
  }

  // Ensure heightFactor is between 0 and 1, then scale to desired range
  heightFactor = Math.max(0, Math.min(1, heightFactor));
  return minHeight + heightFactor * range;
}
