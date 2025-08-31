"use client";

import { useState } from "react";
import { PaletteData } from "@/types";
import { Button } from "@/components/ui/Button/Button";
import { useAnalytics } from "@/hooks/useAnalytics";
import styles from "./ExportModal.module.scss";
import { generateDownloadFile } from "@/lib/download-utils";

interface ExportModalProps {
  data: PaletteData;
  isOpen: boolean;
  onClose: () => void;
}

export type ExportFormat =
  | "json"
  | "readable-txt"
  | "css-variables"
  | "color-swatches";

const exportFormats: {
  value: ExportFormat;
  label: string;
  description: string;
}[] = [
  {
    value: "json",
    label: "JSON Format",
    description: "Raw data structure for developers",
  },
  {
    value: "readable-txt",
    label: "Readable Text",
    description: "Human-friendly color information",
  },
  {
    value: "css-variables",
    label: "CSS Variables",
    description: "Ready-to-use CSS custom properties",
  },
  {
    value: "color-swatches",
    label: "Color Reference",
    description: "Complete color palette with hex values",
  },
];

export function ExportModal({ data, isOpen, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>("readable-txt");
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    trackExportFormatSelect,
    trackExportDownload,
    trackExportDownloadSuccess,
    trackExportDownloadError,
  } = useAnalytics();

  if (!isOpen) return null;

  const handleFormatSelect = (format: ExportFormat) => {
    trackExportFormatSelect(format);
    setSelectedFormat(format);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    trackExportDownload(selectedFormat);

    try {
      await generateDownloadFile(
        data,
        selectedFormat,
        () => trackExportDownloadSuccess(selectedFormat),
        (error) => trackExportDownloadError(selectedFormat, error),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Download failed";
      console.error("Download failed:", errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Export Color Palette</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Choose how you&apos;d like to export your color palette
          </p>

          <div className={styles.formatList}>
            {exportFormats.map((format) => (
              <label key={format.value} className={styles.formatOption}>
                <input
                  type="radio"
                  name="exportFormat"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) =>
                    handleFormatSelect(e.target.value as ExportFormat)
                  }
                  className={styles.radioInput}
                />
                <div className={styles.formatInfo}>
                  <div className={styles.formatLabel}>{format.label}</div>
                  <div className={styles.formatDescription}>
                    {format.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
