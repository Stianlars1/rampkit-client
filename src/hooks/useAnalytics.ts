import { useCallback } from "react";
import { trackEvent } from "@/lib/analytics/utils";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { Scheme, StylePreset, ColorFormat } from "@/types";
import { ExportFormat } from "@/components/ExportModal/ExportModal";

export function useAnalytics() {
  // Generation tracking
  const trackGenerate = useCallback((hex: string, scheme: Scheme) => {
    trackEvent(ANALYTICS_EVENTS.GENERATE_PALETTE, {
      hex_color: hex,
      color_scheme: scheme,
    });
  }, []);

  const trackGenerateSuccess = useCallback((hex: string, scheme: Scheme) => {
    trackEvent(ANALYTICS_EVENTS.GENERATE_SUCCESS, {
      hex_color: hex,
      color_scheme: scheme,
    });
  }, []);

  const trackGenerateError = useCallback((error: string) => {
    trackEvent(ANALYTICS_EVENTS.GENERATE_ERROR, {
      error_message: error,
    });
  }, []);

  // Export tracking
  const trackExportClick = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_BUTTON_CLICK);
  }, []);

  const trackExportModalOpen = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_MODAL_OPEN);
  }, []);

  const trackExportFormatSelect = useCallback((format: ExportFormat) => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_FORMAT_SELECT, {
      export_format: format,
    });
  }, []);

  const trackExportDownload = useCallback((format: ExportFormat) => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_DOWNLOAD, {
      export_format: format,
    });
  }, []);

  const trackExportDownloadSuccess = useCallback((format: ExportFormat) => {
    trackEvent(ANALYTICS_EVENTS.EXPORT_DOWNLOAD_SUCCESS, {
      export_format: format,
    });
  }, []);

  const trackExportDownloadError = useCallback(
    (format: ExportFormat, error: string) => {
      trackEvent(ANALYTICS_EVENTS.EXPORT_DOWNLOAD_ERROR, {
        export_format: format,
        error_message: error,
      });
    },
    [],
  );

  // Dev tools tracking
  const trackDevToolsPresetChange = useCallback((preset: StylePreset) => {
    trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_PRESET_CHANGE, {
      preset: preset,
    });
  }, []);

  const trackDevToolsFormatChange = useCallback((format: ColorFormat) => {
    trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_FORMAT_CHANGE, {
      format: format,
    });
  }, []);

  const trackDevToolsShowCode = useCallback(
    (preset: StylePreset, format: ColorFormat) => {
      trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_SHOW_CODE, {
        preset: preset,
        format: format,
      });
    },
    [],
  );

  const trackDevToolsHideCode = useCallback(
    (preset: StylePreset, format: ColorFormat) => {
      trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_HIDE_CODE, {
        preset: preset,
        format: format,
      });
    },
    [],
  );

  const trackDevToolsCopyCode = useCallback(
    (preset: StylePreset, format: ColorFormat) => {
      trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_COPY_CODE, {
        preset: preset,
        format: format,
      });
    },
    [],
  );

  const trackDevToolsCopySuccess = useCallback(
    (preset: StylePreset, format: ColorFormat) => {
      trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_COPY_SUCCESS, {
        preset: preset,
        format: format,
      });
    },
    [],
  );

  const trackDevToolsCopyError = useCallback((error: string) => {
    trackEvent(ANALYTICS_EVENTS.DEV_TOOLS_COPY_ERROR, {
      error_message: error,
    });
  }, []);

  return {
    // Generation
    trackGenerate,
    trackGenerateSuccess,
    trackGenerateError,
    // Export
    trackExportClick,
    trackExportModalOpen,
    trackExportFormatSelect,
    trackExportDownload,
    trackExportDownloadSuccess,
    trackExportDownloadError,
    // Dev tools
    trackDevToolsPresetChange,
    trackDevToolsFormatChange,
    trackDevToolsShowCode,
    trackDevToolsHideCode,
    trackDevToolsCopyCode,
    trackDevToolsCopySuccess,
    trackDevToolsCopyError,
  };
}
