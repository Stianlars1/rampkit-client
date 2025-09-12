// @/hooks/useHasGeneratedTheme.ts
"use client";
import { useEffect, useState } from "react";
import { usePaletteData } from "@/context/PaletteDataprovider";

export const useHasGeneratedTheme = () => {
  const { paletteData, isLoading } = usePaletteData();
  const [hasGeneratedTheme, setHasGeneratedTheme] = useState(false);

  useEffect(() => {
    // Don't update state while loading from localStorage
    if (isLoading) return;

    const hasTheme = paletteData !== null;
    setHasGeneratedTheme(hasTheme);
  }, [paletteData, isLoading]);

  // Optional: Keep the DOM attribute observer as backup
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-has-generated-theme"
        ) {
          const hasTheme =
            document.body.getAttribute("data-has-generated-theme") === "true";
          setHasGeneratedTheme(hasTheme);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-has-generated-theme"],
    });

    return () => observer.disconnect();
  }, []);

  console.log("hasGeneratedTheme", hasGeneratedTheme);

  return hasGeneratedTheme;
};
