import { PaletteData } from "@/types";
import { ExportFormat } from "@/components/ExportModal/ExportModal";

export async function generateDownloadFile(
  data: PaletteData,
  format: ExportFormat,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<void> {
  const fileName = `color-palette-${new Date().toISOString().split("T")[0]}`;
  let content: string;
  let mimeType: string;
  let extension: string;

  try {
    switch (format) {
      case "json":
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        extension = "json";
        break;

      case "readable-txt":
        content = generateReadableText(data);
        mimeType = "text/plain";
        extension = "txt";
        break;

      case "css-variables":
        content = generateCSSVariables(data);
        mimeType = "text/css";
        extension = "css";
        break;

      case "color-swatches":
        content = generateColorSwatches(data);
        mimeType = "text/plain";
        extension = "txt";
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    onSuccess?.();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    onError?.(errorMessage);
    throw error;
  }
}

function generateReadableText(data: PaletteData): string {
  const sections: string[] = [
    "COLOR PALETTE",
    "=".repeat(50),
    "",
    `Primary Colors:`,
    `• Accent: ${data.accent}`,
    `• Gray: ${data.gray}`,
    "",
    `Background Colors:`,
    `• Light: ${data.lightBackground}`,
    `• Dark: ${data.darkBackground}`,
    "",
  ];

  sections.push("LIGHT THEME", "-".repeat(30), "");
  sections.push("Accent Scale:");
  data.accentScale.light.forEach((color, index) => {
    sections.push(`• Step ${index + 1}: ${color}`);
  });

  sections.push("", "Gray Scale:");
  data.grayScale.light.forEach((color, index) => {
    sections.push(`• Step ${index + 1}: ${color}`);
  });

  sections.push("", "", "DARK THEME", "-".repeat(30), "");
  sections.push("Accent Scale:");
  data.accentScale.dark.forEach((color, index) => {
    sections.push(`• Step ${index + 1}: ${color}`);
  });

  sections.push("", "Gray Scale:");
  data.grayScale.dark.forEach((color, index) => {
    sections.push(`• Step ${index + 1}: ${color}`);
  });

  sections.push("", "", `Generated on: ${new Date().toLocaleDateString()}`);

  return sections.join("\n");
}

function generateCSSVariables(data: PaletteData): string {
  const sections: string[] = [
    "/* Color Palette CSS Variables */",
    "/* Generated on: " + new Date().toLocaleDateString() + " */",
    "",
    ":root {",
    "  /* Primary Colors */",
    `  --accent: ${data.accent};`,
    `  --gray: ${data.gray};`,
    `  --background-light: ${data.lightBackground};`,
    `  --background-dark: ${data.darkBackground};`,
    "",
    "  /* Light Theme - Accent Scale */",
  ];

  data.accentScale.light.forEach((color, index) => {
    sections.push(`  --accent-${index + 1}: ${color};`);
  });

  sections.push("", "  /* Light Theme - Gray Scale */");
  data.grayScale.light.forEach((color, index) => {
    sections.push(`  --gray-${index + 1}: ${color};`);
  });

  sections.push("}");
  sections.push("");
  sections.push("[data-theme='dark'] {");
  sections.push("  /* Dark Theme - Accent Scale */");

  data.accentScale.dark.forEach((color, index) => {
    sections.push(`  --accent-${index + 1}: ${color};`);
  });

  sections.push("", "  /* Dark Theme - Gray Scale */");
  data.grayScale.dark.forEach((color, index) => {
    sections.push(`  --gray-${index + 1}: ${color};`);
  });

  sections.push("}");

  return sections.join("\n");
}

function generateColorSwatches(data: PaletteData): string {
  const sections: string[] = [
    "COLOR PALETTE REFERENCE",
    "=".repeat(60),
    "",
    "QUICK REFERENCE:",
    `Primary Accent: ${data.accent}`,
    `Primary Gray: ${data.gray}`,
    "",
  ];

  sections.push("LIGHT THEME COLORS:");
  sections.push("━".repeat(40));
  sections.push("");

  sections.push("Accent Colors (Light to Dark):");
  data.accentScale.light.forEach((color, index) => {
    const step = String(index + 1).padStart(2, " ");
    sections.push(`${step}. ${color} ${"█".repeat(3)}`);
  });

  sections.push("");
  sections.push("Gray Colors (Light to Dark):");
  data.grayScale.light.forEach((color, index) => {
    const step = String(index + 1).padStart(2, " ");
    sections.push(`${step}. ${color} ${"█".repeat(3)}`);
  });

  sections.push("");
  sections.push("DARK THEME COLORS:");
  sections.push("━".repeat(40));
  sections.push("");

  sections.push("Accent Colors (Light to Dark):");
  data.accentScale.dark.forEach((color, index) => {
    const step = String(index + 1).padStart(2, " ");
    sections.push(`${step}. ${color} ${"█".repeat(3)}`);
  });

  sections.push("");
  sections.push("Gray Colors (Light to Dark):");
  data.grayScale.dark.forEach((color, index) => {
    const step = String(index + 1).padStart(2, " ");
    sections.push(`${step}. ${color} ${"█".repeat(3)}`);
  });

  sections.push("");
  sections.push(`Generated: ${new Date().toLocaleString()}`);

  return sections.join("\n");
}
