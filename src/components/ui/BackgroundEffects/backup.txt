"use client";
import styles from "./BackgroundEffects.module.scss";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { getColorFromCSS } from "@/lib/utils/color-utils";

gsap.registerPlugin([ScrollTrigger, useGSAP]);
export const BackgroundEffects = () => {
  // array of 12
  const steps = Array.from({ length: 12 }, (_, i) => i + 1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline();
      const steps = gsap.utils.toArray<HTMLDivElement>(`.${styles.step}`);

      steps.forEach((step, index) => {
        timeline.fromTo(
          step,
          {
            opacity: 1,
            //background: "transparent",
            //x: 200 + 10 * -index, // recede to the right
            //y: 10 * index, // recede down
            //rotateZ: "-45deg",
            //rotateX: "25deg",
            //rotateY: "25deg",
            //perspective: 2000,
            force3D: true,
            scale: 1, // start small
            //z: -200 * index, // recede into depth

            z: -100, // recede into depth
            x: 10, // recede to the right
            y: 50, // recede down
            filter: "blur(6px)",
          },
          {
            background: getColorFromCSS(`--accent-${index + 1}`),

            opacity: () => {
              return index / (steps.length - 1);
            },

            filter: "blur(0px)",

            scale: 4 - 0.1 * index, // normal size at final position
            x: 5 * index, // recede to the right
            //y: 200 * (index * 0.25), // small vertical lift
            y: -10 * index, // recede down

            rotateX: index * 2 + "deg",
            rotateY: index * 1.5 + "deg",
            rotateZ: index * 4 + "deg",
            z: 10 * index, // recede into depth
            duration: 1.5,
            ease: "power3.inOut",
            delay: 0.1 * index,
          },
          0,
        );
      });
    },
    { scope: wrapperRef },
  );
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.stepsWrapper}>
        {steps.map((step, idx) => (
          <div
            id={"STEP_" + idx}
            key={idx}
            className={styles.step}
            // 3d rotation based on index
            style={
              {
                //transform: `translateY(${idx * 10}px) translateX(${idx * 10}px) translateZ(${idx * 25}px)  `,
              }
            }
          />
        ))}
      </div>
    </div>
  );
};
