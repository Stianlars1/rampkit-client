"use client";

import { useCallback, useEffect, useState } from "react";
import { Scheme } from "@/types";
import { DEFAULT_HEX } from "@/lib/constants";

export interface ColorHistoryItem {
  inputHex: string;
  generatedAccent: string;
  scheme: Scheme;
  harmonized: boolean;
  pureColorTheory: boolean;
  harmonyColorIndex: number;
  timestamp: number;
}

interface InitialValues {
  hex: string;
  scheme: Scheme;
  harmonized: boolean;
  pureColorTheory: boolean;
  harmonyColorIndex: number;
  hasInitialParams: boolean;
}

const HISTORY_KEY = "rampkit_color_history";
const MAX_HISTORY = 10;

// Default values - used to determine what to include in URL
const DEFAULTS = {
  scheme: "analogous" as Scheme,
  harmonized: false,
  pureColorTheory: false,
  harmonyColorIndex: 0,
};

/**
 * Read initial values from dataset (set by inline script before React)
 * This prevents hydration flash by having values ready before first render
 */
function getInitialFromDataset(): InitialValues {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      hex: DEFAULT_HEX,
      scheme: DEFAULTS.scheme,
      harmonized: DEFAULTS.harmonized,
      pureColorTheory: DEFAULTS.pureColorTheory,
      harmonyColorIndex: DEFAULTS.harmonyColorIndex,
      hasInitialParams: false,
    };
  }

  const d = document.documentElement.dataset;

  return {
    hex: d.initialHex || DEFAULT_HEX,
    scheme: (d.initialScheme as Scheme) || DEFAULTS.scheme,
    harmonized: d.initialHarmonized === "true",
    pureColorTheory: d.initialPure === "true",
    harmonyColorIndex: parseInt(d.initialColorIndex || "0", 10),
    hasInitialParams: d.hasInitialParams === "true",
  };
}

/**
 * Update URL with current color settings (without page reload)
 * Only includes params that differ from defaults for cleaner URLs
 */
function updateURL(
  hex: string,
  scheme: Scheme,
  harmonized: boolean,
  pureColorTheory: boolean,
  harmonyColorIndex: number,
): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  // Clear existing params
  url.searchParams.delete("hex");
  url.searchParams.delete("scheme");
  url.searchParams.delete("harmonized");
  url.searchParams.delete("pure");
  url.searchParams.delete("color");

  // Always include hex
  url.searchParams.set("hex", hex.replace("#", ""));

  // Only include non-default values for cleaner URLs
  if (harmonized) {
    // Only include scheme if harmony is on (otherwise scheme is irrelevant)
    if (scheme !== DEFAULTS.scheme) {
      url.searchParams.set("scheme", scheme);
    }
    url.searchParams.set("harmonized", "true");

    if (pureColorTheory) {
      url.searchParams.set("pure", "true");
    }

    // Only include color index if not default (and use 1-indexed for humans)
    if (harmonyColorIndex !== DEFAULTS.harmonyColorIndex) {
      url.searchParams.set("color", String(harmonyColorIndex + 1));
    }
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * Load history from localStorage
 */
function loadHistory(): ColorHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save history to localStorage
 */
function saveHistory(history: ColorHistoryItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Hook for managing color history and URL sync
 */
export function useColorHistory() {
  // Initialize from dataset immediately (no flash)
  const [initialValues] = useState<InitialValues>(getInitialFromDataset);
  const [history, setHistory] = useState<ColorHistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history on mount
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
    setIsInitialized(true);
  }, []);

  /**
   * Add a new entry to history and update URL
   */
  const addToHistory = useCallback(
    (item: Omit<ColorHistoryItem, "timestamp">) => {
      const newItem: ColorHistoryItem = {
        ...item,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // Remove duplicates (same generated accent)
        const filtered = prev.filter(
          (h) =>
            h.generatedAccent.toUpperCase() !==
            newItem.generatedAccent.toUpperCase(),
        );

        // Add new item at the start, cap at MAX_HISTORY
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);

        // Persist to localStorage
        saveHistory(updated);

        return updated;
      });

      // Update URL with clean params
      updateURL(
        item.inputHex,
        item.scheme,
        item.harmonized,
        item.pureColorTheory,
        item.harmonyColorIndex,
      );
    },
    [],
  );

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  /**
   * Get initial values (from dataset, set by inline script)
   */
  const getInitialValues = useCallback(() => {
    return initialValues;
  }, [initialValues]);

  return {
    history,
    addToHistory,
    clearHistory,
    getInitialValues,
    isInitialized,
  };
}
