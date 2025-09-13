"use client";

import { useMemo, useState } from "react";
import styles from "./typography.module.scss";
import { defaultRatios, RatioKey } from "@/lib/typography/scales";
import { buildExports } from "@/lib/typography/buildExports";
import { QuickExport } from "./QuickExport";
import defaultStyles from "../layout.module.scss";
// We import defaultRoleMap for legacy fallback but will override
// role mappings with an identity mapping (display → display, etc.).
import { defaultRoleMap } from "@/lib/typography/tokens";
import { cx } from "@/lib/utils/cx";
import {
  assistant,
  dmSans,
  geistMono,
  geistSans,
  inter,
  jetbrains,
} from "@/lib/fonts";
import { GlassyWrapper } from "@/components/ui/GlassyWrapper/GlassyWrapper";

// A compact type to hold the viewport and base size bounds for the fluid scale.
// A helper type to hold viewport bounds
type Range = { minViewport: number; maxViewport: number };

// Default viewport range.  Users can adjust this in the Advanced panel.
const DEFAULT_RANGE: Range = { minViewport: 360, maxViewport: 1280 };
const fontFamilyPreviewOptions = [
  { name: "Inter", style: inter.style },
  { name: "Geist Sans", style: geistSans.style },
  { name: "Geist Mono", style: geistMono.style },
  { name: "DM Sans", style: dmSans.style },
  { name: "Assistant", style: assistant.style },
  { name: "Jetbrains Mono", style: jetbrains.style },
];

