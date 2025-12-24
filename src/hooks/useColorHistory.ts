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

interface URLParams {
  hex?: string;
  scheme?: Scheme;
  harmony?: boolean;
  pure?: boolean;
  idx?: number;
}

const HISTORY_KEY = "rampkit_color_history";
const MAX_HISTORY = 10;

/**
 * Parse URL search params into color settings
 */
function parseURLParams(): URLParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const hex = params.get("hex");
  const scheme = params.get("scheme") as Scheme | null;
  const harmony = params.get("harmony");
  const pure = params.get("pure");
  const idx = params.get("idx");

  return {
    hex: hex ? `#${hex.replace("#", "").toUpperCase()}` : undefined,
    scheme: scheme || undefined,
    harmony: harmony === "1",
    pure: pure === "1",
    idx: idx ? parseInt(idx, 10) : undefined,
  };
}

/**
 * Update URL with current color settings (without page reload)
 */
function updateURL(params: URLParams): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  if (params.hex) {
    url.searchParams.set("hex", params.hex.replace("#", ""));
  }
  if (params.scheme) {
    url.searchParams.set("scheme", params.scheme);
  }
  if (params.harmony !== undefined) {
    url.searchParams.set("harmony", params.harmony ? "1" : "0");
  }
  if (params.pure !== undefined) {
    url.searchParams.set("pure", params.pure ? "1" : "0");
  }
  if (params.idx !== undefined) {
    url.searchParams.set("idx", params.idx.toString());
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
  const [history, setHistory] = useState<ColorHistoryItem[]>([]);
  const [initialParams, setInitialParams] = useState<URLParams>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history and URL params on mount
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);

    const params = parseURLParams();
    setInitialParams(params);
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

      // Update URL
      updateURL({
        hex: item.inputHex,
        scheme: item.scheme,
        harmony: item.harmonized,
        pure: item.pureColorTheory,
        idx: item.harmonyColorIndex,
      });
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
   * Get initial values from URL (for first render)
   */
  const getInitialValues = useCallback(() => {
    return {
      hex: initialParams.hex || DEFAULT_HEX,
      scheme: initialParams.scheme || ("analogous" as Scheme),
      harmonized: initialParams.harmony || false,
      pureColorTheory: initialParams.pure || false,
      harmonyColorIndex: initialParams.idx || 0,
      hasURLParams: !!(
        initialParams.hex ||
        initialParams.scheme ||
        initialParams.harmony ||
        initialParams.pure
      ),
    };
  }, [initialParams]);

  return {
    history,
    addToHistory,
    clearHistory,
    getInitialValues,
    isInitialized,
  };
}
