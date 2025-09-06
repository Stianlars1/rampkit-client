// @/components/ui/BackgroundEffects/BackgroundEffects.tsx
"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { getRandomPreset } from "./backgroundPresets";

gsap.registerPlugin([ScrollTrigger, useGSAP]);

export const BackgroundEffects = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepCount = 12;

  // Pick one preset for this render
  const preset = useMemo(() => getRandomPreset(), []);

  useGSAP(
    () => {
      const timeline = gsap.timeline();
      const stepElements = gsap.utils.toArray<HTMLDivElement>(
        `.${styles.step}`,
      );

      stepElements.forEach((step, index) => {
        // Get the 'to' config for this specific step
        const toConfig = preset.animation.to(index, stepElements.length);

        // Add our dynamic values
        toConfig.background = getColorFromCSS(`--accent-${index + 1}`);
        toConfig.opacity = index / (stepElements.length - 1);
        toConfig.height = preset.getHeight(index, stepElements.length);

        // Animate from -> to
        timeline.fromTo(step, preset.animation.from, toConfig, 0);
      });
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.stepsWrapper}>
        {Array.from({ length: stepCount }, (_, idx) => (
          <div key={idx} className={styles.step} />
        ))}
      </div>
    </div>
  );
};
