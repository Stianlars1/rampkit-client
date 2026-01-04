"use client";

import { useCallback, useEffect } from "react";
import {
  bumpDevCopy,
  bumpDevFormat,
  bumpDevPreset,
  bumpExportButton,
  bumpExportDownload,
  bumpExportModalOpen,
  bumpGenerate,
  bumpHideCode,
  bumpShowCode,
  bumpVisitorOncePerSession,
} from "@/lib/metrics/store";
import type { ColorFormat, Scheme, StylePreset } from "@/types";
import type { ExportFormat } from "@/components/ui/ExportModal/ExportModal";

export function useMetrics() {
  useEffect(() => {
    void bumpVisitorOncePerSession();
  }, []);

  const trackGenerate = useCallback((_hex: string, _scheme: Scheme) => {
    void bumpGenerate();
  }, []);

  const trackShowCode = useCallback(() => {
    void bumpShowCode();
  }, []);
  const trackHideCode = useCallback(() => {
    void bumpHideCode();
  }, []);

  const trackExportButton = useCallback(() => {
    void bumpExportButton();
  }, []);
  const trackExportModalOpen = useCallback(() => {
    void bumpExportModalOpen();
  }, []);
  const trackExportDownload = useCallback((format: ExportFormat) => {
    void bumpExportDownload(format);
  }, []);

  const trackDevPreset = useCallback((preset: StylePreset) => {
    void bumpDevPreset(preset);
  }, []);
  const trackDevFormat = useCallback((format: ColorFormat) => {
    void bumpDevFormat(format);
  }, []);
  const trackDevCopy = useCallback(() => {
    void bumpDevCopy();
  }, []);

  return {
    trackGenerate,
    trackExportButton,
    trackExportModalOpen,
    trackExportDownload,
    trackDevPreset,
    trackDevFormat,
    trackDevCopy,
    trackShowCode,
    trackHideCode,
  };
}
