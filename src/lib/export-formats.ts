import { PaletteData, ExportOptions } from '@/types';
import {hexToHSL, hexToRGB} from "@/lib/utils/color-utils";

export function generateExportCode(data: PaletteData, options: ExportOptions): string {
    switch (options.preset) {
        case 'shadcn':
            return generateShadcnCSS(data, options.format);
        case 'css-variables':
            return generateCSSVariables(data, options.format);
        case 'radix':
            return generateRadixCSS(data, options.format);
        case 'tailwind':
            return generateTailwindConfig(data, options.format);
        case 'css-in-js':
            return generateCSSInJS(data, options.format);
        case 'scss':
            return generateSCSS(data, options.format);
        case 'material-ui':
            return generateMaterialUI(data, options.format);
        case 'chakra-ui':
            return generateChakraUI(data, options.format);
        default:
            return generateShadcnCSS(data, options.format);
    }
}

function formatColor(hex: string, format: string): string {
    switch (format) {
        case 'HSL_VALUES': {
            const hsl = hexToHSL(hex);
            return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
        }
        case 'HSL': {
            const hsl = hexToHSL(hex);
            return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }
        case 'RGB': {
            const rgb = hexToRGB(hex);
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        case 'HEX':
        default:
            return hex;
    }
}

function generateShadcnCSS(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `:root {
  --background: ${formatFn(data.lightBackground)};
  --foreground: ${formatFn(data.accentScale.light[11])};
  --primary: ${formatFn(data.accent)};
  --primary-foreground: ${formatFn(data.accentScale.light[0])};
  --secondary: ${formatFn(data.accentScale.light[2])};
  --secondary-foreground: ${formatFn(data.accentScale.light[11])};
  --muted: ${formatFn(data.grayScale.light[2])};
  --muted-foreground: ${formatFn(data.grayScale.light[10])};
  --accent: ${formatFn(data.accentScale.light[2])};
  --accent-foreground: ${formatFn(data.accentScale.light[10])};
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 100%;
  --border: ${formatFn(data.grayScale.light[6])};
  --input: ${formatFn(data.grayScale.light[6])};
  --ring: ${formatFn(data.accent)};

  /* Accent Scale - Light */
${data.accentScale.light.map((color, i) =>
        `  --accent-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
  
  /* Gray Scale - Light */
${data.grayScale.light.map((color, i) =>
        `  --gray-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: ${formatFn(data.darkBackground)};
    --foreground: ${formatFn(data.accentScale.dark[11])};
    --primary: ${formatFn(data.accent)};
    --primary-foreground: ${formatFn(data.accentScale.dark[0])};
    --secondary: ${formatFn(data.accentScale.dark[2])};
    --secondary-foreground: ${formatFn(data.accentScale.dark[11])};
    --muted: ${formatFn(data.grayScale.dark[2])};
    --muted-foreground: ${formatFn(data.grayScale.dark[10])};
    --accent: ${formatFn(data.accentScale.dark[2])};
    --accent-foreground: ${formatFn(data.accentScale.dark[10])};
    --border: ${formatFn(data.grayScale.dark[6])};
    --input: ${formatFn(data.grayScale.dark[6])};
    --ring: ${formatFn(data.accent)};

    /* Accent Scale - Dark */
${data.accentScale.dark.map((color, i) =>
        `    --accent-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
    
    /* Gray Scale - Dark */
${data.grayScale.dark.map((color, i) =>
        `    --gray-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
  }
}`;
}

function generateCSSVariables(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `:root {
  /* Accent Colors */
${data.accentScale.light.map((color, i) =>
        `  --accent-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
  
  /* Gray Colors */
${data.grayScale.light.map((color, i) =>
        `  --gray-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Accent Colors - Dark */
${data.accentScale.dark.map((color, i) =>
        `    --accent-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
    
    /* Gray Colors - Dark */
${data.grayScale.dark.map((color, i) =>
        `    --gray-${i + 1}: ${formatFn(color)};`
    ).join('\n')}
  }
}`;
}

function generateRadixCSS(data: PaletteData, format: string): string {
    return generateCSSVariables(data, format);
}

function generateTailwindConfig(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `module.exports = {
  theme: {
    extend: {
      colors: {
        accent: {
${data.accentScale.light.map((color, i) =>
        `          ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
        },
        gray: {
${data.grayScale.light.map((color, i) =>
        `          ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
        }
      }
    }
  }
}`;
}

function generateCSSInJS(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `export const colors = {
  accent: {
${data.accentScale.light.map((color, i) =>
        `    ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
  },
  gray: {
${data.grayScale.light.map((color, i) =>
        `    ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
  }
};`;
}

function generateSCSS(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `// Accent Colors
${data.accentScale.light.map((color, i) =>
        `$accent-${i + 1}: ${formatFn(color)};`
    ).join('\n')}

// Gray Colors
${data.grayScale.light.map((color, i) =>
        `$gray-${i + 1}: ${formatFn(color)};`
    ).join('\n')}`;
}

function generateMaterialUI(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '${formatFn(data.accent)}',
    },
    accent: {
${data.accentScale.light.map((color, i) =>
        `      ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
    },
    gray: {
${data.grayScale.light.map((color, i) =>
        `      ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
    }
  }
});

export default theme;`;
}

function generateChakraUI(data: PaletteData, format: string): string {
    const formatFn = (hex: string) => formatColor(hex, format);

    return `import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    accent: {
${data.accentScale.light.map((color, i) =>
        `      ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
    },
    gray: {
${data.grayScale.light.map((color, i) =>
        `      ${i + 1}: '${formatFn(color)}',`
    ).join('\n')}
    }
  }
});

export default theme;`;
}