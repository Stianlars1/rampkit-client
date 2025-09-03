"use client";
import { createContext, useContext, useState } from "react";
import { PaletteData } from "@/types";
import { useThemeUpdater } from "@/hooks/useThemeUpdater";

interface PaletteDataContext {
  paletteData: PaletteData | null;
  setPaletteData: (data: PaletteData | null) => void;
}

export const PaletteDataContext = createContext<PaletteDataContext | undefined>(
  undefined,
);

export const PaletteDataprovider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paletteData, setPaletteData] = useState<PaletteData | null>(null);
  useThemeUpdater(paletteData);

  return (
    <PaletteDataContext.Provider value={{ paletteData, setPaletteData }}>
      {children}
    </PaletteDataContext.Provider>
  );
};

export const usePaletteData = () => {
  const context = useContext(PaletteDataContext);
  if (context === undefined) {
    throw new Error("usePaletteData must be used within a PaletteDataprovider");
  }
  return context;
};
