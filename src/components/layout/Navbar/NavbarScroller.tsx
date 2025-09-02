"use client";
import styles from "./Navbar.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const NavbarScroller = ({
  ref,
}: {
  ref: RefObject<HTMLElement | null>;
}) => {
  return (
    <header ref={ref} className={cx(styles.scroller)}>
      <nav className={styles.nav}>
        <StatsPanel iconSize={16} />
      </nav>
    </header>
  );
};
