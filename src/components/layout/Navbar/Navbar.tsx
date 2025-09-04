"use client";
import styles from "./Navbar.module.scss";
import layoutStyles from "./../../../app/layout.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import Link from "next/link";
import { RAMPKIT_URL } from "@/lib/utils/urls";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { ThemeControls } from "@/components/ui/ThemeControls/ThemeControls";
import { usePaletteData } from "@/context/PaletteDataprovider";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Navbar = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { paletteData, setPaletteData } = usePaletteData();
  const hasGeneratedTheme = !!paletteData;
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const brandLogoRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    // window.innerWidth / 2 - 150

    // on resize, update the container width
    const handleResize = () => {
      setContainerWidth(window.innerWidth / 2 - 175);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hasGeneratedTheme]);

  useGSAP(
    () => {
      setHasMounted(true);
      if (!containerRef.current || !hasMounted || !hasGeneratedTheme) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: `bottom top`,
          scrub: true,
        },
      });

      timeline
        .fromTo(
          containerRef.current,
          {
            width: "100vw",
            borderRadius: "0",
            padding: 0,
            border: "1px solid transparent",
          },
          {
            width: "400px",
            borderRadius: "99999px",

            top: "8px",
            // center the element horizontally
            x: containerWidth,
            ease: "none",
            border: "1px solid " + getColorFromCSS("--border"),
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top top",
              end: `+=120`,
              scrub: true,
            },
          },
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top -=120",
              end: `+=120`,
              scrub: true,
            },
          },
          "<",
        )

        .to(
          "#STATS_TRIGGER_BUTTON",
          {
            width: "16px",
            height: "16px",
            ease: "none",
          },
          "<",
        )
        .to(
          "#STATS_TRIGGER_BUTTON",
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "center top",
              end: "top -=80",
              markers: true,
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#BRAND_LOGO_REF",
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "bottom top",
              end: "top -=80",
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#STATS_TRIGGER_BUTTON",
          {
            display: "none",
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top -=60",
              end: "top -=80",
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#BRAND_LOGO_REF",
          {
            display: "none",
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top -=60",
              end: "top -=80",
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#STATS_TRIGGER_BUTTON_LEFT",
          {
            display: "inline-block",
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top -=80",
              end: "top -=80",
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#STATS_TRIGGER_BUTTON_LEFT",
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top -=80",
              end: "top -=100",
              scrub: true,
            },
          },
          "<",
        )
        .to(
          "#EXPORT_BUTTON",
          {
            width: "16px",
            height: "16px",
            ease: "none",
          },
          "<",
        )
        .to(
          "#BRAND_LOGO_REF",
          {
            width: "34px",
            height: "34px",
            ease: "none",
          },
          "<",
        )

        .to(
          "#RESET_PALETTE_BUTTON",
          {
            width: "16px",
            height: "16px",
            ease: "none",
          },
          "<",
        )
        .to(
          "#THEME_TOGGLE_BUTTON",
          {
            width: "16px",
            height: "16px",
            ease: "none",
          },
          "<",
        );
    },
    {
      revertOnUpdate: true,
      dependencies: [hasMounted, hasGeneratedTheme, containerWidth],
    },
  );

  const handleResetTheme = () => {
    const topEl = document.getElementById("top");
    if (topEl) {
      topEl.scrollIntoView({ behavior: "smooth" });
      router.replace(RAMPKIT_URL);
    }
    setPaletteData(null);
  };

  const handleGoToExport = () => {
    const exportSection = document.getElementById("export");
    if (exportSection) {
      exportSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id={"top"} ref={containerRef} className={styles.scrollWrapper}>
      <header
        ref={headerRef}
        className={cx(styles.navbar, layoutStyles.navbar)}
      >
        <div className={styles.leftWrapper}>
          <Link href={RAMPKIT_URL} className={styles.brandLink}>
            <Image
              id={"BRAND_LOGO_REF"}
              ref={brandLogoRef}
              src={"/logo/round/rampkit_round.svg"}
              alt={"Logo"}
              width={42}
              height={42}
              className={cx(
                styles.brandLogo,
                theme === "dark" && styles.darkLogo,
              )}
            />
          </Link>
          <StatsPanel id={"STATS_TRIGGER_BUTTON_LEFT"} />

          <ThemeControls
            onReset={handleResetTheme}
            hasCustomTheme={hasGeneratedTheme}
          />
        </div>
        <h2 className={styles.title} ref={titleRef}>
          <small className={styles.titleInner}>rampkit</small>
        </h2>
        <nav className={styles.nav}>
          <StatsPanel id={"STATS_TRIGGER_BUTTON"} />

          {hasGeneratedTheme && (
            <Button
              id={"EXPORT_BUTTON"}
              size={"icon"}
              variant={"blackwhite"}
              className={styles.navButton}
              onClick={handleGoToExport}
            >
              <Download width={16} height={16} />
            </Button>
          )}

          <ThemeSelector />
        </nav>
      </header>
    </div>
  );
};
