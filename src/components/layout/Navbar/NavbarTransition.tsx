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

  console.log("hasGeneratedTheme", hasGeneratedTheme);
  useGSAP(
    () => {
      if (
        !hasGeneratedTheme ||
        !defaultNavbarRef.current ||
        !scrollNavbarRef.current
      ) {
        console.log("No theme generated, skipping navbar animation");
        return;
      }

      const defaultTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: defaultNavbarRef.current,
          start: "top top", // when the top of the trigger hits the top of the viewport
          end: "bottom top", // end after scrolling 500px beyond the start
          pin: true,
          scrub: 1,
          markers: true,
          pinSpacing: true,
        },
      });

      const scrollerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: scrollNavbarRef.current,
          start: "top +=100px", // when the top of the trigger hits the top of the viewport
          end: "bottom -=60", // end after scrolling 500px beyond the start
          pin: true,
          scrub: 1,
          pinSpacing: true,
          markers: true,
        },
      });

      defaultTimeline.to(defaultNavbarRef.current, {
        opacity: 0,
        ease: "power2.out",
      });

      scrollerTimeline.to(scrollNavbarRef.current, {
        opacity: 0,
        ease: "power2.out",
        left: "-100%",
      });
    },
    {
      scope: headerRef,
      dependencies: [hasGeneratedTheme],
    },
  );

  return (
    <div ref={headerRef} className={layoutStyles.navbar}>
      <NavbarScroller ref={scrollNavbarRef} />

      <NavbarDefault ref={defaultNavbarRef} />
    </div>
  );
};
