"use client";
import { PaletteData } from "@/types";
import styles from "./SemanticColorsPreview.module.scss";

interface SemanticColorsPreviewProps {
  data: PaletteData;
}

export const SemanticColorsPreview = ({ data }: SemanticColorsPreviewProps) => {
  const semanticTypes = [
    { key: "success", label: "Success", icon: "✓" },
    { key: "danger", label: "Danger", icon: "✕" },
    { key: "warning", label: "Warning", icon: "⚠" },
    { key: "info", label: "Info", icon: "ℹ" },
  ] as const;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Semantic Colors</h2>
        <p className={styles.subtitle}>
          Algorithmically generated feedback colors with WCAG AA compliance
        </p>
      </div>

      <div className={styles.preview}>
        {semanticTypes.map(({ key, label, icon }) => {
          const lightColors = data.semantic.light[key];
          const darkColors = data.semantic.dark[key];

          return (
            <div key={key} className={styles.semanticGroup}>
              <div className={styles.semanticLabel}>
                <span className={styles.semanticIcon}>{icon}</span>
                <span className={styles.semanticName}>{label}</span>
              </div>

              {/* Light Mode Preview */}
              <div className={styles.modePreview}>
                <div className={styles.modeLabel}>Light Mode</div>
                <div className={styles.colorRow}>
                  {/* Base with foreground text */}
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: lightColors.base }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: lightColors.foreground }}
                    >
                      <span className={styles.swatchName}>Base</span>
                      <span className={styles.swatchHex}>
                        {lightColors.base}
                      </span>
                    </div>
                  </div>

                  {/* Muted with muted foreground text */}
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: lightColors.muted }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: lightColors.mutedForeground }}
                    >
                      <span className={styles.swatchName}>Muted</span>
                      <span className={styles.swatchHex}>
                        {lightColors.muted}
                      </span>
                    </div>
                  </div>

                  {/* Border */}
                  <div
                    className={styles.colorSwatch}
                    style={{
                      backgroundColor: data.lightBackground,
                      borderColor: lightColors.border,
                      borderWidth: "2px",
                      borderStyle: "solid",
                    }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: data.grayScale.light[11] }}
                    >
                      <span className={styles.swatchName}>Border</span>
                      <span className={styles.swatchHex}>
                        {lightColors.border}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div className={styles.modePreview}>
                <div className={styles.modeLabel}>Dark Mode</div>
                <div className={styles.colorRow}>
                  {/* Base with foreground text */}
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: darkColors.base }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: darkColors.foreground }}
                    >
                      <span className={styles.swatchName}>Base</span>
                      <span className={styles.swatchHex}>
                        {darkColors.base}
                      </span>
                    </div>
                  </div>

                  {/* Muted with muted foreground text */}
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: darkColors.muted }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: darkColors.mutedForeground }}
                    >
                      <span className={styles.swatchName}>Muted</span>
                      <span className={styles.swatchHex}>
                        {darkColors.muted}
                      </span>
                    </div>
                  </div>

                  {/* Border */}
                  <div
                    className={styles.colorSwatch}
                    style={{
                      backgroundColor: data.darkBackground,
                      borderColor: darkColors.border,
                      borderWidth: "2px",
                      borderStyle: "solid",
                    }}
                  >
                    <div
                      className={styles.swatchLabel}
                      style={{ color: data.grayScale.dark[11] }}
                    >
                      <span className={styles.swatchName}>Border</span>
                      <span className={styles.swatchHex}>
                        {darkColors.border}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          All colors meet WCAG AA contrast requirements (4.5:1 minimum)
        </p>
      </div>
    </div>
  );
};
