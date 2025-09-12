"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { PaletteData } from "@/types";
import { useThemeUpdater } from "@/hooks/useThemeUpdater";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects/BackgroundEffects";
import { LoadingScreen } from "@/components/ui/LoadingScreen/LoadingScreen";
import { useTheme } from "@/context/ThemeProvider";

interface PaletteDataContext {
  paletteData: PaletteData | null;
  setPaletteData: (data: PaletteData | null) => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Simulate minimum loading time for better UX
    const minLoadTime = 1500; // 1.5 seconds minimum
    const startTime = Date.now();

    const loadData = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          setPaletteDataState(parsedData);
        }
      } catch (error) {
        console.error("Failed to load palette data from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }

      // Ensure minimum loading time
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    loadData();
  }, []);

  // Custom setter that also persists to localStorage
  const setPaletteData = (data: PaletteData | null) => {
    setPaletteDataState(data);

    if (typeof window === "undefined") return;

    try {
      if (data === null) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to save palette data to localStorage:", error);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setLoadingComplete(true);
    }, 50);
  };

  useThemeUpdater(paletteData);
  console.log("theme", theme);
  console.log("resolved theme", resolvedTheme);
  return (
    <PaletteDataContext.Provider
      value={{ paletteData, setPaletteData, isLoading }}
    >
      {/* Loading Screen */}
      {(isLoading || showLoadingScreen) && (
        <LoadingScreen
          theme={resolvedTheme}
          isVisible={isLoading || showLoadingScreen}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* Main Content - only show after loading is complete */}
      {loadingComplete && (
        <>
          {children}
          <BackgroundEffects
            hasStoredPaletteData={!!paletteData}
            loadingComplete={loadingComplete}
          />
        </>
      )}
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
