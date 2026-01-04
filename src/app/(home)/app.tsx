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
import { SemanticColorsPreview } from "@/components/ui/SemanticColorsPreview/SemanticColorsPreview";
import { ExportPanel } from "@/components/ui/ExportPanel/ExportPanel";
import layoutStyles from "./layout.module.scss";
import { cx } from "@/lib/utils/cx";
import { usePaletteData } from "@/context/PaletteDataprovider";
import BackgroundEffects from "@/components/ui/BackgroundEffects/BackgroundEffects";
import { useColorHistory } from "@/hooks/useColorHistory";

export const RampKitApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setPaletteData, paletteData, isLoading } = usePaletteData();
  const { history, addToHistory, getInitialValues, isInitialized } =
    useColorHistory();

  // Get initial values from URL/localStorage (set by inline script, no flash)
  const initialValues = getInitialValues();

  useEffect(() => {
    bumpVisitorOncePerSession().then();
  }, []);

  // Auto-generate from URL params on first load
  useEffect(() => {
    if (!isInitialized) return;

    const initial = getInitialValues();
    if (initial.hasInitialParams) {
      handleGenerate(
        initial.hex,
        initial.scheme,
        initial.harmonized,
        initial.pureColorTheory,
        initial.harmonyColorIndex,
      );
    }
  }, [isInitialized]);

  const handleGenerate = async (
    hex: string,
    scheme: Scheme,
    harmonizeColors: boolean,
    pureColorTheory: boolean,
    harmonyColorIndex = 0,
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = generatePalette({
        hex,
        scheme,
        harmonized: harmonizeColors,
        pureColorTheory,
        harmonyColorIndex,
      });
      setPaletteData(data);

      // Add to history and update URL
      addToHistory({
        inputHex: hex,
        generatedAccent: data.accent,
        scheme,
        harmonized: harmonizeColors,
        pureColorTheory,
        harmonyColorIndex,
      });
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
            <h1 className={styles.title} data-text="Rampkit">
              Rampkit
            </h1>
            <p
              className={styles.subtitle}
              data-text="Generate beautiful 12-step color ramps from any hex color"
            >
              Generate beautiful 12-step color ramps from any hex color
            </p>

            {/*            <div className={styles.backgroundContrast_1} />
            <div className={styles.backgroundContrast_2} />*/}
          </div>
          <ColorInput
            firstRenderHex={paletteData?.brandColor ?? initialValues.hex}
            onGenerate={handleGenerate}
            loading={loading}
            generatedAccent={paletteData?.accent}
            wasHarmonized={paletteData?.harmonized}
            activeScheme={paletteData?.scheme}
            history={history}
            initialScheme={initialValues.scheme}
            initialHarmonized={initialValues.harmonized}
            initialPureColorTheory={initialValues.pureColorTheory}
            initialHarmonyIndex={initialValues.harmonyColorIndex}
            hasInitialParams={initialValues.hasInitialParams}
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
            <SemanticColorsPreview data={paletteData} />
            <ExportPanel data={paletteData} />
          </section>
        )}
      </main>
      {!isLoading && <BackgroundEffects />}
    </div>
  );
};
