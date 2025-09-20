"use client";
import defaultStyles from "./page.module.scss";
import { useMemo, useState } from "react";
import styles from "./typography.module.scss";
import { defaultRatios, RatioKey } from "@/lib/typography/scales";
import { buildExports } from "@/lib/typography/buildExports";
import { QuickExport } from "./QuickExport";
import { cx } from "@/lib/utils/cx";
import {
  assistant,
  dmSans,
  geistMono,
  geistSans,
  inter,
  jetbrains,
} from "@/lib/fonts";
import {
  OutputType,
  ContentType,
  ResponsiveRatioPreset,
  responsiveRatioPresets,
} from "@/lib/typography/outputTypes";
import {
  calculateFluidSize,
  calculateStaticSize,
  calculateResponsiveSize,
} from "@/lib/typography/calculateSizes";
import { formatSize } from "@/lib/typography/formatSize";

type Range = { minViewport: number; maxViewport: number };

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
  // Core project state
  const [projectName, setProjectName] = useState("typography");

  // Output type configuration
  const [outputType, setOutputType] = useState<OutputType>("responsive");

  // Font configuration
  const [fontFamily, setFontFamily] = useState(
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  );
  const [previewFontFamily, setPreviewFontFamily] = useState(
    fontFamilyPreviewOptions[0].style.fontFamily,
  );

  // Scale configuration
  const [ratioKey, setRatioKey] = useState<RatioKey>("perfectFifth");
  const [unit, setUnit] = useState<"px" | "rem">("px");

  // Static sizing
  const [staticBaseSize, setStaticBaseSize] = useState(16);

  // Fluid sizing
  const [bodyMin, setBodyMin] = useState(16);
  const [bodyMax, setBodyMax] = useState(18);
  const [minViewport, setMinViewport] = useState(DEFAULT_RANGE.minViewport);
  const [maxViewport, setMaxViewport] = useState(DEFAULT_RANGE.maxViewport);

  // Mobile-responsive configuration
  const [contentType, setContentType] = useState<ContentType>("balanced");
  const [responsiveRatioPreset, setResponsiveRatioPreset] =
    useState<ResponsiveRatioPreset>("balanced");
  const [customMobileRatio, setCustomMobileRatio] = useState(1.2);
  const [customDesktopRatio, setCustomDesktopRatio] = useState(1.333);
  const [useCustomRatios, setUseCustomRatios] = useState(false);

  // Typography configuration
  const [lhRoot, setLhRoot] = useState(1.5);
  const [measureCh, setMeasureCh] = useState(65);
  const [previewText, setPreviewText] = useState("");

  // UI state
  const [activePanel, setActivePanel] = useState<"controls" | "export">(
    "controls",
  );

  const getDisplayText = () => previewText || "The quick brown fox";
  const getBodyText = () =>
    previewText
      ? `${previewText} jumps over the lazy dog. link example.`
      : "The quick brown fox jumps over the lazy dog. link example.";

  // Enhanced heading size computation with mobile-responsive support
  function computeHeadingSizes(): {
    h1: { calculation: any; formatted: string };
    h2: { calculation: any; formatted: string };
    h3: { calculation: any; formatted: string };
    h4: { calculation: any; formatted: string };
    h5: { calculation: any; formatted: string };
    h6: { calculation: any; formatted: string };
  } {
    const ratio = defaultRatios[ratioKey];

    if (outputType === "static") {
      const h1calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        6,
      );
      const h2calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        5,
      );
      const h3calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        4,
      );
      const h4calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        3,
      );
      const h5calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        2,
      );
      const h6calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio },
        1,
      );

      return {
        h1: { calculation: h1calc, formatted: formatSize(h1calc, unit) },
        h2: { calculation: h2calc, formatted: formatSize(h2calc, unit) },
        h3: { calculation: h3calc, formatted: formatSize(h3calc, unit) },
        h4: { calculation: h4calc, formatted: formatSize(h4calc, unit) },
        h5: { calculation: h5calc, formatted: formatSize(h5calc, unit) },
        h6: { calculation: h6calc, formatted: formatSize(h6calc, unit) },
      };
    } else if (outputType === "fluid") {
      const h1Max = bodyMax * Math.pow(ratio, 6);
      const h2Max = bodyMax * Math.pow(ratio, 5);
      const h3Max = bodyMax * Math.pow(ratio, 4);
      const h4Max = bodyMax * Math.pow(ratio, 3);
      const h5Max = bodyMax * Math.pow(ratio, 2);
      const h6Max = bodyMax * Math.pow(ratio, 1);

      const h1Min = bodyMin * Math.pow(ratio, 6);
      const h2Min = bodyMin * Math.pow(ratio, 5);
      const h3Min = bodyMin * Math.pow(ratio, 4);
      const h4Min = bodyMin * Math.pow(ratio, 3);
      const h5Min = bodyMin * Math.pow(ratio, 2);
      const h6Min = bodyMin * Math.pow(ratio, 1);

      const h1calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h1Min,
        maxSize: h1Max,
      });
      const h2calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h2Min,
        maxSize: h2Max,
      });
      const h3calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h3Min,
        maxSize: h3Max,
      });
      const h4calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h4Min,
        maxSize: h4Max,
      });
      const h5calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h5Min,
        maxSize: h5Max,
      });
      const h6calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: h6Min,
        maxSize: h6Max,
      });

      return {
        h1: { calculation: h1calc, formatted: formatSize(h1calc, unit) },
        h2: { calculation: h2calc, formatted: formatSize(h2calc, unit) },
        h3: { calculation: h3calc, formatted: formatSize(h3calc, unit) },
        h4: { calculation: h4calc, formatted: formatSize(h4calc, unit) },
        h5: { calculation: h5calc, formatted: formatSize(h5calc, unit) },
        h6: { calculation: h6calc, formatted: formatSize(h6calc, unit) },
      };
    } else {
      // Mobile-first responsive logic
      const ratios = useCustomRatios
        ? { mobile: customMobileRatio, desktop: customDesktopRatio }
        : responsiveRatioPresets[responsiveRatioPreset];

      const h1calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 6,
        contentType,
      });
      const h2calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 5,
        contentType,
      });
      const h3calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 4,
        contentType,
      });
      const h4calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 3,
        contentType,
      });
      const h5calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 2,
        contentType,
      });
      const h6calc = calculateResponsiveSize({
        minViewport,
        maxViewport,
        mobileRatio: ratios.mobile,
        desktopRatio: ratios.desktop,
        baseSize: bodyMin,
        step: 1,
        contentType,
      });

      return {
        h1: { calculation: h1calc, formatted: formatSize(h1calc, unit) },
        h2: { calculation: h2calc, formatted: formatSize(h2calc, unit) },
        h3: { calculation: h3calc, formatted: formatSize(h3calc, unit) },
        h4: { calculation: h4calc, formatted: formatSize(h4calc, unit) },
        h5: { calculation: h5calc, formatted: formatSize(h5calc, unit) },
        h6: { calculation: h6calc, formatted: formatSize(h6calc, unit) },
      };
    }
  }

  const headingSizes = useMemo(
    () => computeHeadingSizes(),
    [
      outputType,
      staticBaseSize,
      bodyMin,
      bodyMax,
      ratioKey,
      unit,
      minViewport,
      maxViewport,
      contentType,
      responsiveRatioPreset,
      customMobileRatio,
      customDesktopRatio,
      useCustomRatios,
    ],
  );

  const bodySize = useMemo(() => {
    if (outputType === "static") {
      const calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio: 1 },
        0,
      );
      return { calculation: calc, formatted: formatSize(calc, unit) };
    } else if (outputType === "responsive") {
      const calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: bodyMin,
        maxSize: bodyMax,
      });
      return { calculation: calc, formatted: formatSize(calc, unit) };
    } else {
      const calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize: bodyMin,
        maxSize: bodyMax,
      });
      return { calculation: calc, formatted: formatSize(calc, unit) };
    }
  }, [
    outputType,
    staticBaseSize,
    bodyMin,
    bodyMax,
    unit,
    minViewport,
    maxViewport,
  ]);

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
        outputType: { value: outputType, type: "string" },
        contentType: { value: contentType, type: "string" },
        roles: {
          display: {
            size: {
              value: headingSizes.h1.calculation.value,
              type: "fontSize",
            },
          },
          headline: {
            size: {
              value: headingSizes.h2.calculation.value,
              type: "fontSize",
            },
          },
          title: {
            size: {
              value: headingSizes.h3.calculation.value,
              type: "fontSize",
            },
          },
          body: {
            size: {
              value: bodySize.calculation.value,
              type: "fontSize",
            },
          },
          label: {
            size: {
              value: headingSizes.h6.calculation.value,
              type: "fontSize",
            },
          },
        },
      },
    };
  }, [fontFamily, lhRoot, headingSizes, bodySize, outputType, contentType]);

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

  const getCurrentRatios = () => {
    if (outputType === "responsive") {
      return useCustomRatios
        ? { mobile: customMobileRatio, desktop: customDesktopRatio }
        : responsiveRatioPresets[responsiveRatioPreset];
    }
    return null;
  };

  const currentRatios = getCurrentRatios();

  return (
    <>
      {/* Sidebar Controls */}
      <aside className={cx(styles.sidebar, defaultStyles.sidebar)}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Configuration</h2>
          <nav className={styles.panelTabs}>
            <button
              className={cx(
                styles.panelTab,
                activePanel === "controls" && styles.panelTabActive,
              )}
              onClick={() => setActivePanel("controls")}
              type="button"
            >
              Settings
            </button>
            <button
              className={cx(
                styles.panelTab,
                activePanel === "export" && styles.panelTabActive,
              )}
              onClick={() => setActivePanel("export")}
              type="button"
            >
              Export
            </button>
          </nav>
        </div>

        <div className={styles.sidebarContent}>
          {activePanel === "controls" ? (
            <div className={styles.controlsPanel}>
              {/* Project Settings */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Project</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Project Name</span>
                    <input
                      className={styles.input}
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                    />
                  </label>
                </div>
              </section>

              {/* Output Configuration */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Output Configuration</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Output Type</span>
                    <select
                      className={styles.select}
                      value={outputType}
                      onChange={(e) =>
                        setOutputType(e.target.value as OutputType)
                      }
                    >
                      <option value="responsive">
                        Responsive (Mobile-First)
                      </option>
                      <option value="static">Static (base × ratio)</option>
                      <option value="fluid">Fluid (clamp)</option>
                    </select>
                    <span className={styles.helpText}>
                      {outputType === "responsive" &&
                        "Mobile-optimized with adaptive scaling ratios"}
                      {outputType === "static" &&
                        "Fixed sizes multiplied by scale ratio"}
                      {outputType === "fluid" &&
                        "Responsive sizes using CSS clamp()"}
                    </span>
                  </label>
                </div>
              </section>

              {/* Mobile-Responsive Configuration */}
              {outputType === "responsive" && (
                <section className={styles.controlSection}>
                  <h3 className={styles.sectionTitle}>
                    Mobile-Responsive Settings
                  </h3>
                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>Content Type</span>
                      <select
                        className={styles.select}
                        value={contentType}
                        onChange={(e) =>
                          setContentType(e.target.value as ContentType)
                        }
                      >
                        <option value="marketing">
                          Marketing (High Contrast)
                        </option>
                        <option value="balanced">Balanced (Recommended)</option>
                        <option value="content">
                          Content/Blog (Conservative)
                        </option>
                        <option value="product">
                          Product/App (Minimal Contrast)
                        </option>
                      </select>
                      <span className={styles.helpText}>
                        {contentType === "marketing" &&
                          "Larger headings for landing pages and marketing sites"}
                        {contentType === "balanced" &&
                          "Good balance between hierarchy and mobile usability"}
                        {contentType === "content" &&
                          "Optimized for reading and content-heavy sites"}
                        {contentType === "product" &&
                          "Minimal scaling for dashboards and applications"}
                      </span>
                    </label>

                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>
                        Responsive Scaling
                      </span>
                      <select
                        className={styles.select}
                        value={
                          useCustomRatios ? "custom" : responsiveRatioPreset
                        }
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setUseCustomRatios(true);
                          } else {
                            setUseCustomRatios(false);
                            setResponsiveRatioPreset(
                              e.target.value as ResponsiveRatioPreset,
                            );
                          }
                        }}
                      >
                        <option value="conservative">
                          Conservative (1.125 → 1.25)
                        </option>
                        <option value="balanced">Balanced (1.2 → 1.333)</option>
                        <option value="dramatic">Dramatic (1.25 → 1.5)</option>
                        <option value="extreme">Extreme (1.333 → 1.618)</option>
                        <option value="custom">Custom Ratios</option>
                      </select>
                      <span className={styles.helpText}>
                        Mobile ratio → Desktop ratio scaling
                      </span>
                    </label>

                    {useCustomRatios && (
                      <div className={styles.splitGroup}>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>Mobile Ratio</span>
                          <input
                            className={styles.input}
                            type="number"
                            step="0.05"
                            min="1.05"
                            max="1.5"
                            value={customMobileRatio}
                            onChange={(e) =>
                              setCustomMobileRatio(+e.target.value)
                            }
                          />
                          <span className={styles.helpText}>
                            1.05 - 1.5 recommended
                          </span>
                        </label>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Desktop Ratio
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            step="0.05"
                            min="1.1"
                            max="2.0"
                            value={customDesktopRatio}
                            onChange={(e) =>
                              setCustomDesktopRatio(+e.target.value)
                            }
                          />
                          <span className={styles.helpText}>
                            1.1 - 2.0 recommended
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Typography Settings */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Typography</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Font Family</span>
                    <select
                      className={styles.select}
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

                  {(outputType === "static" || outputType === "fluid") && (
                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>Scale Ratio</span>
                      <select
                        className={styles.select}
                        value={ratioKey}
                        onChange={(e) =>
                          setRatioKey(e.target.value as RatioKey)
                        }
                      >
                        {Object.entries(defaultRatios).map(([k, v]) => (
                          <option key={k} value={k}>{`${k} (${v})`}</option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Units</span>
                    <select
                      className={styles.select}
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as "px" | "rem")}
                    >
                      <option value="px">Pixels (px)</option>
                      <option value="rem">Root Em (rem)</option>
                    </select>
                  </label>

                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Line Height</span>
                    <input
                      className={styles.input}
                      type="number"
                      step="0.05"
                      value={lhRoot}
                      onChange={(e) => setLhRoot(+e.target.value)}
                    />
                  </label>
                </div>
              </section>

              {/* Size Settings */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Size Settings</h3>
                <div className={styles.controlGroup}>
                  {outputType === "static" && (
                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>
                        Base Size ({unit})
                      </span>
                      <input
                        className={styles.input}
                        type="number"
                        min={12}
                        value={
                          unit === "px"
                            ? staticBaseSize
                            : +(staticBaseSize / 16).toFixed(3)
                        }
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          setStaticBaseSize(unit === "px" ? n : n * 16);
                        }}
                      />
                    </label>
                  )}

                  {(outputType === "fluid" || outputType === "responsive") && (
                    <>
                      <div className={styles.splitGroup}>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Min Size ({unit})
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            min={12}
                            value={
                              unit === "px"
                                ? bodyMin
                                : +(bodyMin / 16).toFixed(3)
                            }
                            onChange={(e) => {
                              const n = Number(e.target.value);
                              setBodyMin(unit === "px" ? n : n * 16);
                            }}
                          />
                        </label>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Max Size ({unit})
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            min={12}
                            value={
                              unit === "px"
                                ? bodyMax
                                : +(bodyMax / 16).toFixed(3)
                            }
                            onChange={(e) => {
                              const n = Number(e.target.value);
                              setBodyMax(unit === "px" ? n : n * 16);
                            }}
                          />
                        </label>
                      </div>
                      <div className={styles.splitGroup}>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Min Viewport (px)
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            value={minViewport}
                            onChange={(e) => setMinViewport(+e.target.value)}
                          />
                        </label>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Max Viewport (px)
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            value={maxViewport}
                            onChange={(e) => setMaxViewport(+e.target.value)}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Preview Text */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Preview Text</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Custom Text</span>
                    <input
                      className={styles.input}
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Enter custom preview text..."
                    />
                    <span className={styles.helpText}>
                      Leave empty for default "The quick brown fox" text
                    </span>
                  </label>
                </div>
              </section>
            </div>
          ) : (
            <div className={styles.exportPanel}>
              <QuickExport
                projectName={projectName}
                tokens={tokens}
                filesForZip={filesForZip}
                roleMap={identityRoleMap}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className={cx(styles.main, defaultStyles.hero)}>
        <div
          className={styles.previewContainer}
          style={{ fontFamily: previewFontFamily }}
        >
          {/* Live Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Mode</span>
              <span className={styles.statValue}>{outputType}</span>
            </div>
            {outputType === "responsive" && currentRatios && (
              <>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Content</span>
                  <span className={styles.statValue}>{contentType}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Mobile</span>
                  <span className={styles.statValue}>
                    {currentRatios.mobile.toFixed(2)}
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Desktop</span>
                  <span className={styles.statValue}>
                    {currentRatios.desktop.toFixed(2)}
                  </span>
                </div>
              </>
            )}
            {(outputType === "static" || outputType === "fluid") && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Ratio</span>
                <span className={styles.statValue}>
                  {defaultRatios[ratioKey]}
                </span>
              </div>
            )}
            <div className={styles.stat}>
              <span className={styles.statLabel}>Base</span>
              <span className={styles.statValue}>{bodySize.formatted}</span>
            </div>
            {(outputType === "fluid" || outputType === "responsive") && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Viewport</span>
                <span className={styles.statValue}>
                  {minViewport}px → {maxViewport}px
                </span>
              </div>
            )}
          </div>

          {/* Typography Specimens */}
          <div className={styles.specimens}>
            <div className={styles.specimenGroup}>
              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H1 Display</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h1.formatted).toFixed(2)
                      : headingSizes.h1.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h1
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h1.formatted as any,
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {getDisplayText()}
                </h1>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H2 Headline</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h2.formatted).toFixed(2)
                      : headingSizes.h2.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h2
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h2.formatted as any,
                    lineHeight: 1.2,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {getDisplayText()}
                </h2>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H3 Title</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h3.formatted).toFixed(2)
                      : headingSizes.h3.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h3
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h3.formatted,
                    lineHeight: 1.25,
                    fontWeight: 600,
                  }}
                >
                  {getDisplayText()}
                </h3>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H4 Subtitle</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h4.formatted).toFixed(2)
                      : headingSizes.h4.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h4
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h4.formatted as any,
                    lineHeight: 1.3,
                    fontWeight: 600,
                  }}
                >
                  {getDisplayText()}
                </h4>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H5 Heading</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h5.formatted).toFixed(2)
                      : headingSizes.h5.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h5
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h5.formatted as any,
                    lineHeight: 1.35,
                    fontWeight: 600,
                  }}
                >
                  {getDisplayText()}
                </h5>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>H6 Label</span>
                  <code className={styles.specimenCode}>
                    {outputType === "static"
                      ? parseFloat(headingSizes.h6.formatted).toFixed(2)
                      : headingSizes.h6.formatted}{" "}
                    {outputType === "static" ? "px" : ""}
                  </code>
                </div>
                <h6
                  className={styles.specimenText}
                  style={{
                    fontSize: headingSizes.h6.formatted as any,
                    lineHeight: 1.4,
                    fontWeight: 500,
                  }}
                >
                  {getDisplayText()}
                </h6>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>Body Text</span>
                  <code className={styles.specimenCode}>
                    {bodySize.formatted}
                  </code>
                </div>
                <p
                  className={styles.specimenText}
                  style={{
                    fontSize: bodySize.formatted as any,
                    lineHeight: lhRoot,
                  }}
                >
                  {getBodyText().split(" link example.")[0]}{" "}
                  <a href="#" className={styles.link}>
                    link example
                  </a>
                  .
                </p>
              </div>

              <div className={styles.specimen}>
                <div className={styles.specimenMeta}>
                  <span className={styles.specimenLabel}>Small Text</span>
                  <code className={styles.specimenCode}>
                    {formatSize(
                      outputType === "static"
                        ? calculateStaticSize(
                            {
                              baseSize: staticBaseSize,
                              ratio: defaultRatios[ratioKey],
                            },
                            -1,
                          )
                        : outputType === "responsive"
                          ? calculateResponsiveSize({
                              minViewport,
                              maxViewport,
                              mobileRatio: currentRatios?.mobile || 1.2,
                              desktopRatio: currentRatios?.desktop || 1.333,
                              baseSize: bodyMin,
                              step: -1,
                              contentType,
                            })
                          : calculateFluidSize({
                              minViewport,
                              maxViewport,
                              minSize: bodyMin * 0.875,
                              maxSize: bodyMax * 0.875,
                            }),
                      unit,
                    )}
                  </code>
                </div>
                <small
                  className={styles.specimenText}
                  style={{
                    fontSize: formatSize(
                      outputType === "static"
                        ? calculateStaticSize(
                            {
                              baseSize: staticBaseSize,
                              ratio: defaultRatios[ratioKey],
                            },
                            -1,
                          )
                        : outputType === "responsive"
                          ? calculateResponsiveSize({
                              minViewport,
                              maxViewport,
                              mobileRatio: currentRatios?.mobile || 1.2,
                              desktopRatio: currentRatios?.desktop || 1.333,
                              baseSize: bodyMin,
                              step: -1,
                              contentType,
                            })
                          : calculateFluidSize({
                              minViewport,
                              maxViewport,
                              minSize: bodyMin * 0.875,
                              maxSize: bodyMax * 0.875,
                            }),
                      unit,
                    ) as any,
                    lineHeight: 1.4,
                  }}
                >
                  Small print example for captions and labels.
                </small>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
