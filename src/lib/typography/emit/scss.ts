export function emitSCSS(
  roleMap?: Record<"display" | "headline" | "title" | "body" | "label", string>,
  outputType: string = "static",
) {
  const scssComment =
    outputType === "static"
      ? "// Static typography utilities using fixed sizes"
      : "// Fluid typography utilities using CSS clamp()";

  const mixins = `${scssComment}
// Typography mixins
@mixin t-display {
  font-size: var(--size-display);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

@mixin t-headline {
  font-size: var(--size-headline);
  line-height: 1.25;
  font-weight: 600;
}

@mixin t-title {
  font-size: var(--size-title);
  line-height: 1.25;
  font-weight: 600;
}

@mixin t-body {
  font-size: var(--size-body);
  line-height: 1.5;
}

@mixin t-label {
  font-size: var(--size-label);
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}`;

  const classes = `
// Typography utility classes
.t-display {
  @include t-display;
}

.t-headline {
  @include t-headline;
}

.t-title {
  @include t-title;
}

.t-body {
  @include t-body;
}

.t-label {
  @include t-label;
}`;

  const elementMapping = roleMap
    ? `
// Semantic element styles
h1 {
  @include t-display;
}

h2 {
  @include t-headline;
}

h3 {
  @include t-title;
}

p {
  @include t-body;
}

small {
  @include t-label;
}
`
    : ``;

  return `${mixins}${classes}${elementMapping}`;
}
