"use client";
import { useEffect, useState } from "react";

export const useHasGeneratedTheme = () => {
  const [hasGeneratedTheme, setHasGeneratedTheme] = useState(false);

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

    // Check initial state
    const initialHasTheme =
      document.body.getAttribute("data-has-generated-theme") === "true";
    setHasGeneratedTheme(initialHasTheme);

    return () => observer.disconnect();
  }, []);

  return hasGeneratedTheme;
};
