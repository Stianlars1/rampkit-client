"use client";

import { useEffect, useState } from "react";
import { ColorInput } from "@/components/ColorInput/ColorInput";
import { ColorRamp } from "@/components/ColorRamp/ColorRamp";
import { ExportPanel } from "@/components/ExportPanel/ExportPanel";
import { PaletteData, Scheme } from "@/types";
import styles from "./page.module.scss";
import { generatePalette } from "@/app/actions/generatePalette";
import { Loader } from "@/components/Loader/Loader";
import { LoadingTips } from "@/components/LoadingTips/LoadingTips";
import { useThemeUpdater } from "@/hooks/useThemeUpdater";
import { ThemeControls } from "@/components/ThemeControls/ThemeControls";
import { bumpVisitorOncePerSession } from "@/lib/metrics/store";
import { StatsPanel } from "@/components/StatsPanel/StatsPanel";

export default function HomePage() {
  const [paletteData, setPaletteData] = useState<PaletteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useThemeUpdater(paletteData);
  useEffect(() => {
    bumpVisitorOncePerSession().then();
  }, []);

  const handleGenerate = async (hex: string, scheme: Scheme) => {
    try {
      setLoading(true);
      setError("");

      const data = generatePalette({ hex, scheme });
      setPaletteData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate palette";
      setError(errorMessage);
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetTheme = () => {
    setPaletteData(null);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.firstSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>Rampkit</h1>
            <p className={styles.subtitle}>
              Generate beautiful 12-step color ramps from any hex color
            </p>
          </div>
          <ColorInput onGenerate={handleGenerate} loading={loading} />

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingInfo}>
              <LoadingTips />
              <div className={styles.loading}>
                <Loader /> <p>Generating palette</p>
              </div>
            </div>
          )}
        </section>

        {paletteData && (
          <>
            <ThemeControls
              onReset={handleResetTheme}
              hasCustomTheme={!!paletteData}
            />
            <div className={styles.results}>
              <ColorRamp data={paletteData} />
              <ExportPanel data={paletteData} />
            </div>
          </>
        )}

        <StatsPanel />
      </main>

      <footer className={styles.footer}>
        <p>
          Built with ♥ by Rampkit •{" "}
          <a
            href={"https://www.radix-ui.com/colors/custom"}
            style={{ color: "inherit" }}
          >
            Radix Custom Color Generator
          </a>{" "}
          • Open Source
        </p>
      </footer>
    </div>
  );
}
