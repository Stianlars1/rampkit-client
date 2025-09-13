import { toClamp } from "./clamp";

// Computes a set of `clamp()` expressions for a fluid type scale.  Given a
// base configuration (min/max viewport and base font sizes), and a ratio,
// generateScale will produce multiple steps on either side of the base step.
// Each step scales the base min/max sizes by `ratio` raised to the step index.

export function generateFluidScale({
  basePx,
  ratio = 1.25,
  steps = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
}: {
  basePx: {
    minViewport: number;
    maxViewport: number;
    minSize: number;
    maxSize: number;
  };
  ratio: number;
  steps?: string[];
}) {
  const baseClamp = toClamp(basePx);

  // Given an integer step, compute the clamp expression by scaling the
  // minSize and maxSize by ratio^step.  Negative steps produce smaller
  // sizes relative to the base.
  const calc = (n: number) => {
    const min = basePx.minSize * Math.pow(ratio, n);
    const max = basePx.maxSize * Math.pow(ratio, n);
    return toClamp({ ...basePx, minSize: min, maxSize: max });
  };

  // Determine the indices for each named step.  We centre the array on the
  // base step at index 0.  Negative indices correspond to smaller sizes.
  const indices = [-2, -1, 0, 1, 2, 3, 4].slice(0, steps.length);
  const out = indices.map((i, idx) => ({
    name: steps[idx],
    clamp: calc(i),
  }));

  return {
    steps: out,
    base: baseClamp,
    describe: `ratio ${ratio}, base ${basePx.minSize}-${basePx.maxSize}px @ ${basePx.minViewport}-${basePx.maxViewport}px`,
  };
}
