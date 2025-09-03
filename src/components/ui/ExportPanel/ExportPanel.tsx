"use client";

import { useState } from "react";
import { ColorFormat, ExportOptions, PaletteData, StylePreset } from "@/types";
import { Button } from "@/components/ui/Button/Button";
import { ExportModal } from "@/components/ui/ExportModal/ExportModal";
import { generateExportCode } from "@/lib/export-formats";
import styles from "./ExportPanel.module.scss";
import { useMetrics } from "@/hooks/useMetrics";
import { EXPORT_FORMAT_GITHUB_ISSUES_URL } from "@/lib/utils/urls";
import RequestExportOption from "@/components/ui/RequestOption/requestOption";

interface ExportPanelProps {
  data: PaletteData;
}

const stylePresets: { value: StylePreset; label: string }[] = [
  { value: "shadcn", label: "shadcn/ui" },
  { value: "radix", label: "Radix Colors" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "css-variables", label: "CSS Variables" },
  { value: "css-in-js", label: "CSS-in-JS" },
  { value: "scss", label: "SCSS" },
  { value: "material-ui", label: "Material-UI" },
  { value: "chakra-ui", label: "Chakra UI" },
];

const colorFormats: { value: ColorFormat; label: string }[] = [
  { value: "HEX", label: "HEX" },
  { value: "RGB", label: "RGB" },
  { value: "HSL", label: "HSL" },
  { value: "HSL_VALUES", label: "HSL Values" },
  { value: "OKLAB", label: "OKLAB" },
  { value: "OKLCH", label: "OKLCH" },
];

export function ExportPanel({ data }: ExportPanelProps) {
  const [options, setOptions] = useState<ExportOptions>({
    preset: "shadcn",
    format: "HSL_VALUES",
  });
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    trackExportButton,
    trackDevPreset,
    trackDevFormat,
    trackDevCopy,
    trackShowCode,
    trackHideCode,
  } = useMetrics();

  const code = generateExportCode(data, options);

  const handleCopy = async () => {
    trackDevCopy();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Copy failed";
      console.error("Failed to copy:", err, errorMessage);
    }
  };

  const handleExport = () => {
    trackExportButton();

    setIsModalOpen(true);
  };

  const handlePresetChange = (preset: StylePreset) => {
    trackDevPreset(preset);

    setOptions((prev) => ({ ...prev, preset }));
  };

  const handleFormatChange = (format: ColorFormat) => {
    trackDevFormat(format);
    setOptions((prev) => ({ ...prev, format }));
  };

  const handleToggleCode = () => {
    const newShowCode = !showCode;
    if (newShowCode) {
      trackShowCode();
    } else {
      trackHideCode();
    }
    setShowCode(newShowCode);
  };

  return (
    <>
      <div id={"export"} className={styles.container}>
        <div className={styles.panelHeader}>
          <h2 className={styles.title}>Export Your Color Palette</h2>
          <p className={styles.subTitle}>
            Download your custom color palette in various formats. Perfect for
            designers, developers, and anyone who wants to save and share their
            colors.
          </p>
          <Button type={"button"} variant={"primary"} onClick={handleExport}>
            Start Export
          </Button>
        </div>

        <div className={styles.panelContent}>
          <h3 className={styles.forDevsTitle}>Developer Tools</h3>
          <p className={styles.forDevsSubTitle}>
            Generate ready-to-use code for your favorite framework or CSS
            preprocessor. Choose your preferred style format and color notation
            below.
          </p>
          <RequestExportOption />
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Framework/Style</label>
              <select
                className={styles.select}
                value={options.preset}
                onChange={(e) =>
                  handlePresetChange(e.target.value as StylePreset)
                }
              >
                {stylePresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Color Format</label>
              <select
                className={styles.select}
                value={options.format}
                onChange={(e) =>
                  handleFormatChange(e.target.value as ColorFormat)
                }
              >
                {colorFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleToggleCode}
              variant="outline"
              className={styles.showCodeButton}
            >
              {showCode ? "Hide Code" : "Generate Code"}
            </Button>
          </div>

          {showCode && (
            <div className={styles.codeContainer}>
              <div className={styles.codeHeader}>
                <span className={styles.codeTitle}>
                  {stylePresets.find((p) => p.value === options.preset)?.label}{" "}
                  •{" "}
                  {colorFormats.find((f) => f.value === options.format)?.label}
                </span>
                <Button
                  className={styles.copy}
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className={styles.codeBlock}>
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>

        <ExportModal
          data={data}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}
