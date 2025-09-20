// @ts-expect-error no errors here...
// Consolidated emitters for CSS vars, React components, React styles, DTCG, and ZIP helper.
// These read your tokens produced by typography.tsx (where sizes are already formatted strings).

export type RoleKey = "display" | "headline" | "title" | "body" | "label";
export type RoleMap = Record<RoleKey, string>;

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

/** CSS Variables (global) — this is the source of truth the styles/components read */
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

  return `${header(tokens, projectName)}
:root {
  --font-sans: ${family};
  --lh-root: ${lh};

  --size-${roleMap.display}: ${roles.display.size.value};
  --size-${roleMap.headline}: ${roles.headline.size.value};
  --size-${roleMap.title}: ${roles.title.size.value};
  --size-${roleMap.body}: ${roles.body.size.value};
  --size-${roleMap.label}: ${roles.label.size.value};
}

/* Helpers (optional) */
.ts-font { font-family: var(--font-sans); }
.${roleMap.display}  { font-size: var(--size-${roleMap.display}); }
.${roleMap.headline} { font-size: var(--size-${roleMap.headline}); }
.${roleMap.title}    { font-size: var(--size-${roleMap.title}); }
.${roleMap.body}     { font-size: var(--size-${roleMap.body}); }
.${roleMap.label}    { font-size: var(--size-${roleMap.label}); }
`;
}

/** SCSS module for the primitives — unchanged *look*, just uses --lh-root now */
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
  line-height: var(--lh-root, 1.5);
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

/** React component module — your original API, now with forwardRef + better typing (no behavior change) */
export function emitReactModule() {
  return `import React, { forwardRef } from "react";
import styles from "./typography.module.scss";

// Simple utility function - replace with your preferred className utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

type Role = "display" | "headline" | "title" | "body" | "label";
type Size = "md";
type Variant = \`\${Role}/\${Size}\`;

const map: Record<Variant, string> = {
  "display/md": styles.display,
  "headline/md": styles.headline,
  "title/md": styles.title,
  "body/md": styles.body,
  "label/md": styles.label,
};

// Text (polymorphic) ---------------------------------------------------------
type As =
  | "p" | "div" | "span" | "section" | "article";

type PolymorphicProps<E extends As> = Omit<React.ComponentPropsWithoutRef<E>, "as"> & {
  as?: E;
};

interface BaseTextProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

export function Text<E extends As = "p">({
  as,
  variant = "body/md",
  className,
  children,
  ...rest
}: BaseTextProps & PolymorphicProps<E>) {
  const Component = (as ?? "p") as any;
  return (
    <Component className={cn(map[variant], className)} {...rest}>
      {children}
    </Component>
  );
}

// Heading (level) ------------------------------------------------------------
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, className, children, ...rest }, ref) => {
    const variant: Variant =
      level === 1 ? "display/md" : level <= 3 ? "headline/md" : "title/md";

    const headingClassName = cn(map[variant], className);

    switch (level) {
      case 1:
        return <h1 ref={ref} className={headingClassName} {...rest}>{children}</h1>;
      case 2:
        return <h2 ref={ref} className={headingClassName} {...rest}>{children}</h2>;
      case 3:
        return <h3 ref={ref} className={headingClassName} {...rest}>{children}</h3>;
      case 4:
        return <h4 ref={ref} className={headingClassName} {...rest}>{children}</h4>;
      case 5:
        return <h5 ref={ref} className={headingClassName} {...rest}>{children}</h5>;
      case 6:
        return <h6 ref={ref} className={headingClassName} {...rest}>{children}</h6>;
      default:
        return <h2 ref={ref} className={headingClassName} {...rest}>{children}</h2>;
    }
  }
);
Heading.displayName = "Heading";

// Individual convenience components -----------------------------------------
type IndividualHeadingProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "level"> & {
  children?: React.ReactNode;
};

export const Heading1 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h1 ref={ref} className={cn(map["display/md"], className)} {...rest}>{children}</h1>
);
Heading1.displayName = "Heading1";

export const Heading2 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h2 ref={ref} className={cn(map["headline/md"], className)} {...rest}>{children}</h2>
);
Heading2.displayName = "Heading2";

export const Heading3 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h3 ref={ref} className={cn(map["headline/md"], className)} {...rest}>{children}</h3>
);
Heading3.displayName = "Heading3";

export const Heading4 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h4 ref={ref} className={cn(map["title/md"], className)} {...rest}>{children}</h4>
);
Heading4.displayName = "Heading4";

export const Heading5 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h5 ref={ref} className={cn(map["title/md"], className)} {...rest}>{children}</h5>
);
Heading5.displayName = "Heading5";

export const Heading6 = forwardRef<HTMLHeadingElement, IndividualHeadingProps>(
  ({ className, children, ...rest }, ref) =>
    <h6 ref={ref} className={cn(map["title/md"], className)} {...rest}>{children}</h6>
);
Heading6.displayName = "Heading6";

// Paragraph
export const Paragraph = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...rest }, ref) =>
    <p ref={ref} className={cn(map["body/md"], className)} {...rest}>{children}</p>
);
Paragraph.displayName = "Paragraph";

// Link
export const Link = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, children, ...rest }, ref) =>
    <a ref={ref} className={cn(styles.link, className)} {...rest}>{children}</a>
);
Link.displayName = "Link";

// List item
export const ListItem = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...rest }, ref) =>
    <li ref={ref} className={cn(styles.li, className)} {...rest}>{children}</li>
);
ListItem.displayName = "ListItem";

// Aliases
export const H1 = Heading1; export const H2 = Heading2; export const H3 = Heading3;
export const H4 = Heading4; export const H5 = Heading5; export const H6 = Heading6;
export const P = Paragraph;
`;
}

/** DTCG passthrough */
export function emitDTCG(tokens: any) {
  return JSON.stringify(tokens, null, 2);
}

/** ZIP helper — posts to your existing API route */
export async function exportAllAsZip(
  files: { path: string; contents: string }[],
  filename = "typography.zip",
) {
  const res = await fetch("/api/typography/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error("Failed to generate ZIP");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
