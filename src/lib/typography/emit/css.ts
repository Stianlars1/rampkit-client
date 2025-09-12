// Emits a minimal CSS file containing CSS variables and sensible defaults
// derived from the typography design tokens.  The file defines custom
// properties for the font family and each role size as well as the root
// line height.  It also adds baseline styles for HTML elements like
// headings and anchors.

export function emitCSS({
  family,
  roles,
  roleMap,
}: {
  family: string;
  roles: {
    display: { size: { value: string } };
    headline: { size: { value: string } };
    title: { size: { value: string } };
    body: { size: { value: string } };
    label: { size: { value: string } };
  };
  roleMap: Record<"display" | "headline" | "title" | "body" | "label", string>;
}) {
  // Helper to extract the clamp value from a role.
  const v = (r: { size: { value: string } }) => r.size.value;

  return `:root {
  --font-sans: ${family};
  --size-display: ${v(roles.display)};
  --size-headline: ${v(roles.headline)};
  --size-title: ${v(roles.title)};
  --size-body: ${v(roles.body)};
  --size-label: ${v(roles.label)};
  --lh-root: 1.5;
}

/* Baseline styles */
html {
  font-family: var(--font-sans);
  line-height: var(--lh-root);
}

:where(h1, h2, h3) {
  text-wrap: balance;
}

a {
  text-decoration: underline;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;
}

/* Semantic element mapping */
h1 {
  font-size: var(--size-${roleMap.display});
  line-height: 1.2;
}

h2 {
  font-size: var(--size-${roleMap.headline});
  line-height: 1.25;
}

h3 {
  font-size: var(--size-${roleMap.title});
  line-height: 1.25;
}

p {
  font-size: var(--size-${roleMap.body});
  line-height: 1.5;
}

small {
  font-size: var(--size-${roleMap.label});
  line-height: 1.35;
}

/* Typography utilities */
.t-display {
  font-size: var(--size-display);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.t-headline {
  font-size: var(--size-headline);
  line-height: 1.25;
  font-weight: 600;
}

.t-title {
  font-size: var(--size-title);
  line-height: 1.25;
  font-weight: 600;
}

.t-body {
  font-size: var(--size-body);
  line-height: 1.5;
}

.t-label {
  font-size: var(--size-label);
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}`;
}
