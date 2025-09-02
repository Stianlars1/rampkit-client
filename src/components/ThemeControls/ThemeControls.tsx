"use client";

import { Button } from "@/components/ui/Button/Button";
import styles from "./ThemeControls.module.scss";

interface ThemeControlsProps {
  onReset: () => void;
  hasCustomTheme: boolean;
}

export function ThemeControls({ onReset, hasCustomTheme }: ThemeControlsProps) {
  if (!hasCustomTheme) return null;

  return (
    <div className={styles.container}>
      <Button onClick={onReset} variant="outline" size="sm">
        Reset to Default Theme
      </Button>
    </div>
  );
}
