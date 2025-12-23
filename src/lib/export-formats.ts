import { PaletteData, ExportOptions, SemanticColorSet } from "@/types";
import { hexToHSL, hexToRGB } from "@/lib/utils/color-utils";
import { getBestForegroundStep } from "@/lib/utils/color/contrast-utils";

export function generateExportCode(
  data: PaletteData,
  options: ExportOptions,
): string {
  switch (options.preset) {
    case "shadcn":
      return generateShadcnCSS(data, options.format);
    case "css-variables":
      return generateCSSVariables(data, options.format);
    case "radix":
      return generateRadixCSS(data, options.format);
    case "tailwind":
      return generateTailwindConfig(data, options.format);
    case "css-in-js":
      return generateCSSInJS(data, options.format);
    case "scss":
      return generateSCSS(data, options.format);
    case "material-ui":
      return generateMaterialUI(data, options.format);
    case "chakra-ui":
      return generateChakraUI(data, options.format);
    default:
      return generateShadcnCSS(data, options.format);
  }
}

function formatColor(hex: string, format: string): string {
  switch (format) {
    case "HSL_VALUES": {
      const hsl = hexToHSL(hex);
      return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
    }
    case "HSL": {
      const hsl = hexToHSL(hex);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    case "RGB": {
      const rgb = hexToRGB(hex);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    case "HEX":
    default:
      return hex;
  }
}

/**
 * Helper to format a single semantic color set for CSS variables
 */
function formatSemanticColorSet(
  name: string,
  colorSet: SemanticColorSet,
  format: string,
  indent: string = "  ",
): string {
  const formatFn = (hex: string) => formatColor(hex, format);
  return [
    `${indent}--${name}: ${formatFn(colorSet.base)};`,
    `${indent}--${name}-foreground: ${formatFn(colorSet.foreground)};`,
    `${indent}--${name}-muted: ${formatFn(colorSet.muted)};`,
    `${indent}--${name}-muted-foreground: ${formatFn(colorSet.mutedForeground)};`,
    `${indent}--${name}-border: ${formatFn(colorSet.border)};`,
  ].join("\n");
}

function generateShadcnCSS(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate best foreground steps for light theme
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
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
    true,
  );
  const lightAccentForegroundStep = getBestForegroundStep(
    data.accentScale.light[2],
    data.accentScale.light,
  );

  // Calculate best foreground steps for dark theme
  const darkForegroundStep = getBestForegroundStep(
    data.darkBackground,
    data.grayScale.dark,
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
    true,
  );
  const darkAccentForegroundStep = getBestForegroundStep(
    data.accentScale.dark[2],
    data.accentScale.dark,
  );

  // Calculate harmony foreground steps for light theme
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  // Calculate harmony foreground steps for dark theme
  const darkAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.dark[8],
    data.analogous.accentScale.dark,
  );
  const darkComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.dark[8],
    data.complementary.accentScale.dark,
  );

  return `:root {
  --background: ${formatFn(data.lightBackground)};
  --foreground: ${formatFn(data.grayScale.light[lightForegroundStep])};
  --foreground-subtle: ${formatFn(data.grayScale.light[9])};
  --primary: ${formatFn(data.accent)};
  --primary-foreground: ${formatFn(data.accentScale.light[lightPrimaryForegroundStep])};
  --secondary: ${formatFn(data.accentScale.light[2])};
  --secondary-foreground: ${formatFn(data.accentScale.light[lightSecondaryForegroundStep])};
  --muted: ${formatFn(data.grayScale.light[2])};
  --muted-foreground: ${formatFn(data.grayScale.light[10])};
  --accent: ${formatFn(data.accentScale.light[2])};
  --accent-foreground: ${formatFn(data.accentScale.light[lightAccentForegroundStep])};
  --destructive: ${formatFn(data.semantic.light.danger.base)};
  --destructive-foreground: ${formatFn(data.semantic.light.danger.foreground)};
  --border: ${formatFn(data.grayScale.light[6])};
  --input: ${formatFn(data.grayScale.light[6])};
  --ring: ${formatFn(data.accent)};
  --analogous: ${formatFn(data.analogous.accentScale.light[8])};
  --analogous-foreground: ${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])};
  --complementary: ${formatFn(data.complementary.accentScale.light[8])};
  --complementary-foreground: ${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])};

  /* Accent Scale - Light */
${data.accentScale.light
  .map((color, i) => `  --accent-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

  /* Gray Scale - Light */
