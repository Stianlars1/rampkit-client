"use client";
import styles from "./Navbar.module.scss";
import layoutStyles from "./../../../app/layout.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import Link from "next/link";
import { RAMPKIT_URL, ROUTE_ROOT, ROUTE_TYPOGRAPH } from "@/lib/utils/urls";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { ThemeControls } from "@/components/ui/ThemeControls/ThemeControls";
import { usePaletteData } from "@/context/PaletteDataprovider";
import { ArrowLeft, CaseSensitive, Download, Link2, Type } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { getColorFromCSS } from "@/lib/utils/color-utils";
import { usePathname, useRouter } from "next/navigation";
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
  const pathName = usePathname();
  const formattedPathname = pathName.split("?")[0].split("/")[1];
  const isTypographPage = formattedPathname === "typography";
  const isRootPage = formattedPathname === "";

  useEffect(() => {
    // on resize, update the container width
    const handleResize = () => {
      setContainerWidth(window.innerWidth / 2 - 190);
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

      // Container Animation

      timeline.fromTo(
        containerRef.current,
        {
          width: "100vw",
          borderRadius: "0",
          padding: 0,
          border: "1px solid transparent",
        },
        {
          width: "380px",
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
      );

      // Text Animation
      timeline.to(
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
      );

      // Icon Fade ins
      if (isTypographPage) {
        timeline.to("#BACK_TO_RAMPKIT_LINK", {
          width: "34px",
          height: "34px",
          ease: "none",
        });
      }

      if (isRootPage) {
        timeline.to("#GO_TO_TYPO", {
          width: "34px",
          height: "34px",
          ease: "none",
        });
      }

      timeline
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
          "#EXPORT_BUTTON",
          {
            width: "16px",
            height: "16px",
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
    const replaceUrl = pathName.split("?")[0];
    if (topEl) {
      topEl.scrollIntoView({ behavior: "smooth" });
      router.replace(replaceUrl);
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
          {!hasGeneratedTheme && (
            <Link
              aria-label={"Click to refresh the website"}
              href={RAMPKIT_URL}
              className={styles.brandLink}
            >
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
          )}

          {isTypographPage && (
            <Link
              id={"BACK_TO_RAMPKIT_LINK"}
              aria-label={"Click to go back to generating hex palettes"}
              href={RAMPKIT_URL}
              className={cx(styles.link, styles.backLink)}
            >
              <ArrowLeft />
            </Link>
          )}

          {isRootPage && (
            <Link
              id={"GO_TO_TYPO"}
              aria-label={"Click to go to the typography generator tool"}
              href={ROUTE_TYPOGRAPH}
              className={cx(styles.link, styles.backLink)}
              title={"Go to Typography Tool"}
            >
              <CaseSensitive />
            </Link>
          )}

          <StatsPanel id={"STATS_TRIGGER_BUTTON_LEFT"} />

          {hasGeneratedTheme && (
            <Button
              id={"EXPORT_BUTTON"}
              size={"icon"}
              variant={"blackwhite"}
              className={styles.navButton}
              onClick={handleGoToExport}
              aria-label="Click to go to the export section"
              title="Go to Export Section"
            >
              <Download width={16} height={16} />
            </Button>
          )}

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

          <ThemeSelector />
        </nav>
      </header>
    </div>
  );
};
