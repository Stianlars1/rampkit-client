"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { Scheme } from "@/types";
import styles from "./ColorInput.module.scss";
import { isValidHex } from "@/lib/utils/color-utils";
import { useMetrics } from "@/hooks/useMetrics";
import { Palette, Settings2, X } from "lucide-react";
import { cx } from "@/lib/utils/cx";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Tooltip } from "radix-ui";

gsap.registerPlugin(useGSAP);
interface ColorInputProps {
  onGenerate: (hex: string, scheme: Scheme, harmonizeColors: boolean) => void;
  loading?: boolean;
}

const schemes: { value: Scheme; label: string; description: string }[] = [
  {
    value: "analogous",
    label: "Analogous",
    description: "Adjacent colors for harmony",
  },
  {
    value: "complementary",
    label: "Complementary",
    description: "Opposite colors for contrast",
  },
  {
    value: "triadic",
    label: "Triadic",
    description: "Three evenly spaced colors",
  },
  {
    value: "monochromatic",
    label: "Monochromatic",
    description: "Single hue variations",
  },
];

export function ColorInput({ onGenerate, loading }: ColorInputProps) {
  const [hex, setHex] = useState("#3B82F6");
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [error, setError] = useState("");
  const [harmonizeColors, setHarmonizeColors] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { trackGenerate } = useMetrics();
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLSpanElement>(null);

  const handleGenerate = () => {
    if (!isValidHex(hex)) {
      setError("Please enter a valid hex color (e.g., #3B82F6)");
      return;
    }

    setError("");
    trackGenerate(hex, scheme);
    onGenerate(hex, scheme, harmonizeColors);
  };

  const normalizeHex = (value: string) => {
    if (value && !value.startsWith("#")) {
      return `#${value}`;
    }
    return value;
  };

  const removeHexCharacter = (value: string) => {
    if (value && !value.startsWith("#")) {
      return value;
    }
    return value.slice(1);
  };

  const handleHexChange = (value: string) => {
    const normalizedValue = normalizeHex(value);
    setHex(normalizedValue);

    if (error && isValidHex(normalizedValue)) {
      setError("");
    }
  };

  const handleSettingsClick = () => setShowSettings(!showSettings);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {/* Main Input Row */}
        <div className={styles.inputRow}>
          <div
            className={styles.colorInputWrapper}
            style={{ borderColor: isValidHex(hex) ? hex : undefined }}
          >
            <label
              htmlFor="color"
              className={styles.colorPicker}
              style={{ backgroundColor: isValidHex(hex) ? hex : "#888888" }}
            />
            <input
              id="color"
              type="color"
              value={isValidHex(hex) ? hex : "#888888"}
              className={styles.hiddenColorInput}
              onChange={(e) => handleHexChange(e.target.value)}
              title="Click to open color picker"
            />
            <Input
              type="text"
              placeholder="3B82F6"
              value={removeHexCharacter(hex)}
              onChange={(e) => handleHexChange(e.target.value)}
              error={error}
              className={styles.colorInput}
            />
            <span className={styles.hashPrefix}>#</span>
          </div>

          <Button
            className={styles.settingsButton}
            variant={showSettings ? "primary" : "outline"}
            onClick={handleSettingsClick}
            title="Color harmony settings"
          >
            {showSettings ? (
              <X className={styles.settingsIcon} />
            ) : (
              <Settings2
                className={cx(
                  styles.settingsIcon,
                  harmonizeColors && styles.activeSettingsIcon,
                )}
              />
            )}
          </Button>
        </div>

        {/* Settings Panel - Animated */}
        <div
          ref={gsapContainerRef}
          className={`${styles.settingsPanel} ${showSettings ? styles.open : ""}`}
        >
          <div className={styles.settingsPanelContent}>
            {/* Harmonize Toggle */}
            <div className={styles.harmonizeSection}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={harmonizeColors}
                  onChange={(e) => setHarmonizeColors(e.target.checked)}
                />
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild={true}>
                      <span
                        className={cx(
                          styles.slider,
                          showSettings &&
                            !harmonizeColors &&
                            styles.sliderPulse,
                          harmonizeColors && styles.sliderActive,
                        )}
                      >
                        <Palette className={styles.sliderIcon} />
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content className={styles.TooltipContent}>
                      Click to toggle color harmony
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
                <div className={styles.switchLabel}>
                  <span className={styles.switchTitle}>
                    Color Harmony{" "}
                    <small className={styles.sliderStatus}>
                      {harmonizeColors ? "🟢  on" : "🔴  off"}
                    </small>
                  </span>
                  <span className={styles.switchDescription}>
                    {harmonizeColors
                      ? "Transform base color using scheme"
                      : "Keep original color, add harmonious colors"}
                  </span>
                </div>
              </label>
            </div>

            {/* Scheme Selection */}
            <div className={styles.schemeSection}>
              <label className={styles.schemeLabel}>Harmony Scheme</label>
              <div className={styles.schemeGrid}>
                {schemes.map((s) => (
                  <button
                    key={s.value}
                    className={`${styles.schemeOption} ${
                      scheme === s.value ? styles.active : ""
                    }`}
                    onClick={() => setScheme(s.value as Scheme)}
                    disabled={!harmonizeColors}
                  >
                    <span className={styles.schemeTitle}>{s.label}</span>
                    <span className={styles.schemeDescription}>
                      {s.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={loading || !isValidHex(hex)}
        size="lg"
        className={styles.generateButton}
      >
        {loading ? "Generating..." : "Generate Palette"}
      </Button>
    </div>
  );
}
