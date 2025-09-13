"use client";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialTheme = (): { theme: ThemeMode; resolved: ResolvedTheme } => {
    if (typeof window === "undefined") {
      return { theme: "system", resolved: "dark" };
    }

    const hasLight = document.documentElement.classList.contains("light");
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;

    const resolved: ResolvedTheme = hasLight ? "light" : "dark";
    const theme: ThemeMode = savedTheme || "system";

    return { theme, resolved };
  };

  const [theme, setTheme] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Resolve the actual theme based on user choice
  const resolveTheme = (themeMode: ThemeMode): ResolvedTheme => {
    if (themeMode === "system") {
      return getSystemTheme();
    }
    return themeMode;
  };

  // Apply theme to document
  const applyTheme = (resolved: ResolvedTheme) => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    // Add new theme class
    root.classList.add(resolved);
    body.classList.add(resolved);

    // Set data attribute for CSS targeting
    root.setAttribute("data-theme", resolved);
  };

  // Initialize with current state on mount
  useEffect(() => {
    const { theme: initialTheme, resolved: initialResolved } =
      getInitialTheme();

    setTheme(initialTheme);
    setResolvedTheme(initialResolved);
    setMounted(true);
  }, []);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        const newResolvedTheme = getSystemTheme();
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme, mounted]);

  // Update theme when user changes it
  const updateTheme = (newTheme: ThemeMode) => {
    const newResolvedTheme = resolveTheme(newTheme);

    setTheme(newTheme);
    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);

    // Persist to localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Simple toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };

  // Prevent hydration mismatch by using actual detected theme
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "system",
          resolvedTheme: "dark",
          setTheme: () => {},
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme: updateTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
