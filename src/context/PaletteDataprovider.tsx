"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { PaletteData } from "@/types";
import { useThemeUpdater } from "@/hooks/useThemeUpdater";
import BackgroundEffects from "@/components/ui/BackgroundEffects/BackgroundEffects";

interface PaletteDataContext {
  paletteData: PaletteData | null;
  setPaletteData: (data: PaletteData | null) => void;
  isLoading: boolean;
  hasStoredData: boolean;
}

const STORAGE_KEY = "rampkit-palette-data";

export const PaletteDataContext = createContext<PaletteDataContext | undefined>(
  undefined,
);

export const PaletteDataprovider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paletteData, setPaletteDataState] = useState<PaletteData | null>(null);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setPaletteDataState(parsedData);
        setHasStoredData(true);
      }
    } catch (error) {
      console.error("Failed to load palette data from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Custom setter that also persists to localStorage
  const setPaletteData = (data: PaletteData | null) => {
    setPaletteDataState(data);

    if (typeof window === "undefined") return;

    try {
      if (data === null) {
        localStorage.removeItem(STORAGE_KEY);
        setHasStoredData(false);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to save palette data to localStorage:", error);
    }
  };

  useThemeUpdater(paletteData);

  return (
    <PaletteDataContext.Provider
      value={{ paletteData, setPaletteData, hasStoredData, isLoading }}
    >
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
