// src/lib/typography/emit/less.ts
import { RoleMap } from "../types";

export function emitLESS(roleMap?: RoleMap, outputType: string = "static") {
  const lessComment =
    outputType === "static"
      ? "// Static typography utilities using fixed sizes"
      : "// Fluid typography utilities using CSS clamp()";

  const mixins = `${lessComment}
// Typography mixins
.t-display() {
  font-size: var(--size-display);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.t-headline() {
  font-size: var(--size-headline);
  line-height: 1.25;
  font-weight: 600;
}

.t-title() {
  font-size: var(--size-title);
  line-height: 1.25;
  font-weight: 600;
}

.t-body() {
  font-size: var(--size-body);
  line-height: 1.5;
}

.t-label() {
  font-size: var(--size-label);
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}`;

  const classes = `
// Typography utility classes
.t-display {
  .t-display();
}

.t-headline {
  .t-headline();
}

.t-title {
  .t-title();
}

.t-body {
  .t-body();
}

.t-label {
  .t-label();
}`;

  const elementMapping = roleMap
    ? `
// Semantic element styles
h1 {
  .t-display();
}

h2 {
  .t-headline();
}

h3 {
  .t-title();
}

p {
  .t-body();
}

small {
  .t-label();
}
`
    : ``;

  return `${mixins}${classes}${elementMapping}`;
}
