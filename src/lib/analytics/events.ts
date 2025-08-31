export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  USER_ENGAGEMENT: "user_engagement",

  // Generation events
  GENERATE_PALETTE: "generate_palette",
  GENERATE_SUCCESS: "generate_success",
  GENERATE_ERROR: "generate_error",

  // Export events
  EXPORT_BUTTON_CLICK: "export_button_click",
  EXPORT_MODAL_OPEN: "export_modal_open",
  EXPORT_FORMAT_SELECT: "export_format_select",
  EXPORT_DOWNLOAD: "export_download",
  EXPORT_DOWNLOAD_SUCCESS: "export_download_success",
  EXPORT_DOWNLOAD_ERROR: "export_download_error",

  // Dev tools events
  DEV_TOOLS_PRESET_CHANGE: "dev_tools_preset_change",
  DEV_TOOLS_FORMAT_CHANGE: "dev_tools_format_change",
  DEV_TOOLS_SHOW_CODE: "dev_tools_show_code",
  DEV_TOOLS_HIDE_CODE: "dev_tools_hide_code",
  DEV_TOOLS_COPY_CODE: "dev_tools_copy_code",
  DEV_TOOLS_COPY_SUCCESS: "dev_tools_copy_success",
  DEV_TOOLS_COPY_ERROR: "dev_tools_copy_error",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
