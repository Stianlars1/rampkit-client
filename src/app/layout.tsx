import type { Metadata } from "next";
import "./globals.css";
import {
  assistant,
  dmSans,
  geistMono,
  geistSans,
  inter,
  jetbrains,
} from "@/lib/fonts/index";
import { cx } from "@/lib/utils/cx";
import { site } from "@/lib/seo/site";
import Script from "next/script";
import styles from "./layout.module.scss";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { PaletteDataprovider } from "@/context/PaletteDataprovider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { themeScript } from "@/lib/theme-script";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects/BackgroundEffects";
import { GoogleAnalyticsProvider } from "@/lib/analytics/GoogleAnalyticsProvider";

export const metadata: Metadata = {
  title: "Rampkit - Beautiful Color Ramps",
  description: "Generate beautiful 12-step color ramps from any hex color",
  keywords: "color, palette, ramp, design, ui, ux, radix, shadcn",
  authors: [{ name: "Rampkit" }],
  openGraph: {
    title: "Rampkit - Beautiful Color Ramps",
    description: "Generate beautiful 12-step color ramps from any hex color",
    url: "https://rampkit.app",
    siteName: "Rampkit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: site.locale,
        potentialAction: [
          {
            "@type": "SearchAction",
            target: `${site.url}/?hex={hex}`,
            "query-input": "required name=hex",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}#app`,
        name: site.name,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        description: site.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: site.url,
      },
      {
        "@type": "Organization",
        "@id": `${site.url}#org`,
        name: "Rampkit",
        url: site.url,
        sameAs: [site.socials.github, site.socials.radix],
        // logo: { "@type": "ImageObject", url: `${site.url}/og.png` },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="jsonld-site"
          type="application/ld+json"
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={cx(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          dmSans.variable,
          assistant.variable,
          jetbrains.variable,
          "blue",
          styles.layout,
        )}
      >
        <ThemeProvider>
          <PaletteDataprovider>
            <Navbar />
            {children}
          </PaletteDataprovider>
          <Footer />

          <BackgroundEffects />
        </ThemeProvider>
        <GoogleAnalyticsProvider />
      </body>
    </html>
  );
}
