"use client";

import { PaletteData } from "@/types";
import styles from "./ColorRamp.module.scss";
import { hexToHSL } from "@/lib/utils/color-utils";
import { copy } from "@stianlarsen/copy-to-clipboard";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { cx } from "@/lib/utils/cx";

gsap.registerPlugin(useGSAP);

interface ColorRampProps {
  data: PaletteData;
}

export function ColorRamp({ data }: ColorRampProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accentRampRef = useRef<HTMLDivElement>(null);
  const grayRampRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !accentRampRef.current ||
        !grayRampRef.current
      ) {
        return;
      }

      const accentSteps = gsap.utils.toArray(`.rampkit_color_ramp_accent`);
      const graySteps = gsap.utils.toArray(`.rampkit_color_ramp_gray`);

      const timeline = gsap.timeline({ defaults: { ease: "power1.out" } });

      timeline.fromTo(
        accentRampRef.current,
        {
          y: 15,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
        },
      );

      timeline.fromTo(
        accentSteps,
        {
          opacity: 0,
        },
        {
          opacity: 1,

          duration: 0.24,
          stagger: 0.025,
        },
        "<",
      );

      timeline.fromTo(
        grayRampRef.current,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
        },
      );

      timeline.fromTo(
        graySteps,
        {
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: grayRampRef.current,
            // start when bottom of trigger has passed bottom of viewport
            start: "center bottom",
            // end when bottom is 100px above bottom of viewport
            end: "bottom+=50 bottom",
            scrub: true,
          },
          opacity: 1,
          duration: 0.24,
          stagger: 0.025,
        },
      );
    },
    { scope: containerRef, dependencies: [] },
  );
  const renderColorStep = (
    color: string,
    index: number,
    type: "accent" | "gray",
  ) => {
    const copyToClipboard = (color: string) => {
      copy(color);
    };

    const isThisCopied = copiedHex === color;

    const hsl = hexToHSL(color);
    const isLight = hsl.l > 50;

    const handleCopy = () => {
      copyToClipboard(color);
      setCopiedHex(color);
      setTimeout(() => setCopiedHex(null), 1000);
    };

    return (
      <button
        key={`${type}-${index}`}
        className={cx(
          styles.colorStep,
          `rampkit_color_ramp_${type}`,
          styles[`colorStep_${type}`],
          `rampkit_color_ramp_${type}_${index + 1}`,
        )}
        style={{ background: color }}
        onClick={handleCopy}
        title={`Copy ${color}`}
      >
        <span
          className={`${styles.stepLabel} ${isLight ? styles.dark : styles.light}`}
        >
          {isThisCopied ? "copied" : index + 1}
        </span>

        {!isThisCopied && (
          <span
            className={`${styles.hexValue} ${isLight ? styles.dark : styles.light}`}
          >
            {color}
          </span>
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={accentRampRef} className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Colors</h3>
        <div className={styles.lightRamp}>
          <span className={styles.modeLabel}>Light</span>
          <div className={styles.colorGrid}>
            {data.accentScale.light.map((color, index) =>
              renderColorStep(color, index, "accent"),
            )}
          </div>
        </div>
        <div className={styles.darkRamp}>
          <span className={styles.modeLabel}>Dark</span>
          <div className={styles.colorGrid}>
            {data.accentScale.dark.map((color, index) =>
              renderColorStep(color, index, "accent"),
            )}
          </div>
        </div>
      </div>

      <div ref={grayRampRef} className={styles.section}>
        <h3 className={styles.sectionTitle}>Gray Colors</h3>
        <div className={styles.lightRamp}>
          <span className={styles.modeLabel}>Light</span>
          <div className={styles.colorGrid}>
            {data.grayScale.light.map((color, index) =>
              renderColorStep(color, index, "gray"),
            )}
          </div>
        </div>
        <div className={styles.darkRamp}>
          <span className={styles.modeLabel}>Dark</span>
          <div className={styles.colorGrid}>
            {data.grayScale.dark.map((color, index) =>
              renderColorStep(color, index, "gray"),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
