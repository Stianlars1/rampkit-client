import { useEffect } from "react";
import { PaletteData } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";

interface ThemeMapping {
  light: Record<string, string>;
  lightAnalogous: Record<string, string>;
  dark: Record<string, string>;
  darkAnalogous: Record<string, string>;
}

function hexToHSLValues(hex: string): string {
  const hsl = hexToHSL(hex);
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

function generateThemeMapping(data: PaletteData): ThemeMapping {
  return {
    light: {
      "--background": hexToHSLValues(data.lightBackground),
      "--foreground": hexToHSLValues(data.accentScale.light[11]),
      "--foreground-subtle": hexToHSLValues(data.grayScale.light[10]),
      "--card": hexToHSLValues(data.grayScale.light[1]),
      "--card-foreground": hexToHSLValues(data.accentScale.light[11]),
      "--popover": hexToHSLValues(data.lightBackground),
      "--popover-foreground": hexToHSLValues(data.accentScale.light[11]),
      "--primary": hexToHSLValues(data.accent),
      "--primary-foreground": hexToHSLValues(data.accentScale.light[11]),
      "--secondary": hexToHSLValues(data.accentScale.light[2]),
      "--secondary-foreground": hexToHSLValues(data.accentScale.light[11]),
      "--muted": hexToHSLValues(data.grayScale.light[2]),
      "--muted-foreground": hexToHSLValues(data.grayScale.light[10]),
      "--accent": hexToHSLValues(data.accentScale.light[2]),
      "--accent-foreground": hexToHSLValues(data.accentScale.light[10]),
      "--border": hexToHSLValues(data.grayScale.light[6]),
      "--input": hexToHSLValues(data.grayScale.light[6]),
      "--ring": hexToHSLValues(data.accent),

      // Accent scale
      ...data.accentScale.light.reduce(
        (acc, color, index) => {
          acc[`--accent-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),

      // Gray scale
      ...data.grayScale.light.reduce(
        (acc, color, index) => {
          acc[`--gray-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    lightAnalogous: {
      "--a-background": hexToHSLValues(data.analogous.lightBackground),
      "--a-foreground": hexToHSLValues(data.analogous.accentScale.light[11]),
      "--a-foreground-subtle": hexToHSLValues(
        data.analogous.grayScale.light[10],
      ),
      "--a-card": hexToHSLValues(data.analogous.grayScale.light[1]),
      "--a-card-foreground": hexToHSLValues(
        data.analogous.accentScale.light[11],
      ),
      "--a-popover": hexToHSLValues(data.analogous.lightBackground),
      "--a-popover-foreground": hexToHSLValues(
        data.analogous.accentScale.light[11],
      ),
      "--a-primary": hexToHSLValues(data.analogous.accent),
      "--a-primary-foreground": hexToHSLValues(
        data.analogous.accentScale.light[11],
      ),
      "--a-secondary": hexToHSLValues(data.analogous.accentScale.light[2]),
      "--a-secondary-foreground": hexToHSLValues(
        data.analogous.accentScale.light[11],
      ),
      "--a-muted": hexToHSLValues(data.analogous.grayScale.light[2]),
      "--a-muted-foreground": hexToHSLValues(
        data.analogous.grayScale.light[10],
      ),
      "--a-accent": hexToHSLValues(data.analogous.accentScale.light[2]),
      "--a-accent-foreground": hexToHSLValues(
        data.analogous.accentScale.light[10],
      ),
      "--a-border": hexToHSLValues(data.analogous.grayScale.light[6]),
      "--a-input": hexToHSLValues(data.analogous.grayScale.light[6]),
      "--a-ring": hexToHSLValues(data.analogous.accent),

      // Accent scale
      ...data.analogous.accentScale.light.reduce(
        (acc, color, index) => {
          acc[`--a-accent-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),

      // Gray scale
      ...data.analogous.grayScale.light.reduce(
        (acc, color, index) => {
          acc[`--a-gray-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    dark: {
      "--background": hexToHSLValues(data.darkBackground),
      "--foreground": hexToHSLValues(data.accentScale.dark[11]),
      "--foreground-subtle": hexToHSLValues(data.grayScale.dark[10]),
      "--card": hexToHSLValues(data.grayScale.dark[1]),
      "--card-foreground": hexToHSLValues(data.accentScale.dark[11]),
      "--popover": hexToHSLValues(data.grayScale.dark[2]),
      "--popover-foreground": hexToHSLValues(data.accentScale.dark[11]),
      "--primary": hexToHSLValues(data.accent),
      "--primary-foreground": hexToHSLValues(data.accentScale.dark[0]),
      "--secondary": hexToHSLValues(data.accentScale.dark[2]),
      "--secondary-foreground": hexToHSLValues(data.accentScale.dark[11]),
      "--muted": hexToHSLValues(data.grayScale.dark[2]),
      "--muted-foreground": hexToHSLValues(data.grayScale.dark[10]),
      "--accent": hexToHSLValues(data.accentScale.dark[2]),
      "--accent-foreground": hexToHSLValues(data.accentScale.dark[10]),
      "--border": hexToHSLValues(data.grayScale.dark[6]),
      "--input": hexToHSLValues(data.grayScale.dark[6]),
      "--ring": hexToHSLValues(data.accent),

      // Accent scale
      ...data.accentScale.dark.reduce(
        (acc, color, index) => {
          acc[`--accent-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),

      // Gray scale
      ...data.grayScale.dark.reduce(
        (acc, color, index) => {
          acc[`--gray-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    darkAnalogous: {
      "--a-background": hexToHSLValues(data.analogous.darkBackground),
      "--a-foreground": hexToHSLValues(data.analogous.accentScale.dark[11]),
      "--a-foreground-subtle": hexToHSLValues(
        data.analogous.grayScale.dark[10],
      ),
      "--a-card": hexToHSLValues(data.analogous.grayScale.dark[1]),
      "--a-card-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[11],
      ),
      "--a-popover": hexToHSLValues(data.analogous.grayScale.dark[2]),
      "--a-popover-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[11],
      ),
      "--a-primary": hexToHSLValues(data.analogous.accent),
      "--a-primary-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[0],
      ),
      "--a-secondary": hexToHSLValues(data.analogous.accentScale.dark[2]),
      "--a-secondary-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[11],
      ),
      "--a-muted": hexToHSLValues(data.analogous.grayScale.dark[2]),
      "--a-muted-foreground": hexToHSLValues(data.analogous.grayScale.dark[10]),
      "--a-accent": hexToHSLValues(data.analogous.accentScale.dark[2]),
      "--a-accent-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[10],
      ),
      "--a-border": hexToHSLValues(data.analogous.grayScale.dark[6]),
      "--a-input": hexToHSLValues(data.analogous.grayScale.dark[6]),
      "--a-ring": hexToHSLValues(data.analogous.accent),

      // Accent scale
      ...data.analogous.accentScale.dark.reduce(
        (acc, color, index) => {
          acc[`--a-accent-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),

      // Gray scale
      ...data.analogous.grayScale.dark.reduce(
        (acc, color, index) => {
          acc[`--a-gray-${index + 1}`] = hexToHSLValues(color);
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
  };
}

function applyThemeToDocument(mapping: ThemeMapping): () => void {
  const themeStyleId = "dynamic-theme";
  let themeStyle = document.getElementById(themeStyleId) as HTMLStyleElement;

  if (!themeStyle) {
    themeStyle = document.createElement("style");
    themeStyle.id = themeStyleId;
    document.head.appendChild(themeStyle);
  }

  // Generate light mode CSS
  const lightModeRules = Object.entries(mapping.light)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n");

  const lightModeRulesAnalogous = Object.entries(mapping.lightAnalogous)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n");

  // Generate dark mode CSS
  const darkModeRules = Object.entries(mapping.dark)
    .map(([property, value]) => `    ${property}: ${value};`)
    .join("\n");
  const darkModeRulesAnalogous = Object.entries(mapping.darkAnalogous)
    .map(([property, value]) => `    ${property}: ${value};`)
    .join("\n");

  // Create complete stylesheet with both modes
  themeStyle.textContent = `
:root {
${lightModeRules}
${lightModeRulesAnalogous}
}

@media (prefers-color-scheme: dark) {
  :root {
${darkModeRules}
${darkModeRulesAnalogous}
  }
}`;

  // Return cleanup function
  return () => {
    if (themeStyle && themeStyle.parentNode) {
      themeStyle.parentNode.removeChild(themeStyle);
    }
  };
}

export function useThemeUpdater(paletteData: PaletteData | null) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!paletteData) {
      // Toggle true/false
      const bodyElement = document.body;
      if (bodyElement) {
        bodyElement.removeAttribute("data-has-generated-theme");
      }
      return;
    }

    const bodyElement = document.body;

    if (bodyElement) {
      bodyElement.setAttribute("data-has-generated-theme", "true");
    }

    const mapping = generateThemeMapping(paletteData);
    const cleanup = applyThemeToDocument(mapping);

    return cleanup;
  }, [paletteData]);
}
