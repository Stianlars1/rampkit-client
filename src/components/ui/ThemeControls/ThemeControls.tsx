"use client";

import { Button } from "@/components/ui/Button/Button";
import styles from "./ThemeControls.module.scss";
import { RotateCcw } from "lucide-react";

interface ThemeControlsProps {
  onReset: () => void;
  hasCustomTheme: boolean;
}

export function ThemeControls({ onReset, hasCustomTheme }: ThemeControlsProps) {
  if (!hasCustomTheme) return null;

  return (
    <div className={styles.container}>
      <Button
        id="RESET_PALETTE_BUTTON"
        onClick={onReset}
        variant="blackwhite"
        size="icon"
        aria-label="Reset to default theme"
        title="Reset to Default Theme"
      >
        <RotateCcw width={16} height={16} />
      </Button>
    </div>
  );
}
