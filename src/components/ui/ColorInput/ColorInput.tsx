"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { Scheme } from "@/types";
import styles from "./ColorInput.module.scss";
import { isValidHex } from "@/lib/utils/color-utils";
import { useMetrics } from "@/hooks/useMetrics";
import { FlaskConical, Palette, Settings2, X } from "lucide-react";
import { cx } from "@/lib/utils/cx";
import { Tooltip } from "radix-ui";

interface ColorInputProps {
  onGenerate: (
    hex: string,
    scheme: Scheme,
    harmonizeColors: boolean,
    pureColorTheory: boolean,
  ) => void;
  loading?: boolean;
  firstRenderHex?: string;
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

export const default_accent_color = "#3B82F6";
export function ColorInput({
  onGenerate,
  loading,
  firstRenderHex,
}: ColorInputProps) {
  const [hex, setHex] = useState(firstRenderHex ?? default_accent_color);
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [error, setError] = useState("");
  const [harmonizeColors, setHarmonizeColors] = useState(false);
  const [pureColorTheory, setPureColorTheory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { trackGenerate } = useMetrics();
  const gsapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHex(firstRenderHex ?? default_accent_color);
  }, [firstRenderHex]);

  const handleGenerate = () => {
    if (!isValidHex(hex)) {
      setError("Please enter a valid hex color (e.g., #3B82F6)");
      return;
    }

    setError("");
    trackGenerate(hex, scheme);
    onGenerate(hex, scheme, harmonizeColors, pureColorTheory);
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

  const inputBg = isValidHex(hex) ? hex : default_accent_color;
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
              key={removeHexCharacter(hex)}
              htmlFor="color"
              className={styles.colorPicker}
              style={{
                backgroundColor: inputBg,
              }}
            />
            <input
              id="color"
              type="color"
              placeholder={removeHexCharacter(hex)}
              value={isValidHex(hex) ? hex : default_accent_color}
              className={styles.hiddenColorInput}
              onChange={(e) => handleHexChange(e.target.value)}
              title="Click to open color picker"
            />
            <Input
              type="text"
              key={hex}
              placeholder={removeHexCharacter(hex)}
              value={removeHexCharacter(hex ?? default_accent_color)}
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
                    aria-pressed={scheme === s.value}
                    aria-label={`${s.label}: ${s.description}`}
                  >
                    <span className={styles.schemeTitle}>{s.label}</span>
                    <span className={styles.schemeDescription}>
                      {s.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pure Color Theory Toggle - only visible when harmony is enabled */}
            {harmonizeColors && (
              <div className={styles.pureColorSection}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={pureColorTheory}
                    onChange={(e) => setPureColorTheory(e.target.checked)}
                    aria-describedby="pure-color-description"
                  />
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild={true}>
                        <span
                          className={cx(
                            styles.slider,
                            styles.sliderSmall,
                            pureColorTheory && styles.sliderActive,
                          )}
                        >
                          <FlaskConical className={styles.sliderIcon} />
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Content className={styles.TooltipContent}>
                        Toggle pure color theory mode
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                  <div className={styles.switchLabel}>
                    <span className={styles.switchTitle}>
                      Pure Color Theory{" "}
                      <small className={styles.sliderStatus}>
                        {pureColorTheory ? "🔬 on" : "✨ off"}
                      </small>
                    </span>
                    <span
                      id="pure-color-description"
                      className={styles.switchDescription}
                    >
                      {pureColorTheory
                        ? "Exact mathematical color rotation (may have lower contrast)"
                        : "Optimized for accessibility and WCAG contrast"}
                    </span>
                  </div>
                </label>
              </div>
            )}
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
