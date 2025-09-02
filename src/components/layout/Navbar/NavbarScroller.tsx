"use client";
import styles from "./Navbar.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import Link from "next/link";
import { RAMPKIT_URL } from "@/lib/utils/urls";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RefObject } from "react";
import defaultStyles from "./default.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const NavbarScroller = ({
  ref,
}: {
  ref: RefObject<HTMLElement | null>;
}) => {
  return (
    <header ref={ref} className={cx(styles.scroller)}>
      <Link href={RAMPKIT_URL} className={defaultStyles.brandLink}>
        <Image
          src={"/logo/round/rampkit_round.svg"}
          alt={"Logo"}
          width={40}
          height={40}
          className={defaultStyles.brandLogo}
        />
      </Link>
      <nav className={styles.nav}>
        <StatsPanel />
      </nav>
    </header>
  );
};
