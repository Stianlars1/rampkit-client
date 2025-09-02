// @/components/Navbar/NavbarTransition.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Navbar, NavbarVariant } from "./Navbar";
import layoutStyles from "./../../../app/layout.module.scss";
import styles from "./NavbarTransition.module.scss";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";
import { cx } from "@/lib/utils/cx";

gsap.registerPlugin(useGSAP);

export const NavbarTransition = () => {
  const hasGeneratedTheme = useHasGeneratedTheme();
  const [currentVariant, setCurrentVariant] =
    useState<NavbarVariant>("default");
  const [showIncoming, setShowIncoming] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentHeaderRef = useRef<HTMLElement>(null);
  const incomingHeaderRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasGeneratedTheme && currentVariant === "default") {
      // Trigger animation to themed
      setShowIncoming(true);
    } else if (!hasGeneratedTheme) {
      // Just reset immediately without animation
      setCurrentVariant("default");
      setShowIncoming(false);
      // Clear any existing transforms
      if (currentHeaderRef.current) {
        gsap.set(currentHeaderRef.current, { clearProps: "all" });
      }
    }
  }, [hasGeneratedTheme, currentVariant]);

  // Only animate when going to themed
  useGSAP(
    () => {
      if (!showIncoming || !hasGeneratedTheme) return;

      if (!currentHeaderRef.current || !incomingHeaderRef.current) return;

      const timeline = gsap.timeline({
        onComplete: () => {
          setCurrentVariant("themed");
          // setShowIncoming(true);
        },
      });

      // Set initial position for incoming header
      gsap.set(incomingHeaderRef.current, {
        y: "-100%",
        opacity: 1,
      });

      // Animate both headers
      timeline
        .to(currentHeaderRef.current, {
          opacity: 0,
          y: "100%",
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          incomingHeaderRef.current,
          {
            y: "0%",
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        );
    },
    {
      scope: containerRef,
      dependencies: [showIncoming, hasGeneratedTheme],
    },
  );

  return (
    <div
      ref={containerRef}
      className={cx(styles.transitionContainer, layoutStyles.navbar)}
    >
      <Navbar
        ref={currentHeaderRef}
        variant={currentVariant}
        className={styles.currentHeader}
      />

      {showIncoming && (
        <Navbar
          ref={incomingHeaderRef}
          variant="themed"
          className={styles.incomingHeader}
        />
      )}
    </div>
  );
};
