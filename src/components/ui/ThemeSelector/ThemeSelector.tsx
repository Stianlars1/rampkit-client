// /src/components/ui/ThemeSelector/ThemeSelector.tsx
"use client";
import { useTheme } from "@/context/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";
import styles from "./ThemeSelector.module.scss";
import { useState, useRef, useEffect } from "react";
import { Button } from "../Button/Button";
import { cx } from "@/lib/utils/cx";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ReactNode;
};

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light", icon: <Sun size={16} /> },
  { value: "dark", label: "Dark", icon: <Moon size={16} /> },
  { value: "system", label: "System", icon: <Monitor size={16} /> },
];

export const ThemeSelector = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = themeOptions.find((option) => option.value === theme);
  const currentIcon = currentOption?.icon || <Sun size={16} />;

  return (
    <div className={styles.themeSelector} ref={dropdownRef}>
      <Button
        id={"THEME_TOGGLE_BUTTON"}
        size="icon"
        variant="blackwhite"
        className={cx(styles.triggerButton, isOpen && styles.open)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme selector"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {currentIcon}
      </Button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              className={cx(
                styles.option,
                theme === option.value && styles.selected,
              )}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={theme === option.value}
            >
              <span className={styles.optionIcon}>{option.icon}</span>
              <span className={styles.optionLabel}>{option.label}</span>
              {theme === option.value && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
