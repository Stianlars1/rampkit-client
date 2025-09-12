export const RAMPKIT_URL =
  process.env.NODE_ENV === "production"
    ? "https://rampkit.app"
    : "http://localhost:3000";

export const ROUTE_TYPOGRAPH =
  process.env.NODE_ENV === "production"
    ? "https://rampkit.app/typography"
    : "http://localhost:3000/typography";
export const RAMPKIT_API_URL = process.env.NEXT_PUBLIC_RAMPKIT_API_URL;
export const GITHUB_SOURCE_URL =
  "https://github.com/Stianlars1/rampkit-client.git";

export const RADIX_UI_URL = "https://www.radix-ui.com/colors/custom";
export const COLORPALETTE_URL = "https://colorpalette.dev";
export const STIAN_URL = "https://stianlarsen.com";
export const EXPORT_FORMAT_GITHUB_ISSUES_URL =
  "https://github.com/Stianlars1/rampkit-client/issues/new?labels=feature-request,export-format&template=export-format-request.md&title=%5BExport%20Format%5D%3A%20";
