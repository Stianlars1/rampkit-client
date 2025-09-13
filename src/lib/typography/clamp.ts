// Generates a `clamp()` CSS expression for a fluid value.  Given a min
// viewport and max viewport (in px) and corresponding min and max values
// (also in px), compute the slope and intercept for the linear interpolation
// between the two extremes.  The resulting string can be used directly in
// CSS: e.g. `font-size: clamp(1rem, 0.5vw + 0.875rem, 1.25rem)`.

export function toClamp({
  minViewport,
  maxViewport,
  minSize,
  maxSize,
}: {
  minViewport: number;
  maxViewport: number;
  minSize: number;
  maxSize: number;
}) {
  // Calculate the slope (change in size per viewport unit).
  const slope = ((maxSize - minSize) / (maxViewport - minViewport)) * 100;
  // Intercept is the value at 0vw when extrapolating the linear function.
  const intercept = minSize - (slope / 100) * minViewport;
  const vmin = `${minSize.toFixed(3)}px`;
  const vmax = `${maxSize.toFixed(3)}px`;
  const formula = `${intercept.toFixed(3)}px + ${slope.toFixed(3)}vw`;
  return `clamp(${vmin}, ${formula}, ${vmax})`;
}

// A convenience helper for previewing clamp strings.  It returns an object
// containing the raw string and a human‑friendly description (currently the
// description is the same as the value).  In a more sophisticated tool,
// this could produce additional metadata about breakpoints.
export function clampPreview(c: string) {
  return { value: c, describe: c.replace(/\s+/g, " ") };
}
