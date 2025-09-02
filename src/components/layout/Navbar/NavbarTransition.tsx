// NavbarTransition.tsx
"use client";
import layoutStyles from "./../../../app/layout.module.scss";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { NavbarDefault } from "@/components/layout/Navbar/NavbarDefault";
import { NavbarScroller } from "@/components/layout/Navbar/NavbarScroller";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const NavbarTransition = () => {
  const hasGeneratedTheme = useHasGeneratedTheme();
  const defaultNavbarRef = useRef<HTMLElement>(null);
  const scrollNavbarRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !hasGeneratedTheme ||
        !defaultNavbarRef.current ||
        !scrollNavbarRef.current ||
        !headerRef.current
      ) {
        console.log("No theme generated, skipping navbar animation");
        return;
      }

      // Set initial states
      gsap.set(scrollNavbarRef.current, {
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      });

      gsap.set(defaultNavbarRef.current, {
        opacity: 1,
        zIndex: 2,
      });

      // Create the navbar transition
      const navbarTransition = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top", // When header top hits viewport top
          end: "bottom -=120", // When header bottom hits viewport top
          scrub: 1,
          onUpdate: (self) => {
            // When animation starts (scrolling down past the navbar)
            if (self.progress > 0.5 && self.direction === 1) {
              // Make scroller navbar fixed
              gsap.set(scrollNavbarRef.current, {
                position: "fixed",
                top: "8px",
                left: "50%",
                width: "fit-content",
                transform: "translateX(-50%)",
                zIndex: 1000,
              });
            } else if (self.progress < 0.5 && self.direction === -1) {
              // Make scroller navbar absolute when scrolling back up
              gsap.set(scrollNavbarRef.current, {
                position: "absolute",
                zIndex: 1,
              });
            }
          },
        },
      });

      // Crossfade animation
      navbarTransition
        .to(
          defaultNavbarRef.current,
          {
            opacity: 0,
            ease: "power2.out",
          },
          0,
        )
        .fromTo(
          scrollNavbarRef.current,
          { y: 32 },
          {
            y: 8,
            opacity: 1,
            ease: "power2.out",
          },
          ">",
        ); // Both animations start at the same time
    },
    {
      scope: headerRef,
      dependencies: [hasGeneratedTheme],
    },
  );

  return (
    <div ref={headerRef} className={layoutStyles.navbar}>
      <NavbarDefault ref={defaultNavbarRef} />
      <NavbarScroller ref={scrollNavbarRef} />
    </div>
  );
};
