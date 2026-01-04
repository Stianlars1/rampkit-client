export const site = {
  name: "Rampkit",
  tagline: "Beautiful 12-step color ramps from any hex",
  description:
    "Paste a hex, get accessible 12-step color palettes. Optional harmony modes: analog, complementary, triadic, monochrome.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rampkit-client.vercel.app",
  locale: "en",
  creator: { name: "Stian Larsen", url: "https://rampkit.app" },
  socials: {
    github: "https://github.com/Stianlars1/rampkit-client",
    radix: "https://www.radix-ui.com/colors",
    stian: "https://stianlarsen.com",
  },
  keywords: [
    "color",
    "palette",
    "radix",
    "harmony",
    "contrast",
    "accessibility",
    "WCAG",
    "design tokens",
  ],
  // If you have a dark and light background variables, list them here:
  themeColor: {
    light: "#ffffff",
    dark: "#10100f",
  },
};
