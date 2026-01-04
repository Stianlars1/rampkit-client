"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { Scheme } from "@/types";
import styles from "./ColorInput.module.scss";
import { isValidHex } from "@/lib/utils/color-utils";
import { useMetrics } from "@/hooks/useMetrics";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  History,
  Palette,
  Settings2,
  Star,
  X,
} from "lucide-react";
import { cx } from "@/lib/utils/cx";
import { Tooltip, Popover } from "radix-ui";
import { getAllHarmonyColors } from "@/lib/utils/color/ColorTheory";
import { DEFAULT_HEX } from "@/lib/constants";
import { ColorHistoryItem } from "@/hooks/useColorHistory";

interface ColorInputProps {
  onGenerate: (
    hex: string,
    scheme: Scheme,
    harmonizeColors: boolean,
    pureColorTheory: boolean,
    harmonyColorIndex?: number,
  ) => void;
  loading?: boolean;
  firstRenderHex?: string;
  /** The generated accent color after harmony transformation (if different from input) */
  generatedAccent?: string;
  /** Whether harmony was applied to generate the accent */
  wasHarmonized?: boolean;
  /** The scheme used for generation */
  activeScheme?: Scheme;
  /** Current harmony color index (for multi-color schemes) */
  currentHarmonyIndex?: number;
  /** Color generation history */
  history?: ColorHistoryItem[];
  /** Initial values from URL/localStorage (for no-flash hydration) */
  initialScheme?: Scheme;
  initialHarmonized?: boolean;
  initialPureColorTheory?: boolean;
  initialHarmonyIndex?: number;
  /** Whether there were initial params from URL/localStorage (first-time users = false) */
  hasInitialParams?: boolean;
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

export const default_accent_color = DEFAULT_HEX;
export function ColorInput({
  onGenerate,
  loading,
  firstRenderHex,
  generatedAccent,
  wasHarmonized,
  activeScheme,
  currentHarmonyIndex = 0,
  history = [],
  initialScheme = "analogous",
  initialHarmonized = false,
  initialPureColorTheory = false,
  initialHarmonyIndex = 0,
  hasInitialParams = false,
}: ColorInputProps) {
  // Track if component has mounted (for hydration-safe rendering)
  const [isMounted, setIsMounted] = useState(false);
  // Initialize state from props (set by inline script before React hydrates)
  const [hex, setHex] = useState(firstRenderHex || default_accent_color);
  const [scheme, setScheme] = useState<Scheme>(initialScheme);
  const [error, setError] = useState("");
  const [harmonizeColors, setHarmonizeColors] = useState(initialHarmonized);
  const [pureColorTheory, setPureColorTheory] = useState(initialPureColorTheory);
  const [showSettings, setShowSettings] = useState(false);
  const [harmonyIndex, setHarmonyIndex] = useState(initialHarmonyIndex);
  // Only mark as generated if user had URL params or localStorage (not first-time users)
  const [hasGenerated, setHasGenerated] = useState(hasInitialParams);
  const [showHistory, setShowHistory] = useState(false);
  const { trackGenerate } = useMetrics();
  const gsapContainerRef = useRef<HTMLDivElement>(null);

  // Mark as mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle clicking a history item
  const handleHistorySelect = (item: ColorHistoryItem) => {
    setHex(item.inputHex);
    setScheme(item.scheme);
    setHarmonizeColors(item.harmonized);
    setPureColorTheory(item.pureColorTheory);
    setHarmonyIndex(item.harmonyColorIndex);
    setShowHistory(false);
    // Trigger generation with these settings
    onGenerate(
      item.inputHex,
      item.scheme,
      item.harmonized,
      item.pureColorTheory,
      item.harmonyColorIndex,
    );
  };

  // Auto-regenerate when settings change (after initial generation)
  useEffect(() => {
    if (hasGenerated && isValidHex(hex)) {
      onGenerate(hex, scheme, harmonizeColors, pureColorTheory, harmonyIndex);
    }
  }, [harmonizeColors, scheme, pureColorTheory, harmonyIndex]);

  // Compute all available harmony colors for the current scheme
  const harmonyColors = useMemo(() => {
    if (!isValidHex(hex) || !harmonizeColors) return null;
    return getAllHarmonyColors(hex, scheme, pureColorTheory);
  }, [hex, scheme, harmonizeColors, pureColorTheory]);

  // Reset harmony index when scheme changes or when harmony colors change
  useEffect(() => {
    if (harmonyColors) {
      setHarmonyIndex(harmonyColors.recommendedIndex);
    }
  }, [scheme, harmonyColors?.recommendedIndex]);

  useEffect(() => {
    setHex(firstRenderHex ?? default_accent_color);
  }, [firstRenderHex]);

  const handleGenerate = () => {
    if (!isValidHex(hex)) {
      setError(`Please enter a valid hex color (e.g., ${DEFAULT_HEX})`);
      return;
    }

    setError("");
    setHasGenerated(true);
    trackGenerate(hex, scheme);
    onGenerate(hex, scheme, harmonizeColors, pureColorTheory, harmonyIndex);
  };

  // Step through harmony colors
  const handlePrevHarmony = () => {
    if (!harmonyColors) return;
    const newIndex =
      (harmonyIndex - 1 + harmonyColors.colors.length) %
      harmonyColors.colors.length;
    setHarmonyIndex(newIndex);
  };

  const handleNextHarmony = () => {
    if (!harmonyColors) return;
    const newIndex = (harmonyIndex + 1) % harmonyColors.colors.length;
    setHarmonyIndex(newIndex);
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
    <div className={styles.container} suppressHydrationWarning>
      <div className={styles.form}>
        {/* Main Input Row */}
        <div className={styles.inputRow}>
          <div
            className={styles.colorInputWrapper}
            style={{ borderColor: isValidHex(hex) ? hex : undefined }}
            suppressHydrationWarning
          >
            <label
              key={removeHexCharacter(hex)}
              htmlFor="color"
              className={styles.colorPicker}
              style={{
                backgroundColor: inputBg,
              }}
              suppressHydrationWarning
            />
            <input
              id="color"
              type="color"
              placeholder={removeHexCharacter(hex)}
              value={isValidHex(hex) ? hex : default_accent_color}
              className={styles.hiddenColorInput}
              onChange={(e) => handleHexChange(e.target.value)}
              title="Click to open color picker"
              suppressHydrationWarning
            />
            <Input
              type="text"
              key={hex}
              placeholder={removeHexCharacter(hex)}
              value={removeHexCharacter(hex ?? default_accent_color)}
              onChange={(e) => handleHexChange(e.target.value)}
              error={error}
              className={styles.colorInput}
              suppressHydrationWarning
            />
            <span className={styles.hashPrefix}>#</span>
          </div>

          <Button
            className={styles.settingsButton}
            variant={showSettings ? "primary" : "outline"}
            onClick={handleSettingsClick}
            title="Color harmony settings"
            aria-expanded={showSettings}
            aria-label="Toggle color harmony settings"
          >
            {showSettings ? (
              <X className={styles.settingsIcon} />
            ) : (
              <Settings2
                className={cx(
                  styles.settingsIcon,
                  isMounted && harmonizeColors && styles.activeSettingsIcon,
                )}
              />
            )}
          </Button>

          {/* History Popover - only show if there's history */}
          {history.length > 0 && (
            <Popover.Root open={showHistory} onOpenChange={setShowHistory}>
              <Popover.Trigger asChild>
                <Button
                  className={styles.historyButton}
                  variant="outline"
                  title="Color history"
                  aria-label="View color history"
                >
                  <History className={styles.historyIcon} />
                  <span className={styles.historyBadge}>{history.length}</span>
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className={styles.historyPopover}
                  sideOffset={8}
                  align="end"
                >
                  <div className={styles.historyHeader}>
                    <span>Recent Colors</span>
                  </div>
                  <div className={styles.historyList}>
                    {history.map((item, idx) => {
                      const wasTransformed =
                        item.harmonized &&
                        item.inputHex.toUpperCase() !==
                          item.generatedAccent.toUpperCase();
                      const schemeName = schemes.find(
                        (s) => s.value === item.scheme,
                      )?.label;

                      return (
                        <button
                          key={item.timestamp}
                          className={cx(
                            styles.historyItem,
                            idx === 0 && styles.historyItemCurrent,
                          )}
                          onClick={() => handleHistorySelect(item)}
                          title={
                            wasTransformed
                              ? `Input: ${item.inputHex} → Output: ${item.generatedAccent}`
                              : item.generatedAccent
                          }
                        >
                          {/* Show input→output when transformed, single swatch otherwise */}
                          {wasTransformed ? (
                            <div className={styles.historySwatchPair}>
                              <div
                                className={styles.historySwatchSmall}
                                style={{ backgroundColor: item.inputHex }}
                              />
                              <span className={styles.historyArrow}>→</span>
                              <div
                                className={styles.historySwatchSmall}
                                style={{
                                  backgroundColor: item.generatedAccent,
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className={styles.historyItemSwatch}
                              style={{ backgroundColor: item.generatedAccent }}
                            />
                          )}
                          <div className={styles.historyItemInfo}>
                            <span className={styles.historyItemHex}>
                              {item.generatedAccent.toUpperCase()}
                            </span>
                            <span className={styles.historyItemMeta}>
                              {wasTransformed
                                ? `${schemeName} from ${item.inputHex}`
                                : "Direct input"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <Popover.Arrow className={styles.historyPopoverArrow} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>

        {/* Color Transformation Indicator - shows when harmony transforms the color */}
        {wasHarmonized &&
          generatedAccent &&
          firstRenderHex &&
          generatedAccent.toUpperCase() !== firstRenderHex.toUpperCase() && (
            <div
              className={styles.colorTransformation}
              role="status"
              aria-live="polite"
              aria-label={`Color transformed from ${firstRenderHex} to ${generatedAccent} using ${activeScheme} harmony`}
            >
              <div className={styles.transformationContent}>
                <span className={styles.transformLabel}>
                  {activeScheme
                    ? schemes.find((s) => s.value === activeScheme)?.label
                    : "Harmony"}
                </span>
                <div className={styles.colorPair}>
                  <div className={styles.colorWithHex}>
                    <div
                      className={styles.colorSwatch}
                      style={{ backgroundColor: firstRenderHex }}
                      aria-label={`Base color: ${firstRenderHex}`}
                    />
                    <span className={styles.hexLabel}>
                      {firstRenderHex.toUpperCase()}
                    </span>
                  </div>
                  <ArrowRight
                    className={styles.transformArrow}
                    aria-hidden="true"
                  />
                  <div className={styles.colorWithHex}>
                    <div
                      className={styles.colorSwatch}
                      style={{ backgroundColor: generatedAccent }}
                      aria-label={`Generated color: ${generatedAccent}`}
                    />
                    <span className={styles.hexLabel}>
                      {generatedAccent.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Settings Panel - Animated (only render content after mount to avoid hydration mismatch) */}
        <div
          ref={gsapContainerRef}
          className={`${styles.settingsPanel} ${showSettings ? styles.open : ""}`}
        >
          {isMounted && (
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
                        suppressHydrationWarning
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
                    <small
                      className={styles.sliderStatus}
                      suppressHydrationWarning
                    >
                      {harmonizeColors ? "🟢  on" : "🔴  off"}
                    </small>
                  </span>
                  <span
                    className={styles.switchDescription}
                    suppressHydrationWarning
                  >
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

            {/* Harmony Color Selector - shows when there are multiple options */}
            {harmonyColors && harmonyColors.colors.length > 1 && (
              <div className={styles.harmonySelector}>
                <div className={styles.harmonySelectorHeader}>
                  <span className={styles.harmonySelectorLabel}>
                    Select Harmony Color
                  </span>
                  <span className={styles.harmonySelectorCount}>
                    {harmonyIndex + 1} / {harmonyColors.colors.length}
                  </span>
                </div>
                <div className={styles.harmonySelectorContent}>
                  <button
                    className={styles.harmonyNavButton}
                    onClick={handlePrevHarmony}
                    aria-label="Previous harmony color"
                    type="button"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className={styles.harmonyColorPreview}>
                    {harmonyColors.colors.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={cx(
                          styles.harmonyColorChip,
                          idx === harmonyIndex && styles.activeChip,
                          idx === harmonyColors.recommendedIndex &&
                            styles.recommendedChip,
                        )}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setHarmonyIndex(idx)}
                        aria-label={`${color.label}: ${color.hex}`}
                        aria-pressed={idx === harmonyIndex}
                      >
                        {idx === harmonyColors.recommendedIndex && (
                          <Star
                            size={10}
                            className={styles.recommendedIcon}
                            aria-label="Recommended"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    className={styles.harmonyNavButton}
                    onClick={handleNextHarmony}
                    aria-label="Next harmony color"
                    type="button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className={styles.harmonySelectorInfo}>
                  <span className={styles.harmonySelectedHex}>
                    {harmonyColors.colors[harmonyIndex]?.hex.toUpperCase()}
                  </span>
                  <span className={styles.harmonySelectorHint}>
                    {harmonyColors.colors[harmonyIndex]?.label}
                    {harmonyIndex === harmonyColors.recommendedIndex && " ★"}
                  </span>
                </div>
              </div>
            )}
          </div>
          )}
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