${data.grayScale.light
  .map((color, i) => `  --gray-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

  /* Semantic Colors - Light */
${formatSemanticColorSet("success", data.semantic.light.success, format)}
${formatSemanticColorSet("danger", data.semantic.light.danger, format)}
${formatSemanticColorSet("warning", data.semantic.light.warning, format)}
${formatSemanticColorSet("info", data.semantic.light.info, format)}
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: ${formatFn(data.darkBackground)};
    --foreground: ${formatFn(data.grayScale.dark[darkForegroundStep])};
    --foreground-subtle: ${formatFn(data.grayScale.dark[9])};
    --primary: ${formatFn(data.accent)};
    --primary-foreground: ${formatFn(data.accentScale.dark[darkPrimaryForegroundStep])};
    --secondary: ${formatFn(data.accentScale.dark[2])};
    --secondary-foreground: ${formatFn(data.accentScale.dark[darkSecondaryForegroundStep])};
    --muted: ${formatFn(data.grayScale.dark[2])};
    --muted-foreground: ${formatFn(data.grayScale.dark[10])};
    --accent: ${formatFn(data.accentScale.dark[2])};
    --accent-foreground: ${formatFn(data.accentScale.dark[darkAccentForegroundStep])};
    --destructive: ${formatFn(data.semantic.dark.danger.base)};
    --destructive-foreground: ${formatFn(data.semantic.dark.danger.foreground)};
    --border: ${formatFn(data.grayScale.dark[6])};
    --input: ${formatFn(data.grayScale.dark[6])};
    --ring: ${formatFn(data.accent)};
    --analogous: ${formatFn(data.analogous.accentScale.dark[8])};
    --analogous-foreground: ${formatFn(data.analogous.accentScale.dark[darkAnalogousForegroundStep])};
    --complementary: ${formatFn(data.complementary.accentScale.dark[8])};
    --complementary-foreground: ${formatFn(data.complementary.accentScale.dark[darkComplementaryForegroundStep])};

    /* Accent Scale - Dark */
${data.accentScale.dark
  .map((color, i) => `    --accent-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

    /* Gray Scale - Dark */
${data.grayScale.dark
  .map((color, i) => `    --gray-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

    /* Semantic Colors - Dark */
${formatSemanticColorSet("success", data.semantic.dark.success, format, "    ")}
${formatSemanticColorSet("danger", data.semantic.dark.danger, format, "    ")}
${formatSemanticColorSet("warning", data.semantic.dark.warning, format, "    ")}
${formatSemanticColorSet("info", data.semantic.dark.info, format, "    ")}
  }
}`;
}

function generateCSSVariables(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const darkForegroundStep = getBestForegroundStep(
    data.darkBackground,
    data.grayScale.dark,
  );

  // Calculate analogous foreground
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const darkAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.dark[8],
    data.analogous.accentScale.dark,
  );

  // Calculate complementary foreground
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );
  const darkComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.dark[8],
    data.complementary.accentScale.dark,
  );

  return `:root {
  /* Base */
  --background: ${formatFn(data.lightBackground)};
  --foreground: ${formatFn(data.grayScale.light[lightForegroundStep])};

  /* Accent Colors */
${data.accentScale.light
  .map((color, i) => `  --accent-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

  /* Gray Colors */
${data.grayScale.light
  .map((color, i) => `  --gray-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

  /* Analogous Harmony */
  --analogous: ${formatFn(data.analogous.accentScale.light[8])};
  --analogous-foreground: ${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])};

  /* Complementary Harmony */
  --complementary: ${formatFn(data.complementary.accentScale.light[8])};
  --complementary-foreground: ${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])};

  /* Semantic Colors */
${formatSemanticColorSet("success", data.semantic.light.success, format)}
${formatSemanticColorSet("danger", data.semantic.light.danger, format)}
${formatSemanticColorSet("warning", data.semantic.light.warning, format)}
${formatSemanticColorSet("info", data.semantic.light.info, format)}
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Base */
    --background: ${formatFn(data.darkBackground)};
    --foreground: ${formatFn(data.grayScale.dark[darkForegroundStep])};

    /* Accent Colors - Dark */
${data.accentScale.dark
  .map((color, i) => `    --accent-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

    /* Gray Colors - Dark */
${data.grayScale.dark
  .map((color, i) => `    --gray-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

    /* Analogous Harmony - Dark */
    --analogous: ${formatFn(data.analogous.accentScale.dark[8])};
    --analogous-foreground: ${formatFn(data.analogous.accentScale.dark[darkAnalogousForegroundStep])};

    /* Complementary Harmony - Dark */
    --complementary: ${formatFn(data.complementary.accentScale.dark[8])};
    --complementary-foreground: ${formatFn(data.complementary.accentScale.dark[darkComplementaryForegroundStep])};

    /* Semantic Colors - Dark */
${formatSemanticColorSet("success", data.semantic.dark.success, format, "    ")}
${formatSemanticColorSet("danger", data.semantic.dark.danger, format, "    ")}
${formatSemanticColorSet("warning", data.semantic.dark.warning, format, "    ")}
${formatSemanticColorSet("info", data.semantic.dark.info, format, "    ")}
  }
}`;
}

function generateRadixCSS(data: PaletteData, format: string): string {
  return generateCSSVariables(data, format);
}

function generateTailwindConfig(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  return `module.exports = {
  theme: {
    extend: {
      colors: {
        background: '${formatFn(data.lightBackground)}',
        foreground: '${formatFn(data.grayScale.light[lightForegroundStep])}',
        accent: {
${data.accentScale.light
  .map((color, i) => `          ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
        },
        gray: {
${data.grayScale.light
  .map((color, i) => `          ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
        },
        analogous: {
          DEFAULT: '${formatFn(data.analogous.accentScale.light[8])}',
          foreground: '${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])}',
        },
        complementary: {
          DEFAULT: '${formatFn(data.complementary.accentScale.light[8])}',
          foreground: '${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])}',
        },
        success: {
          DEFAULT: '${formatFn(data.semantic.light.success.base)}',
          foreground: '${formatFn(data.semantic.light.success.foreground)}',
          muted: '${formatFn(data.semantic.light.success.muted)}',
          'muted-foreground': '${formatFn(data.semantic.light.success.mutedForeground)}',
          border: '${formatFn(data.semantic.light.success.border)}',
        },
        danger: {
          DEFAULT: '${formatFn(data.semantic.light.danger.base)}',
          foreground: '${formatFn(data.semantic.light.danger.foreground)}',
          muted: '${formatFn(data.semantic.light.danger.muted)}',
          'muted-foreground': '${formatFn(data.semantic.light.danger.mutedForeground)}',
          border: '${formatFn(data.semantic.light.danger.border)}',
        },
        warning: {
          DEFAULT: '${formatFn(data.semantic.light.warning.base)}',
          foreground: '${formatFn(data.semantic.light.warning.foreground)}',
          muted: '${formatFn(data.semantic.light.warning.muted)}',
          'muted-foreground': '${formatFn(data.semantic.light.warning.mutedForeground)}',
          border: '${formatFn(data.semantic.light.warning.border)}',
        },
        info: {
          DEFAULT: '${formatFn(data.semantic.light.info.base)}',
          foreground: '${formatFn(data.semantic.light.info.foreground)}',
          muted: '${formatFn(data.semantic.light.info.muted)}',
          'muted-foreground': '${formatFn(data.semantic.light.info.mutedForeground)}',
          border: '${formatFn(data.semantic.light.info.border)}',
        }
      }
    }
  }
}`;
}

function generateCSSInJS(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  return `export const colors = {
  background: '${formatFn(data.lightBackground)}',
  foreground: '${formatFn(data.grayScale.light[lightForegroundStep])}',
  accent: {
${data.accentScale.light
  .map((color, i) => `    ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
  },
  gray: {
${data.grayScale.light
  .map((color, i) => `    ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
  },
  analogous: {
    base: '${formatFn(data.analogous.accentScale.light[8])}',
    foreground: '${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])}',
  },
  complementary: {
    base: '${formatFn(data.complementary.accentScale.light[8])}',
    foreground: '${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])}',
  },
  semantic: {
    success: {
      base: '${formatFn(data.semantic.light.success.base)}',
      foreground: '${formatFn(data.semantic.light.success.foreground)}',
      muted: '${formatFn(data.semantic.light.success.muted)}',
      mutedForeground: '${formatFn(data.semantic.light.success.mutedForeground)}',
      border: '${formatFn(data.semantic.light.success.border)}',
    },
    danger: {
      base: '${formatFn(data.semantic.light.danger.base)}',
      foreground: '${formatFn(data.semantic.light.danger.foreground)}',
      muted: '${formatFn(data.semantic.light.danger.muted)}',
      mutedForeground: '${formatFn(data.semantic.light.danger.mutedForeground)}',
      border: '${formatFn(data.semantic.light.danger.border)}',
    },
    warning: {
      base: '${formatFn(data.semantic.light.warning.base)}',
      foreground: '${formatFn(data.semantic.light.warning.foreground)}',
      muted: '${formatFn(data.semantic.light.warning.muted)}',
      mutedForeground: '${formatFn(data.semantic.light.warning.mutedForeground)}',
      border: '${formatFn(data.semantic.light.warning.border)}',
    },
    info: {
      base: '${formatFn(data.semantic.light.info.base)}',
      foreground: '${formatFn(data.semantic.light.info.foreground)}',
      muted: '${formatFn(data.semantic.light.info.muted)}',
      mutedForeground: '${formatFn(data.semantic.light.info.mutedForeground)}',
      border: '${formatFn(data.semantic.light.info.border)}',
    },
  }
};`;
}

function generateSCSS(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  return `// Base
$background: ${formatFn(data.lightBackground)};
$foreground: ${formatFn(data.grayScale.light[lightForegroundStep])};

// Accent Colors
${data.accentScale.light
  .map((color, i) => `$accent-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

// Gray Colors
${data.grayScale.light
  .map((color, i) => `$gray-${i + 1}: ${formatFn(color)};`)
  .join("\n")}

// Harmony - Analogous
$analogous: ${formatFn(data.analogous.accentScale.light[8])};
$analogous-foreground: ${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])};

// Harmony - Complementary
$complementary: ${formatFn(data.complementary.accentScale.light[8])};
$complementary-foreground: ${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])};

// Semantic Colors - Success
$success: ${formatFn(data.semantic.light.success.base)};
$success-foreground: ${formatFn(data.semantic.light.success.foreground)};
$success-muted: ${formatFn(data.semantic.light.success.muted)};
$success-muted-foreground: ${formatFn(data.semantic.light.success.mutedForeground)};
$success-border: ${formatFn(data.semantic.light.success.border)};

// Semantic Colors - Danger
$danger: ${formatFn(data.semantic.light.danger.base)};
$danger-foreground: ${formatFn(data.semantic.light.danger.foreground)};
$danger-muted: ${formatFn(data.semantic.light.danger.muted)};
$danger-muted-foreground: ${formatFn(data.semantic.light.danger.mutedForeground)};
$danger-border: ${formatFn(data.semantic.light.danger.border)};

// Semantic Colors - Warning
$warning: ${formatFn(data.semantic.light.warning.base)};
$warning-foreground: ${formatFn(data.semantic.light.warning.foreground)};
$warning-muted: ${formatFn(data.semantic.light.warning.muted)};
$warning-muted-foreground: ${formatFn(data.semantic.light.warning.mutedForeground)};
$warning-border: ${formatFn(data.semantic.light.warning.border)};

// Semantic Colors - Info
$info: ${formatFn(data.semantic.light.info.base)};
$info-foreground: ${formatFn(data.semantic.light.info.foreground)};
$info-muted: ${formatFn(data.semantic.light.info.muted)};
$info-muted-foreground: ${formatFn(data.semantic.light.info.mutedForeground)};
$info-border: ${formatFn(data.semantic.light.info.border)};`;
}

function generateMaterialUI(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '${formatFn(data.lightBackground)}',
    },
    text: {
      primary: '${formatFn(data.grayScale.light[lightForegroundStep])}',
    },
    primary: {
      main: '${formatFn(data.accent)}',
    },
    secondary: {
      main: '${formatFn(data.analogous.accentScale.light[8])}',
      contrastText: '${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])}',
    },
    success: {
      main: '${formatFn(data.semantic.light.success.base)}',
      contrastText: '${formatFn(data.semantic.light.success.foreground)}',
    },
    error: {
      main: '${formatFn(data.semantic.light.danger.base)}',
      contrastText: '${formatFn(data.semantic.light.danger.foreground)}',
    },
    warning: {
      main: '${formatFn(data.semantic.light.warning.base)}',
      contrastText: '${formatFn(data.semantic.light.warning.foreground)}',
    },
    info: {
      main: '${formatFn(data.semantic.light.info.base)}',
      contrastText: '${formatFn(data.semantic.light.info.foreground)}',
    },
    accent: {
${data.accentScale.light
  .map((color, i) => `      ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
    },
    gray: {
${data.grayScale.light
  .map((color, i) => `      ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
    },
    analogous: {
      main: '${formatFn(data.analogous.accentScale.light[8])}',
      contrastText: '${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])}',
    },
    complementary: {
      main: '${formatFn(data.complementary.accentScale.light[8])}',
      contrastText: '${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])}',
    }
  }
});

export default theme;`;
}

function generateChakraUI(data: PaletteData, format: string): string {
  const formatFn = (hex: string) => formatColor(hex, format);

  // Calculate foreground steps
  const lightForegroundStep = getBestForegroundStep(
    data.lightBackground,
    data.grayScale.light,
  );
  const lightAnalogousForegroundStep = getBestForegroundStep(
    data.analogous.accentScale.light[8],
    data.analogous.accentScale.light,
  );
  const lightComplementaryForegroundStep = getBestForegroundStep(
    data.complementary.accentScale.light[8],
    data.complementary.accentScale.light,
  );

  return `import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    background: '${formatFn(data.lightBackground)}',
    foreground: '${formatFn(data.grayScale.light[lightForegroundStep])}',
    accent: {
${data.accentScale.light
  .map((color, i) => `      ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
    },
    gray: {
${data.grayScale.light
  .map((color, i) => `      ${i + 1}: '${formatFn(color)}',`)
  .join("\n")}
    },
    analogous: {
      base: '${formatFn(data.analogous.accentScale.light[8])}',
      fg: '${formatFn(data.analogous.accentScale.light[lightAnalogousForegroundStep])}',
    },
    complementary: {
      base: '${formatFn(data.complementary.accentScale.light[8])}',
      fg: '${formatFn(data.complementary.accentScale.light[lightComplementaryForegroundStep])}',
    },
    success: {
      base: '${formatFn(data.semantic.light.success.base)}',
      fg: '${formatFn(data.semantic.light.success.foreground)}',
      muted: '${formatFn(data.semantic.light.success.muted)}',
      mutedFg: '${formatFn(data.semantic.light.success.mutedForeground)}',
      border: '${formatFn(data.semantic.light.success.border)}',
    },
    danger: {
      base: '${formatFn(data.semantic.light.danger.base)}',
      fg: '${formatFn(data.semantic.light.danger.foreground)}',
      muted: '${formatFn(data.semantic.light.danger.muted)}',
      mutedFg: '${formatFn(data.semantic.light.danger.mutedForeground)}',
      border: '${formatFn(data.semantic.light.danger.border)}',
    },
    warning: {
      base: '${formatFn(data.semantic.light.warning.base)}',
      fg: '${formatFn(data.semantic.light.warning.foreground)}',
      muted: '${formatFn(data.semantic.light.warning.muted)}',
      mutedFg: '${formatFn(data.semantic.light.warning.mutedForeground)}',
      border: '${formatFn(data.semantic.light.warning.border)}',
    },
    info: {
      base: '${formatFn(data.semantic.light.info.base)}',
      fg: '${formatFn(data.semantic.light.info.foreground)}',
      muted: '${formatFn(data.semantic.light.info.muted)}',
      mutedFg: '${formatFn(data.semantic.light.info.mutedForeground)}',
      border: '${formatFn(data.semantic.light.info.border)}',
    }
  }
});

export default theme;`;
}