export default function TypographyTool() {
  /*
   * Configuration state
   *
   * We expose only the essential knobs: font family, scale ratio, units,
   * base sizes (min/max), line height and measure.  An Advanced panel
   * lets users tweak the viewport range used by clamp().  Additionally,
   * the preview shows all heading levels (h1–h6) as well as body and
   * small text.  Users can toggle between pixel and rem units.
   */

  // Project name for exports
  const [projectName, setProjectName] = useState("typography");
  // Font family (comma-separated)
  const [fontFamily, setFontFamily] = useState(
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  );
  const [previewFontFamily, setPreviewFontFamily] = useState(
    fontFamilyPreviewOptions[0].style.fontFamily,
  );
  // Ratio key selects a numeric ratio from defaultRatios
  const [ratioKey, setRatioKey] = useState<RatioKey>("perfectFourth");
  // Selected unit for sizes (px or rem)
  const [unit, setUnit] = useState<"px" | "rem">("px");
  // Base font sizes at min and max viewport (in px).  We store these in
  // pixels internally; conversions to rem happen via the fmt() helper.
  const [bodyMin, setBodyMin] = useState(16);
  const [bodyMax, setBodyMax] = useState(18);
  // Root line-height
  const [lhRoot, setLhRoot] = useState(1.5);
  // Measure (max line length in characters)
  const [measureCh, setMeasureCh] = useState(65);
  // Viewport bounds for clamp
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minViewport, setMinViewport] = useState(DEFAULT_RANGE.minViewport);
  const [maxViewport, setMaxViewport] = useState(DEFAULT_RANGE.maxViewport);

  // Helper to convert px values to the currently selected unit.  When
  // units are px, values are formatted with three decimals.  When units
  // are rem, values are divided by 16 (1rem = 16px) and formatted with
  // three decimals.
  const fmt = (px: number): string =>
    unit === "px" ? `${px.toFixed(3)}px` : `${(px / 16).toFixed(3)}rem`;

  /**
   * Compute a clamp() string for a range of sizes across a viewport range.  This
   * returns an object containing the clamp line and slope/intercept for the
   * underlying linear function.  The slope is computed in px/vw and then
   * converted for the chosen unit.
   */
  function clampLine(minPx: number, maxPx: number): { line: string } {
    // Compute slope of the linear function in px per viewport pixel
    const slope = (maxPx - minPx) / (maxViewport - minViewport);
    const intercept = minPx - slope * minViewport;
    // slope in vw (1vw = 1% of viewport width)
    const slopeVW = slope * 100;
    // Format intercept according to selected unit
    const interceptStr =
      unit === "px"
        ? `${intercept.toFixed(3)}px`
        : `${(intercept / 16).toFixed(3)}rem`;
    const minStr = fmt(minPx);
    const maxStr = fmt(maxPx);
    return {
      line: `clamp(${minStr}, ${interceptStr} + ${slopeVW.toFixed(3)}vw, ${maxStr})`,
    };
  }

  // Compute heading sizes relative to bodyMax (for preview and tokens).  We use
  // the ratio to scale up for h1–h3 and scale down for h6 and h5.
  function computeHeadingSizes(basePx: number): {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  } {
    const ratio = defaultRatios[ratioKey];
    // The base size corresponds to h4.  We scale up for h1–h3 and
    // scale down for h5–h6.  These factors loosely follow a modular
    // scale sequence but can be tuned for aesthetic preference.
    const h4 = basePx;
    const h3 = h4 * ratio;
    const h2 = h3 * ratio;
    const h1 = h2 * ratio;
    const h5 = h4 * 0.85;
    const h6 = h4 * 0.7;
    return { h1, h2, h3, h4, h5, h6 };
  }

  // Precompute sizes at min and max viewport for headings and body
  const headsMin = useMemo(
    () => computeHeadingSizes(bodyMin),
    [bodyMin, ratioKey],
  );
  const headsMax = useMemo(
    () => computeHeadingSizes(bodyMax),
    [bodyMax, ratioKey],
  );

  // Build a tokens object manually.  Each role gets a clamp string derived
  // from the heading/body sizes.  The schema matches DTCG.
  const tokens = useMemo(() => {
    return {
      $schema: "https://design-tokens.github.io/schema.json",
      typography: {
        font: {
          family: {
            sans: { value: fontFamily, type: "fontFamily" },
          },
        },
        lineHeight: {
          root: { value: lhRoot, type: "lineHeight" },
        },
        roles: {
          display: {
            size: {
              value: clampLine(headsMin.h1, headsMax.h1).line,
              type: "fontSize",
            },
          },
          headline: {
            size: {
              value: clampLine(headsMin.h2, headsMax.h2).line,
              type: "fontSize",
            },
          },
          title: {
            size: {
              value: clampLine(headsMin.h3, headsMax.h3).line,
              type: "fontSize",
            },
          },
          body: {
            size: { value: clampLine(bodyMin, bodyMax).line, type: "fontSize" },
          },
          label: {
            size: {
              value: clampLine(headsMin.h6, headsMax.h6).line,
              type: "fontSize",
            },
          },
        },
      },
    };
  }, [
    fontFamily,
    lhRoot,
    unit,
    ratioKey,
    headsMin,
    headsMax,
    bodyMin,
    bodyMax,
    minViewport,
    maxViewport,
  ]);

  // Precompute files for ZIP export (uses design tokens + default role map)
  // Provide an identity role map (display → display, etc.) so that
  // exported CSS maps h1 → display, h2 → headline, etc.  We avoid
  // referencing scale step names like "3xl" here.
  const identityRoleMap = useMemo(
    () => ({
      display: "display",
      headline: "headline",
      title: "title",
      body: "body",
      label: "label",
    }),
    [],
  );

  const filesForZip = useMemo(
    () => buildExports({ tokens, projectName, roleMap: identityRoleMap }),
    [tokens, projectName, identityRoleMap],
  );

  // Meta information for the body clamp.  This is used to show the
  // full clamp() expression for the body size.
  const bodyClamp = clampLine(bodyMin, bodyMax);

  return (
    <div
      className={cx(styles.wrap, defaultStyles.hero)}
      style={{ fontFamily: previewFontFamily }}
    >
      {/* Grid layout for controls and preview */}
      <section className={styles.grid}>
        <div className={styles.controls}>
          <GlassyWrapper className={cx(styles.card)} title={"Project"}>
            <label className={styles.label}>
              Name
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>
          </GlassyWrapper>
          <GlassyWrapper title={"Typography"} className={cx(styles.card)}>
            <label className={styles.label}>
              Font family
              <select
                value={previewFontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  setPreviewFontFamily(e.target.value);
                }}
              >
                {fontFamilyPreviewOptions.map((opt) => (
                  <option key={opt.name} value={opt.style.fontFamily}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Scale ratio
              <select
                value={ratioKey}
                onChange={(e) => setRatioKey(e.target.value as RatioKey)}
              >
                {Object.entries(defaultRatios).map(([k, v]) => (
                  <option key={k} value={k}>{`${k} (${v})`}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Units
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as "px" | "rem")}
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
              </select>
            </label>
            <div className={styles.row2}>
              <div>
                <label className={styles.label}>
                  Base size (min viewport, {unit})
                  <input
                    type="number"
                    min={12}
                    value={unit === "px" ? bodyMin : +(bodyMin / 16).toFixed(3)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setBodyMin(unit === "px" ? n : n * 16);
                    }}
                  />
                </label>
              </div>
              <div>
                <label className={styles.label}>
                  Base size (max viewport, {unit})
                  <input
                    type="number"
                    min={12}
                    value={unit === "px" ? bodyMax : +(bodyMax / 16).toFixed(3)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      setBodyMax(unit === "px" ? n : n * 16);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className={styles.row2}>
              <div>
                <label className={styles.label}>
                  Root line-height
                  <input
                    type="number"
                    step="0.05"
                    value={lhRoot}
                    onChange={(e) => setLhRoot(+e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className={styles.label}>
                  Measure (max line length, ch)
                  <input
                    type="number"
                    value={measureCh}
                    onChange={(e) => setMeasureCh(+e.target.value)}
                  />
                </label>
              </div>
            </div>
          </GlassyWrapper>

          <GlassyWrapper title={"Advanced"}>
            <summary>Advanced (viewport range)</summary>
            <div className={styles.row2}>
              <div>
                <label className={styles.label}>
                  Min viewport (px)
                  <input
                    type="number"
                    value={minViewport}
                    onChange={(e) => setMinViewport(+e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className={styles.label}>
                  Max viewport (px)
                  <input
                    type="number"
                    value={maxViewport}
                    onChange={(e) => setMaxViewport(+e.target.value)}
                  />
                </label>
              </div>
            </div>
          </GlassyWrapper>
        </div>
        <GlassyWrapper title={"Preview"} className={cx(styles.preview)}>
          {/* Clamp explainer */}
          <div className={styles.metaRow}>
            <div className={styles.metaCell}>
              <strong>Min viewport:</strong> {minViewport}px
            </div>
            <div className={styles.metaCell}>
              <strong>Max viewport:</strong> {maxViewport}px
            </div>
            <div className={styles.metaCell}>
              <strong>Min body:</strong> {fmt(bodyMin)}
            </div>
            <div className={styles.metaCell}>
              <strong>Max body:</strong> {fmt(bodyMax)}
            </div>
          </div>
          <div className={styles.clampLine}>font-size: {bodyClamp.line};</div>

          {/* Headings preview */}
          <h1
            style={{
              fontSize: fmt(headsMax.h1) as any,
              lineHeight: 1.2 as any,
            }}
          >
            The quick brown fox
          </h1>
          <h2
            style={{
              fontSize: fmt(headsMax.h2) as any,
              lineHeight: 1.25 as any,
            }}
          >
            The quick brown fox
          </h2>
          <h3
            style={{
              fontSize: fmt(headsMax.h3) as any,
              lineHeight: 1.25 as any,
            }}
          >
            The quick brown fox
          </h3>
          <h4
            style={{
              fontSize: fmt(headsMax.h4) as any,
              lineHeight: 1.3 as any,
            }}
          >
            The quick brown fox
          </h4>
          <h5
            style={{
              fontSize: fmt(headsMax.h5) as any,
              lineHeight: 1.35 as any,
            }}
          >
            The quick brown fox
          </h5>
          <h6
            style={{
              fontSize: fmt(headsMax.h6) as any,
              lineHeight: 1.4 as any,
            }}
          >
            The quick brown fox
          </h6>
          <p
            style={{
              fontSize: bodyClamp.line as any,
              lineHeight: lhRoot as any,
            }}
          >
            The quick brown fox jumps over the lazy dog.{" "}
            <a href="#" style={{ fontSize: "inherit" }}>
              link example
            </a>
            .
          </p>
          <small
            style={{
              fontSize: fmt(Math.max(12, bodyMax * 0.8)) as any,
              lineHeight: 1.35 as any,
            }}
          >
            Small print example.
          </small>
        </GlassyWrapper>
      </section>

      {/* QuickExport: code and ZIP */}
      <QuickExport
        projectName={projectName}
        tokens={tokens}
        filesForZip={filesForZip}
        roleMap={identityRoleMap}
      />
    </div>
  );
}
