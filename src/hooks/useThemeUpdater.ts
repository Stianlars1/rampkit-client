import { useEffect } from "react";
import { PaletteData } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";

interface ThemeMapping {
  light: Record<string, string>;
  dark: Record<string, string>;
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
      "--primary-foreground": hexToHSLValues(data.accentScale.light[0]),
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

  // Generate dark mode CSS
  const darkModeRules = Object.entries(mapping.dark)
    .map(([property, value]) => `    ${property}: ${value};`)
    .join("\n");

  // Create complete stylesheet with both modes
  themeStyle.textContent = `
:root {
${lightModeRules}
}

@media (prefers-color-scheme: dark) {
  :root {
${darkModeRules}
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
    if (!paletteData) return;

    const mapping = generateThemeMapping(paletteData);
    const cleanup = applyThemeToDocument(mapping);

    return cleanup;
  }, [paletteData]);
}
