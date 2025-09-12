"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { PaletteDataprovider } from "@/context/PaletteDataprovider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <PaletteDataprovider>{children}</PaletteDataprovider>
    </ThemeProvider>
  );
};
