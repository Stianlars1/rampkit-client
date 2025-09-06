// /components/ui/BackgroundEffects/BackgroundEffects.tsx
"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { PRESETS, val } from "@/components/ui/BackgroundEffects/gpt_types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const BackgroundEffects = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const steps = Array.from({ length: 12 });

  // One preset per mount (random but cohesive)
  const preset = useMemo(() => {
    const r = crypto.getRandomValues(new Uint32Array(1))[0] % PRESETS.length;
    return PRESETS[r];
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      const els = gsap.utils.toArray<HTMLDivElement>(`.${styles.step}`);
      const total = els.length;

      els.forEach((el, index) => {
        // Build objects by resolving functions with (index,total)
        const from: Record<string, any> = {};
        for (const [k, v] of Object.entries(preset.from)) {
          from[k] = val(v, index, total);
        }
        const to: Record<string, any> = {};
        for (const [k, v] of Object.entries(preset.to)) {
          to[k] = val(v, index, total);
        }
        // Always set background color by step
        to.background = getColorFromCSS(`--accent-${index + 1}`);

        tl.fromTo(el, from, to, 0);
      });
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden>
      <div className={styles.stepsWrapper}>
        {steps.map((_, i) => (
          <div id={`STEP_${i}`} key={i} className={styles.step} />
        ))}
      </div>
    </div>
  );
};
