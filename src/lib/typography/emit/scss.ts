// Emits a SCSS utility module for the typography roles.  Each class
// references the CSS variables defined in the exported CSS file.  These
// utilities can be imported into your own SCSS modules and composed with
// other classes.

export function emitSCSS(
  roleMap?: Record<"display" | "headline" | "title" | "body" | "label", string>,
) {
  // Mixin definitions using CSS variables.  Role names map directly to
  // classes; these mixins can be imported into user code.
  const mixins = `// Typography mixins
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

  // Utility classes referencing the mixins.  These can be used
  // directly in markup.
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

  // Semantic element mapping, if provided.  Map heading and text elements
  // to their corresponding role sizes using the provided roleMap.  This
  // is optional; if roleMap is undefined, the caller may choose to
  // append its own mappings or rely on CSS defaults.
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
