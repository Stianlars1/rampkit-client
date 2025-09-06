"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { getRandomPreset } from "./backgroundPresets";

gsap.registerPlugin([ScrollTrigger, useGSAP]);

export const BackgroundEffects = () => {
  console.log("Rendering BackgroundEffects component");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepCount = 12;

  // Pick one preset for this render
  const preset = getRandomPreset();
  console.log("Selected background animation preset:", preset);

  useGSAP(
    () => {
      console.log("Running GSAP animation setup");
      const timeline = gsap.timeline();
      const stepElements = gsap.utils.toArray<HTMLDivElement>(
        `.${styles.step}`,
      );

      stepElements.forEach((step, index) => {
        // Get the 'to' config for this specific step
        const toConfig = preset.animation.to(index, stepElements.length);

        // Add our dynamic values
        const fallback_bg = getColorFromCSS(`--accent-${index + 1}`);
        const hslAccentBg = `hsl(var(--accent-${index + 1}))`;
        toConfig.background = hslAccentBg || fallback_bg;
        toConfig.opacity = preset.getOpacity(index, stepElements.length - 1);
        toConfig.height = preset.getHeight(index, stepElements.length);

        timeline.fromTo(step, preset.animation.from, toConfig, 0);
      });
    },
    {
      scope: wrapperRef,
    },
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
