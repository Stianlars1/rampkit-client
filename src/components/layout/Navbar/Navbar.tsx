// @/components/Navbar/Navbar.tsx
"use client";
import styles from "./Navbar.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import Link from "next/link";
import { RAMPKIT_URL } from "@/lib/utils/urls";
import Image from "next/image";
import { forwardRef } from "react";

export type NavbarVariant = "default" | "themed" | "alternate"; // Add your variants

interface NavbarProps {
  variant?: NavbarVariant;
  className?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ variant = "default", className }, ref) => {
    const variantClass = styles[`header--${variant}`] || "";

    return (
      <header ref={ref} className={cx(styles.header, variantClass, className)}>
        <Link href={RAMPKIT_URL} className={styles.brandLink}>
          <Image
            src={"/logo/round/rampkit_round.svg"}
            alt={"Logo"}
            width={40}
            height={40}
            className={styles.brandLogo}
          />
        </Link>
        <nav className={styles.nav}>
          <StatsPanel />
        </nav>
      </header>
    );
  },
);

Navbar.displayName = "Navbar";
