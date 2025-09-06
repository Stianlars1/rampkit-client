// OptimizedBackgroundEffects.tsx
"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef, useCallback } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { getRandomPreset } from "./backgroundPresets";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";
import { useTheme } from "@/context/ThemeProvider";

gsap.registerPlugin([ScrollTrigger, useGSAP]);

export const BackgroundEffects = () => {
  const hasGeneratedPalette = useHasGeneratedTheme();
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepCount = 12;

  // Stabilize preset - only regenerate on first palette generation
  const preset = useMemo(() => {
    return getRandomPreset();
  }, []); // Remove hasGeneratedPalette dependency

  // Memoize animation function to prevent recreation
  const createAnimation = useCallback(() => {
    const timeline = gsap.timeline();
    const stepElements = gsap.utils.toArray<HTMLDivElement>(`.${styles.step}`);

    if (hasGeneratedPalette) {
      stepElements.forEach((step, idx) => {
        timeline.to(
          step,
          {
            background: getColorFromCSS(`--accent-${idx + 1}`),
            duration: 0.8,
            stagger: 0.05,
          },
          "<",
        );
      });

      stepElements.forEach((step, idx) => {
        timeline.to(
          step,
          {
            opacity: 0.06,
            duration: 0.8,
            stagger: 0.05,
            filter: "blur(10px)",
            //y: -idx * 2.5,
            z: -idx * 25,
            scale: 0.75,
            ease: "power2.inOut",
            rotateY: "5deg",
          },
          0.3,
        );
      });
      return;
    }

    stepElements.forEach((step, index) => {
      const fromConfig = preset.animation.from(index, stepElements.length);
      const toConfig = preset.animation.to(index, stepElements.length);

      fromConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.background = getColorFromCSS(`--accent-${index + 1}`);
      toConfig.opacity = preset.getOpacity(index, stepElements.length - 1);
      toConfig.height = preset.getHeight(index, stepElements.length);

      // Reduce initial delays for faster visual start

      timeline.fromTo(step, fromConfig, toConfig, 0);
    });
  }, [hasGeneratedPalette, theme, preset]);

  useGSAP(createAnimation, {
    scope: wrapperRef,
    dependencies: [hasGeneratedPalette, theme],
  });

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
