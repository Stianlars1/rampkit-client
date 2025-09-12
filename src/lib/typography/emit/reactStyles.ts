// Emits a SCSS module for the React primitives.  These class names
// correspond to the variants defined in the generated React module.
// Consumers import this file as `typography.module.scss` alongside
// the React module.

export function emitReactStyles() {
  return `.display {
  font-size: var(--size-display);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.headline {
  font-size: var(--size-headline);
  line-height: 1.25;
  font-weight: 600;
}

.title {
  font-size: var(--size-title);
  line-height: 1.25;
  font-weight: 600;
}

.body {
  font-size: var(--size-body);
  line-height: 1.5;
  font-weight: 400;
}

.label {
  font-size: var(--size-label);
  line-height: 1.3;
  font-weight: 500;
}

.link {
  text-decoration: underline;
  text-underline-offset: 0.15em;
  text-decoration-thickness: from-font;
}

.link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.li {
  margin-block: calc(0.5 * 1rlh);
}`;
}
