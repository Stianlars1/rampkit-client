"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./LoadingScreen.module.scss";
import { ResolvedTheme } from "@/context/ThemeProvider";

gsap.registerPlugin(useGSAP);

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete: () => void;
  theme: ResolvedTheme;
}

export const LoadingScreen = ({
  theme,
  isVisible,
  onComplete,
}: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const bgColor = theme === "dark" ? "#000000" : "#FFFFFF";
  const isDark = theme === "dark";
  useGSAP(
    () => {
      if (containerRef.current) {
        containerRef.current.style.background = bgColor;
      }
      if (!isVisible || !logoRef.current) return;

      const logo = logoRef.current;
      const paths = logo.querySelectorAll("path");
      // Initier dash‑verdier
      paths.forEach((p) => {
        const length = (p as SVGGeometryElement).getTotalLength();
        gsap.set(p, {
          opacity: 0,
          strokeDasharray: length,
          strokeDashoffset: length,
          scale: 0.8,
        });
      });
      // Felles start for hele logoen
      gsap.set(logo, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 200);
        },
      });
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      })
        .to(paths, {
          strokeDashoffset: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
        })
        .to(
          logo,
          {
            scale: 1.05,
            duration: 0.247,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
          },
          "-=0.2",
        )
        .to(containerRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
    },
    { dependencies: [isVisible], scope: containerRef },
  );

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ background: bgColor }}
    >
      <div className={styles.content}>
        <svg
          ref={logoRef}
          className={styles.logo}
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 35.808C0 6.32011 6.32011 0 35.808 0H84.192C113.68 0 120 6.32011 120 35.808V84.192C120 113.68 113.68 120 84.192 120H35.808C6.32011 120 0 113.68 0 84.192V35.808Z"
            fill={isDark ? "#fff" : "#000"}
          />
          <path
            d="M48.7595 84.0759C48.7595 83.4048 49.3036 82.8608 49.9747 82.8608H68.1646C68.8357 82.8608 69.3797 83.4048 69.3797 84.0759V102.266C69.3797 102.937 68.8357 103.481 68.1646 103.481H49.9747C49.3036 103.481 48.7595 102.937 48.7595 102.266V84.0759Z"
            fill={isDark ? "#000" : "#fff"}
          />
          <path
            d="M83.8101 51.3038C83.8101 50.6327 84.3542 50.0886 85.0253 50.0886H102.722C103.393 50.0886 103.937 50.6327 103.937 51.3038V68.962C103.937 69.6332 103.393 70.1772 102.722 70.1772H85.0253C84.3542 70.1772 83.8101 69.6332 83.8101 68.962V51.3038Z"
            fill={isDark ? "#000" : "#fff"}
          />
        </svg>
        <div className={styles.text}>
          <h2
            className={styles.title}
            style={{ color: isDark ? "#fff" : "#000" }}
          >
            Rampkit
          </h2>
          <p className={styles.subtitle}>Loading your palette...</p>
        </div>
      </div>
    </div>
  );
};
