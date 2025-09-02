import { useEffect } from "react";
import { PaletteData } from "@/types";
import { hexToHSL } from "@/lib/utils/color-utils";
import { getBestForegroundStep } from "@/lib/utils/color/contrast-utils";

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
  // Calculate best foreground steps for main palette - light theme
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.accentScale.light,
  );
  const lightCardForegroundStep = getBestForegroundStep(
    data.grayScale.light[1],
    data.accentScale.light,
  );
  const lightPopoverForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.accentScale.light,
  );
  const lightPrimaryForegroundStep = getBestForegroundStep(
    data.accent,
    data.accentScale.light,
  );
  const lightSecondaryForegroundStep = getBestForegroundStep(
    data.accentScale.light[2],
    data.accentScale.light,
  );
  const lightMutedForegroundStep = getBestForegroundStep(
    data.grayScale.light[2],
    data.grayScale.light,
  );
  const lightAccentForegroundStep = getBestForegroundStep(
    data.accentScale.light[2],
    data.accentScale.light,
  );

  // Calculate best foreground steps for analogous palette - light theme
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.lightBackground,
    data.analogous.accentScale.light,
  );
  const lightAnalogousCardForegroundStep = getBestForegroundStep(
    data.analogous.grayScale.light[1],
    data.analogous.accentScale.light,
  );
  const lightAnalogousPopoverForegroundStep = getBestForegroundStep(
    data.analogous.lightBackground,
    data.analogous.accentScale.light,
  );
  const lightAnalogousPrimaryForegroundStep = getBestForegroundStep(
    data.analogous.accent,
    data.analogous.accentScale.light,
  );
  const lightAnalogousSecondaryForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[2],
    data.analogous.accentScale.light,
  );
  const lightAnalogousMutedForegroundStep = getBestForegroundStep(
    data.analogous.grayScale.light[2],
    data.analogous.grayScale.light,
  );
  const lightAnalogousAccentForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[2],
    data.analogous.accentScale.light,
  );

  // Calculate best foreground steps for main palette - dark theme
  const darkForegroundStep = getBestForegroundStep(
    data.darkBackground,
    data.accentScale.dark,
  );
  const darkCardForegroundStep = getBestForegroundStep(
    data.grayScale.dark[1],
    data.accentScale.dark,
  );
  const darkPopoverForegroundStep = getBestForegroundStep(
    data.grayScale.dark[2],
    data.accentScale.dark,
  );
  const darkPrimaryForegroundStep = getBestForegroundStep(
    data.accent,
    data.accentScale.dark,
  );
  const darkSecondaryForegroundStep = getBestForegroundStep(
    data.accentScale.dark[2],
    data.accentScale.dark,
  );
  const darkMutedForegroundStep = getBestForegroundStep(
    data.grayScale.dark[2],
    data.grayScale.dark,
  );
  const darkAccentForegroundStep = getBestForegroundStep(
    data.accentScale.dark[2],
    data.accentScale.dark,
  );

  // Calculate best foreground steps for analogous palette - dark theme
  const darkAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.darkBackground,
    data.analogous.accentScale.dark,
  );
  const darkAnalogousCardForegroundStep = getBestForegroundStep(
    data.analogous.grayScale.dark[1],
    data.analogous.accentScale.dark,
  );
  const darkAnalogousPopoverForegroundStep = getBestForegroundStep(
    data.analogous.grayScale.dark[2],
    data.analogous.accentScale.dark,
  );
  const darkAnalogousPrimaryForegroundStep = getBestForegroundStep(
    data.analogous.accent,
    data.analogous.accentScale.dark,
  );
  const darkAnalogousSecondaryForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.dark[2],
    data.analogous.accentScale.dark,
  );
  const darkAnalogousMutedForegroundStep = getBestForegroundStep(
    data.analogous.grayScale.dark[2],
    data.analogous.grayScale.dark,
  );
  const darkAnalogousAccentForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.dark[2],
    data.analogous.accentScale.dark,
  );

  return {
    light: {
      "--background": hexToHSLValues(data.lightBackground),
      "--foreground": hexToHSLValues(
        data.accentScale.light[lightForegroundStep],
      ),
      "--foreground-subtle": hexToHSLValues(data.grayScale.light[10]),
      "--card": hexToHSLValues(data.grayScale.light[1]),
      "--card-foreground": hexToHSLValues(
        data.accentScale.light[lightCardForegroundStep],
      ),
      "--popover": hexToHSLValues(data.lightBackground),
      "--popover-foreground": hexToHSLValues(
        data.accentScale.light[lightPopoverForegroundStep],
      ),
      "--primary": hexToHSLValues(data.accent),
      "--primary-foreground": hexToHSLValues(
        data.accentScale.light[lightPrimaryForegroundStep],
      ),
      "--secondary": hexToHSLValues(data.accentScale.light[2]),
      "--secondary-foreground": hexToHSLValues(
        data.accentScale.light[lightSecondaryForegroundStep],
      ),
      "--muted": hexToHSLValues(data.grayScale.light[2]),
      "--muted-foreground": hexToHSLValues(
        data.grayScale.light[lightMutedForegroundStep],
      ),
      "--accent": hexToHSLValues(data.accentScale.light[2]),
      "--accent-foreground": hexToHSLValues(
        data.accentScale.light[lightAccentForegroundStep],
      ),
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
      "--a-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousForegroundStep],
      ),
      "--a-foreground-subtle": hexToHSLValues(
        data.analogous.grayScale.light[10],
      ),
      "--a-card": hexToHSLValues(data.analogous.grayScale.light[1]),
      "--a-card-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousCardForegroundStep],
      ),
      "--a-popover": hexToHSLValues(data.analogous.lightBackground),
      "--a-popover-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousPopoverForegroundStep],
      ),
      "--a-primary": hexToHSLValues(data.analogous.accent),
      "--a-primary-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousPrimaryForegroundStep],
      ),
      "--a-secondary": hexToHSLValues(data.analogous.accentScale.light[2]),
      "--a-secondary-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousSecondaryForegroundStep],
      ),
      "--a-muted": hexToHSLValues(data.analogous.grayScale.light[2]),
      "--a-muted-foreground": hexToHSLValues(
        data.analogous.grayScale.light[lightAnalogousMutedForegroundStep],
      ),
      "--a-accent": hexToHSLValues(data.analogous.accentScale.light[2]),
      "--a-accent-foreground": hexToHSLValues(
        data.analogous.accentScale.light[lightAnalogousAccentForegroundStep],
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
      "--foreground": hexToHSLValues(data.accentScale.dark[darkForegroundStep]),
      "--foreground-subtle": hexToHSLValues(data.grayScale.dark[10]),
      "--card": hexToHSLValues(data.grayScale.dark[1]),
      "--card-foreground": hexToHSLValues(
        data.accentScale.dark[darkCardForegroundStep],
      ),
      "--popover": hexToHSLValues(data.grayScale.dark[2]),
      "--popover-foreground": hexToHSLValues(
        data.accentScale.dark[darkPopoverForegroundStep],
      ),
      "--primary": hexToHSLValues(data.accent),
      "--primary-foreground": hexToHSLValues(
        data.accentScale.dark[darkPrimaryForegroundStep],
      ),
      "--secondary": hexToHSLValues(data.accentScale.dark[2]),
      "--secondary-foreground": hexToHSLValues(
        data.accentScale.dark[darkSecondaryForegroundStep],
      ),
      "--muted": hexToHSLValues(data.grayScale.dark[2]),
      "--muted-foreground": hexToHSLValues(
        data.grayScale.dark[darkMutedForegroundStep],
      ),
      "--accent": hexToHSLValues(data.accentScale.dark[2]),
      "--accent-foreground": hexToHSLValues(
        data.accentScale.dark[darkAccentForegroundStep],
      ),
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
      "--a-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousForegroundStep],
      ),
      "--a-foreground-subtle": hexToHSLValues(
        data.analogous.grayScale.dark[10],
      ),
      "--a-card": hexToHSLValues(data.analogous.grayScale.dark[1]),
      "--a-card-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousCardForegroundStep],
      ),
      "--a-popover": hexToHSLValues(data.analogous.grayScale.dark[2]),
      "--a-popover-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousPopoverForegroundStep],
      ),
      "--a-primary": hexToHSLValues(data.analogous.accent),
      "--a-primary-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousPrimaryForegroundStep],
      ),
      "--a-secondary": hexToHSLValues(data.analogous.accentScale.dark[2]),
      "--a-secondary-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousSecondaryForegroundStep],
      ),
      "--a-muted": hexToHSLValues(data.analogous.grayScale.dark[2]),
      "--a-muted-foreground": hexToHSLValues(
        data.analogous.grayScale.dark[darkAnalogousMutedForegroundStep],
      ),
      "--a-accent": hexToHSLValues(data.analogous.accentScale.dark[2]),
      "--a-accent-foreground": hexToHSLValues(
        data.analogous.accentScale.dark[darkAnalogousAccentForegroundStep],
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

    return applyThemeToDocument(mapping);
  }, [paletteData]);
}
