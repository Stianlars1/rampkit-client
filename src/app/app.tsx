"use client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { Scheme } from "@/types";
import { bumpVisitorOncePerSession } from "@/lib/metrics/store";
import { generatePalette } from "@/app/actions/generatePalette";
import { ColorInput } from "@/components/ui/ColorInput/ColorInput";
import { LoadingTips } from "@/components/ui/LoadingTips/LoadingTips";
import { Loader } from "@/components/ui/Loader/Loader";
import { ColorRamp } from "@/components/ui/ColorRamp/ColorRamp";
import { ExportPanel } from "@/components/ui/ExportPanel/ExportPanel";
import layoutStyles from "./layout.module.scss";
import { cx } from "@/lib/utils/cx";
import { usePaletteData } from "@/context/PaletteDataprovider";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";

export const RampKitApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setPaletteData, paletteData, hasStoredData } = usePaletteData();

  useEffect(() => {
    bumpVisitorOncePerSession().then();
  }, []);

  const handleGenerate = async (
    hex: string,
    scheme: Scheme,
    harmonizeColors: boolean,
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = generatePalette({
        hex,
        scheme,
        harmonized: harmonizeColors,
      });
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

  return (
    <div className={cx(styles.container, layoutStyles.hero)}>
      <main className={styles.main}>
        <section className={styles.firstSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>Rampkit</h1>
            <p className={styles.subtitle}>
              Generate beautiful 12-step color ramps from any hex color
            </p>

            <div className={styles.backgroundContrast_1} />
            <div className={styles.backgroundContrast_2} />
          </div>
          <ColorInput
            firstRenderHex={paletteData?.accent}
            onGenerate={handleGenerate}
            loading={loading}
          />

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
          <section className={styles.results}>
            <ColorRamp data={paletteData} />
            <ExportPanel data={paletteData} />
          </section>
        )}
      </main>
    </div>
  );
};
