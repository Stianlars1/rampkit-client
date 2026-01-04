// BackgroundEffects.tsx
"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { memo, useCallback, useMemo, useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { getRandomPreset } from "./backgroundPresets";
import { useTheme } from "@/context/ThemeProvider";
import { usePaletteData } from "@/context/PaletteDataprovider";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";

gsap.registerPlugin([ScrollTrigger, useGSAP]);

const BackgroundEffects = memo(() => {
  const { resolvedTheme: theme } = useTheme();
  const { paletteData, hasStoredData } = usePaletteData();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepCount = 12;
  const hasGeneratedTheme = useHasGeneratedTheme();
  // Memoize the preset to prevent regeneration on every render
  const preset = useMemo(() => {
    return getRandomPreset();
  }, []); // Empty dependency array - only generate once

  const createAnimation = useCallback(() => {
    const timeline = gsap.timeline();
    const stepElements = gsap.utils.toArray<HTMLDivElement>(`.${styles.step}`);

    if (paletteData) {
      if (hasStoredData) {
        return;
      }

      // Step 1: Quick fade out
      timeline.to(stepElements, {
        opacity: 0,
        duration: 0.15,
        stagger: 0.02,
      });

      // Step 2: Set captured colors immediately
      timeline.set(stepElements, {
        background: (index) => {
          return (
            paletteData?.accentScale[theme][index] ??
            getColorFromCSS(`--accent-${index + 1}`)
          );
        },
        filter: "blur(0px)",
        opacity: 0,
      });

      // Step 3: Fade back in
      timeline.to(stepElements, {
        opacity: (index: number) => preset.getOpacity(index, stepCount),
        duration: 0.15,
        stagger: 0.02,
      });

      // Step 4: Final transformation - explicitly maintain colors
      return timeline.to(stepElements, {
        opacity: 0.06,
        duration: 1.25,
        filter: "blur(10px)",
        z: (index) => -index * 25,
        scale: 0.75,
        ease: "power2.inOut",
        rotateY: "5deg",
        background: (index) => {
          return (
            paletteData?.accentScale[theme][index] ??
            getColorFromCSS(`--accent-${index + 1}`)
          );
        },
      });
    }

    // Default animation for when no palette is generated

    stepElements.forEach((step, index) => {
      const fromConfig = preset.animation.from(index, stepElements.length);
      const toConfig = preset.animation.to(index, stepElements.length);
      fromConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.opacity = preset.getOpacity(index, stepElements.length - 1);
      toConfig.height = preset.getHeight(index, stepElements.length);

      timeline.fromTo(step, fromConfig, toConfig, 0);
    });

    return timeline;
  }, [paletteData?.accent, hasStoredData, preset, theme, hasGeneratedTheme]); // Use preset.name instead of preset object

  useGSAP(createAnimation, {
    scope: wrapperRef,
    dependencies: [theme, preset.name, paletteData?.accent, hasGeneratedTheme],
  });

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.stepsWrapper}>
        {Array.from({ length: stepCount }, (_, idx) => (
          <div id={`STEP_${idx}`} key={idx} className={styles.step} />
        ))}
      </div>
    </div>
  );
});
BackgroundEffects.displayName = "BackgroundEffects";
export default BackgroundEffects;
