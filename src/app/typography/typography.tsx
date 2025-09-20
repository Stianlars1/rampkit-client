"use client";
import defaultStyles from "./page.module.scss";
import { useEffect, useMemo, useState } from "react";
import styles from "./typography.module.scss";
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
  calculateFluidSize,
  calculateStaticSize,
  defaultRatios,
  formatSize,
  OutputType,
  RatioKey,
} from "@/lib/typography/core";
import { buildExports } from "@/lib/typography/buildExports";

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

/** Single source of truth for responsive scaling */
type ScalingProfile =
  | "product"
  | "content"
  | "balanced"
  | "marketing"
  | "extreme";
const scalingProfiles: Record<
  ScalingProfile,
  { mobile: number; desktop: number; h1Cap: number }
> = {
  product: { mobile: 1.12, desktop: 1.25, h1Cap: 36 },
  content: { mobile: 1.15, desktop: 1.3, h1Cap: 40 },
  balanced: { mobile: 1.2, desktop: 1.333, h1Cap: 44 },
  marketing: { mobile: 1.25, desktop: 1.5, h1Cap: 52 },
  extreme: { mobile: 1.333, desktop: 1.618, h1Cap: 60 },
};

export default function TypographyTool() {
  // Project / output
  const [projectName, setProjectName] = useState("typography");
  const [outputType, setOutputType] = useState<OutputType>("responsive");

  // Font & units
  const [fontFamily, setFontFamily] = useState(
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  );
  const [previewFontFamily, setPreviewFontFamily] = useState(
    fontFamilyPreviewOptions[0].style.fontFamily,
  );
  const [unit, setUnit] = useState<"px" | "rem">("px");

  // Static / Fluid knobs
  const [ratioKey, setRatioKey] = useState<RatioKey>("perfectFifth");
  const [staticBaseSize, setStaticBaseSize] = useState(16);

  // Responsive / Fluid shared knobs
  const [bodyMin, setBodyMin] = useState(16);
  const [bodyMax, setBodyMax] = useState(18);
  const [minViewport, setMinViewport] = useState(DEFAULT_RANGE.minViewport);
  const [maxViewport, setMaxViewport] = useState(DEFAULT_RANGE.maxViewport);

  // Mobile optimization
  const [optimizeMobile, setOptimizeMobile] = useState(true);
  const [mobileH1Cap, setMobileH1Cap] = useState(44);
  const [capTouched, setCapTouched] = useState(false); // tracks manual override

  // Profiles
  const [profile, setProfile] = useState<ScalingProfile>("balanced");
  const [useCustomRatios, setUseCustomRatios] = useState(false);
  const [customMobileRatio, setCustomMobileRatio] = useState(1.2);
  const [customDesktopRatio, setCustomDesktopRatio] = useState(1.333);

  // Typographic misc
  const [lhRoot, setLhRoot] = useState(1.5);
  const [previewText, setPreviewText] = useState("");

  // UI
  const [activePanel, setActivePanel] = useState<"controls" | "export">(
    "controls",
  );

  const getDisplayText = () => previewText || "The quick brown fox";
  const getBodyText = () =>
    previewText
      ? `${previewText} jumps over the lazy dog. link example.`
      : "The quick brown fox jumps over the lazy dog. link example.";

  // Seed the mobile cap from profile until user edits it
  useEffect(() => {
    if (!capTouched) setMobileH1Cap(scalingProfiles[profile].h1Cap);
  }, [profile, capTouched]);

  // Ratios
  const currentMobileRatio = useCustomRatios
    ? customMobileRatio
    : scalingProfiles[profile].mobile;

  const currentDesktopRatio = useCustomRatios
    ? customDesktopRatio
    : scalingProfiles[profile].desktop;

  // Per-step mobile caps (H1=step 6 … H6=step 1)
  const capForStepPx = (step: number) =>
    mobileH1Cap / Math.pow(Math.max(currentMobileRatio, 1.05), 6 - step);

  // ---------- Size computation ----------
  function computeHeadingSizes(): Record<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    { calculation: any; formatted: string }
  > {
    const mkStatic = (step: number, ratio: number) =>
      calculateStaticSize({ baseSize: staticBaseSize, ratio }, step);

    if (outputType === "static") {
      const R = defaultRatios[ratioKey];
      const mk = (s: number) => {
        const calc = mkStatic(s, R);
        return { calculation: calc, formatted: formatSize(calc, unit) };
      };
      return {
        h1: mk(6),
        h2: mk(5),
        h3: mk(4),
        h4: mk(3),
        h5: mk(2),
        h6: mk(1),
      };
    }

    if (outputType === "fluid") {
      const R = defaultRatios[ratioKey];
      const mk = (step: number) => {
        const maxSize = bodyMax * Math.pow(R, step);
        const rawMin = bodyMin * Math.pow(R, step);
        const minSize = optimizeMobile
          ? Math.min(rawMin, capForStepPx(step))
          : rawMin;
        const calc = calculateFluidSize({
          minViewport,
          maxViewport,
          minSize,
          maxSize,
        });
        return { calculation: calc, formatted: formatSize(calc, unit) };
      };
      return {
        h1: mk(6),
        h2: mk(5),
        h3: mk(4),
        h4: mk(3),
        h5: mk(2),
        h6: mk(1),
      };
    }

    // Responsive (recommended): profile/custom ratios + mobile caps
    const mk = (step: number) => {
      const minRaw = bodyMin * Math.pow(currentMobileRatio, step);
      const minSize = optimizeMobile
        ? Math.min(minRaw, capForStepPx(step))
        : minRaw;
      const baseMax = Math.max(bodyMax, bodyMin);
      const maxSize = baseMax * Math.pow(currentDesktopRatio, step);
      const calc = calculateFluidSize({
        minViewport,
        maxViewport,
        minSize,
        maxSize,
      });
      return { calculation: calc, formatted: formatSize(calc, unit) };
    };

    return { h1: mk(6), h2: mk(5), h3: mk(4), h4: mk(3), h5: mk(2), h6: mk(1) };
  }

  const headingSizes = useMemo(
    () => computeHeadingSizes(),
    [
      outputType,
      ratioKey,
      bodyMin,
      bodyMax,
      unit,
      minViewport,
      maxViewport,
      optimizeMobile,
      // responsive inputs
      profile,
      useCustomRatios,
      customMobileRatio,
      customDesktopRatio,
      mobileH1Cap, // <-- direct dependency so changes re-run
    ],
  );

  const bodySize = useMemo(() => {
    if (outputType === "static") {
      const calc = calculateStaticSize(
        { baseSize: staticBaseSize, ratio: 1 },
        0,
      );
      return { calculation: calc, formatted: formatSize(calc, unit) };
    }
    const calc = calculateFluidSize({
      minViewport,
      maxViewport,
      minSize: bodyMin,
      maxSize: bodyMax,
    });
    return { calculation: calc, formatted: formatSize(calc, unit) };
  }, [
    outputType,
    staticBaseSize,
    bodyMin,
    bodyMax,
    unit,
    minViewport,
    maxViewport,
  ]);

  // Tokens (export will reflect the clamp strings that include your cap)
  const tokens = useMemo(() => {
    return {
      $schema: "https://design-tokens.github.io/schema.json",
      typography: {
        font: { family: { sans: { value: fontFamily, type: "fontFamily" } } },
        lineHeight: { root: { value: lhRoot, type: "lineHeight" } },
        outputType: { value: outputType, type: "string" },
        roles: {
          display: {
            size: { value: headingSizes.h1.formatted, type: "fontSize" },
          },
          headline: {
            size: { value: headingSizes.h2.formatted, type: "fontSize" },
          },
          title: {
            size: { value: headingSizes.h3.formatted, type: "fontSize" },
          },
          body: { size: { value: bodySize.formatted, type: "fontSize" } },
          label: {
            size: { value: headingSizes.h6.formatted, type: "fontSize" },
          },
        },
        meta: {
          viewport: { min: minViewport, max: maxViewport },
          responsive: {
            profile,
            useCustomRatios,
            mobileRatio: currentMobileRatio,
            desktopRatio: currentDesktopRatio,
            optimizeMobile,
            mobileH1Cap,
          },
        },
      },
    };
  }, [
    fontFamily,
    lhRoot,
    headingSizes,
    bodySize,
    outputType,
    minViewport,
    maxViewport,
    profile,
    useCustomRatios,
    currentMobileRatio,
    currentDesktopRatio,
    optimizeMobile,
    mobileH1Cap,
  ]);

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

  // --------------------------- UI -------------------------------------------
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
              {/* Project */}
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

              {/* Output type */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Output</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Type</span>
                    <select
                      className={styles.select}
                      value={outputType}
                      onChange={(e) =>
                        setOutputType(e.target.value as OutputType)
                      }
                    >
                      <option value="responsive">
                        Responsive (Mobile-first)
                      </option>
                      <option value="fluid">Fluid (Clamp)</option>
                      <option value="static">Static (Base × Ratio)</option>
                    </select>
                    <span className={styles.helpText}>
                      Responsive is recommended: smaller ratios on mobile,
                      larger on desktop.
                    </span>
                  </label>
                </div>
              </section>

              {/* Responsive controls */}
              {outputType === "responsive" && (
                <section className={styles.controlSection}>
                  <h3 className={styles.sectionTitle}>Scaling</h3>
                  <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>Scaling profile</span>
                      <select
                        className={styles.select}
                        value={useCustomRatios ? "custom" : profile}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setUseCustomRatios(true);
                          } else {
                            setUseCustomRatios(false);
                            setProfile(e.target.value as ScalingProfile);
                          }
                        }}
                      >
                        <option value="product">Product/App (minimal)</option>
                        <option value="content">
                          Content/Blog (conservative)
                        </option>
                        <option value="balanced">Balanced (recommended)</option>
                        <option value="marketing">
                          Marketing (bigger headings)
                        </option>
                        <option value="extreme">Extreme (1.333 → 1.618)</option>
                        <option value="custom">Custom</option>
                      </select>
                    </label>

                    {useCustomRatios && (
                      <div className={styles.splitGroup}>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>Mobile ratio</span>
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
                        </label>
                        <label className={styles.controlLabel}>
                          <span className={styles.labelText}>
                            Desktop ratio
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
                        </label>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Typography */}
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
                      <span className={styles.labelText}>Scale ratio</span>
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
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                    </select>
                  </label>

                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Root line-height</span>
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

              {/* Sizes */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Sizes</h3>
                <div className={styles.controlGroup}>
                  {outputType === "static" && (
                    <label className={styles.controlLabel}>
                      <span className={styles.labelText}>
                        Base size ({unit})
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
                            Min size ({unit})
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
                            Max size ({unit})
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
                            Min viewport (px)
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
                            Max viewport (px)
                          </span>
                          <input
                            className={styles.input}
                            type="number"
                            value={maxViewport}
                            onChange={(e) => setMaxViewport(+e.target.value)}
                          />
                        </label>
                      </div>

                      <div
                        className={styles.controlLabel}
                        style={{ marginTop: 6 }}
                      >
                        <label className={styles.switchLabel}>
                          <input
                            type="checkbox"
                            checked={optimizeMobile}
                            onChange={(e) =>
                              setOptimizeMobile(e.target.checked)
                            }
                          />
                          Optimize for mobile (cap heading sizes at min
                          viewport)
                        </label>
                        {optimizeMobile && (
                          <div className={styles.splitGroup}>
                            <label className={styles.controlLabel}>
                              <span className={styles.labelText}>
                                Max H1 on mobile (px)
                              </span>
                              <input
                                className={styles.input}
                                type="number"
                                min={24}
                                max={96}
                                value={mobileH1Cap}
                                onChange={(e) => {
                                  setCapTouched(true);
                                  setMobileH1Cap(+e.target.value);
                                }}
                              />
                              <span className={styles.helpText}>
                                36–48 works best on real devices
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Preview text */}
              <section className={styles.controlSection}>
                <h3 className={styles.sectionTitle}>Preview text</h3>
                <div className={styles.controlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.labelText}>Custom text</span>
                    <input
                      className={styles.input}
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Enter custom preview text…"
                    />
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

      {/* Main Preview */}
      <main className={cx(styles.main, defaultStyles.hero)}>
        <div
          className={styles.previewContainer}
          style={{ fontFamily: previewFontFamily }}
        >
          {/* Stats */}
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Mode</span>
              <span className={styles.statValue}>{outputType}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Base</span>
              <span className={styles.statValue}>{bodySize.formatted}</span>
            </div>
            {outputType !== "static" && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Viewport</span>
                <span className={styles.statValue}>
                  {minViewport}px → {maxViewport}px
                </span>
              </div>
            )}
          </div>

          {/* Specimens */}
          <div className={styles.specimens}>
            {([6, 5, 4, 3, 2, 1] as const).map((step) => {
              const map: any = {
                6: "h1",
                5: "h2",
                4: "h3",
                3: "h4",
                2: "h5",
                1: "h6",
              };
              const hs = (headingSizes as any)[map[step]];
              const Tag = map[step] as any;
              return (
                <div key={step} className={styles.specimen}>
                  <div className={styles.specimenMeta}>
                    <span className={styles.specimenLabel}>
                      {map[step].toUpperCase()}
                    </span>
                    <code className={styles.specimenCode}>
                      {outputType === "static"
                        ? parseFloat(hs.formatted).toFixed(2) + " px"
                        : hs.formatted}
                    </code>
                  </div>
                  <Tag
                    className={styles.specimenText}
                    style={{
                      fontSize: hs.formatted as any,
                      lineHeight: step >= 5 ? 1.15 : step >= 3 ? 1.22 : 1.3,
                      fontWeight: step >= 4 ? 700 : 600,
                      letterSpacing:
                        step >= 5
                          ? "-0.02em"
                          : step === 4
                            ? "-0.01em"
                            : "normal",
                    }}
                  >
                    {getDisplayText()}
                  </Tag>
                </div>
              );
            })}

            <div className={styles.specimen}>
              <div className={styles.specimenMeta}>
                <span className={styles.specimenLabel}>Body</span>
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
          </div>
        </div>
      </main>
    </>
  );
}
