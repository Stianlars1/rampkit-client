import { RoleMap } from "../types";

type RolesFromTokens = {
  display: { size: { value: string } };
  headline: { size: { value: string } };
  title: { size: { value: string } };
  body: { size: { value: string } };
  label: { size: { value: string } };
};

function header(tokens: any, projectName?: string) {
  const m = tokens?.typography?.meta ?? {};
  const vp = m.viewport ?? {};
  const r = m.responsive ?? {};
  return `/*────────────────────────────────────────────
${projectName ? `  Project: ${projectName}\n` : ""}  Generated: ${new Date().toISOString()}
  Viewport: ${vp.min ?? "?"}px → ${vp.max ?? "?"}px
  Responsive:
    profile         : ${r.profile ?? "custom/unknown"}
    mobile ratio    : ${r.mobileRatio ?? "?"}
    desktop ratio   : ${r.desktopRatio ?? "?"}
    optimize mobile : ${r.optimizeMobile ? "yes" : "no"}
    H1 cap (mobile) : ${r.mobileH1Cap ?? "?"}px
────────────────────────────────────────────*/`;
}

export function emitCSS({
  tokens,
  roleMap,
  projectName,
}: {
  tokens: any;
  roleMap: RoleMap;
  projectName?: string;
}) {
  const t = tokens.typography;
  const roles = t.roles as RolesFromTokens;
  const family = t.font.family.sans.value;
  const lh = t.lineHeight.root.value;
  const outputType = t.outputType?.value ?? "static";

  const v = (r: { size: { value: string } }) => r.size.value;

  const cssComment =
    outputType === "static"
      ? "/* Static typography system using fixed sizes */"
      : outputType === "responsive"
        ? "/* Mobile-first responsive typography system using CSS clamp() */"
        : "/* Fluid typography system using CSS clamp() */";

  return `${header(tokens, projectName)}
${cssComment}
:root {
  --font-sans: ${family};
  --lh-root: ${lh};

  --size-${roleMap.display}: ${v(roles.display)};
  --size-${roleMap.headline}: ${v(roles.headline)};
  --size-${roleMap.title}: ${v(roles.title)};
  --size-${roleMap.body}: ${v(roles.body)};
  --size-${roleMap.label}: ${v(roles.label)};
}

/* Baseline styles */
html {
  font-family: var(--font-sans);
  line-height: var(--lh-root);
}

/* Modern typography improvements */
:where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
  line-height: 1.2;
}

:where(p, li) {
  text-wrap: pretty;
  max-width: 65ch;
}

a {
  text-decoration: underline;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;
}

/* Semantic element mapping */
h1 {
  font-size: var(--size-${roleMap.display});
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--size-${roleMap.headline});
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}

h3 {
  font-size: var(--size-${roleMap.title});
  line-height: 1.25;
  font-weight: 600;
}

h4, h5, h6 {
  font-size: var(--size-${roleMap.title});
  line-height: 1.3;
  font-weight: 600;
}

p {
  font-size: var(--size-${roleMap.body});
  line-height: 1.6;
}

small {
  font-size: var(--size-${roleMap.label});
  line-height: 1.4;
}

/* Typography utilities */
.t-display {
  font-size: var(--size-display);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.t-headline {
  font-size: var(--size-headline);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

.t-title {
  font-size: var(--size-title);
  line-height: 1.25;
  font-weight: 600;
  text-wrap: balance;
}

.t-body {
  font-size: var(--size-body);
  line-height: 1.6;
  max-width: 65ch;
  text-wrap: pretty;
}

.t-label {
  font-size: var(--size-label);
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 500;
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  :where(h1, h2, h3, h4, h5, h6) {
    text-wrap: balance;
    hyphens: auto;
  }
  
  :where(p, li) {
    max-width: none;
    text-wrap: pretty;
  }
}`;
}
