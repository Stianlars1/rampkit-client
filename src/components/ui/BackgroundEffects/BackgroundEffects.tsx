"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { getRandomPreset } from "./backgroundPresets";
import { useTheme } from "@/context/ThemeProvider";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";

gsap.registerPlugin([ScrollTrigger, useGSAP]);

export const BackgroundEffects = ({
  hasStoredPaletteData,
  loadingComplete,
}: {
  hasStoredPaletteData: boolean;
  loadingComplete: boolean;
}) => {
  const hasGeneratedPalette = useHasGeneratedTheme();
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepCount = 12;

  // Stabilize preset - only regenerate on first palette generation
  const preset = getRandomPreset();

  const createAnimation = useCallback(() => {
    // Don't start animation until loading is complete
    if (!loadingComplete) return;

    console.log("Creating background animation with preset:", preset.name);
    const timeline = gsap.timeline();
    const stepElements = gsap.utils.toArray<HTMLDivElement>(`.${styles.step}`);

    const capturedColors = Array.from({ length: stepCount }, (_, index) =>
      getColorFromCSS(`--accent-${index + 1}`),
    );

    if (hasGeneratedPalette || hasStoredPaletteData) {
      console.log("hasGeneratedPalette is true, running special animation");

      if (hasStoredPaletteData) {
      }

      // Step 1: Quick fade out
      timeline.to(stepElements, {
        opacity: 0,
        duration: 0.2,
        stagger: 0.04,
      });

      // Step 2: Set captured colors immediately
      timeline.set(stepElements, {
        background: (index) => capturedColors[index],
        filter: "blur(0px)",
        opacity: 0,
      });

      // Step 3: Fade back in
      timeline.to(stepElements, {
        opacity: 1,
        duration: 0.247,
        stagger: 0.05,
      });

      // Step 4: Final transformation - explicitly maintain colors
      timeline.to(
        stepElements,
        {
          filter: "blur(14px) saturate(180%)",
          opacity: 0.06,
          duration: 1.25,
          z: (index) => -index * 25,
          scale: 0.75,
          ease: "power2.inOut",
          rotateY: "5deg",
          background: (index) => capturedColors[index], // Lock in the colors
        },
        "+=0.2",
      );

      return timeline;
    }

    stepElements.forEach((step, index) => {
      const fromConfig = preset.animation.from(index, stepElements.length);
      const toConfig = preset.animation.to(index, stepElements.length);

      fromConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.opacity = preset.getOpacity(index, stepElements.length - 1);
      toConfig.height = preset.getHeight(index, stepElements.length);

      timeline.fromTo(step, fromConfig, toConfig, 0);
    });
  }, [
    hasGeneratedPalette,
    hasStoredPaletteData,
    theme,
    preset,
    loadingComplete,
  ]);

  useGSAP(createAnimation, {
    scope: wrapperRef,
    dependencies: [
      hasGeneratedPalette,
      hasStoredPaletteData,
      theme,
      preset,
      loadingComplete,
    ],
  });

  // Don't render until loading is complete
  if (!loadingComplete) return null;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.stepsWrapper}>
        {Array.from({ length: stepCount }, (_, idx) => (
          <div id={"STEP_" + idx} key={idx} className={styles.step} />
        ))}
      </div>
    </div>
  );
};
