"use client";

import { useState } from "react";
import { PaletteData, ExportOptions, StylePreset, ColorFormat } from "@/types";
import { Button } from "@/components/ui/Button/Button";
import { ExportModal } from "@/components/ExportModal/ExportModal";
import { generateExportCode } from "@/lib/export-formats";
import { useAnalytics } from "@/hooks/useAnalytics";
import styles from "./ExportPanel.module.scss";

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
    trackExportClick,
    trackExportModalOpen,
    trackDevToolsPresetChange,
    trackDevToolsFormatChange,
    trackDevToolsShowCode,
    trackDevToolsHideCode,
    trackDevToolsCopyCode,
    trackDevToolsCopySuccess,
    trackDevToolsCopyError,
  } = useAnalytics();

  const code = generateExportCode(data, options);

  const handleCopy = async () => {
    trackDevToolsCopyCode(options.preset, options.format);

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      trackDevToolsCopySuccess(options.preset, options.format);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Copy failed";
      trackDevToolsCopyError(errorMessage);
      console.error("Failed to copy:", err);
    }
  };

  const handleExport = () => {
    trackExportClick();
    trackExportModalOpen();
    setIsModalOpen(true);
  };

  const handlePresetChange = (preset: StylePreset) => {
    trackDevToolsPresetChange(preset);
    setOptions((prev) => ({ ...prev, preset }));
  };

  const handleFormatChange = (format: ColorFormat) => {
    trackDevToolsFormatChange(format);
    setOptions((prev) => ({ ...prev, format }));
  };

  const handleToggleCode = () => {
    const newShowCode = !showCode;
    if (newShowCode) {
      trackDevToolsShowCode(options.preset, options.format);
    } else {
      trackDevToolsHideCode(options.preset, options.format);
    }
    setShowCode(newShowCode);
  };

  return (
    <>
      <div className={styles.container}>
        <>
          <h2>Export Colors</h2>
          <Button type={"button"} variant={"primary"} onClick={handleExport}>
            Export
          </Button>
        </>

        <>
          <h2>For devs</h2>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Style Preset</label>
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

            <Button onClick={handleToggleCode} variant="outline">
              {showCode ? "Hide Code" : "Show Code"}
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
                <Button onClick={handleCopy} variant="ghost" size="sm">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className={styles.codeBlock}>
                <code>{code}</code>
              </pre>
            </div>
          )}
        </>
      </div>

      <ExportModal
        data={data}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
