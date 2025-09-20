import type { Metadata } from "next";
import "../globals.css";
import { cx } from "@/lib/utils/cx";
import styles from "./layout.module.scss";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import BackgroundEffects from "@/components/ui/BackgroundEffects/BackgroundEffects";
import { usePaletteData } from "@/context/PaletteDataprovider";

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

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cx("blue", styles.layout)}>
      <Navbar />

      {children}
      <Footer />
    </div>
  );
}
