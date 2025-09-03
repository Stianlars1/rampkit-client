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

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Navbar = () => {
  const [hasMounted, setHasMounted] = useState(false);
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
      console.log("\nresizing");
      console.log("innerwidth", window.innerWidth);
      console.log("calculatefd width", window.innerWidth / 2 - 150);
      setContainerWidth(window.innerWidth / 2 - 175);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hasGeneratedTheme]);

  console.log("contaienr weidth", containerWidth);

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
            width: "350px",
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
        );
    },
    {
      revertOnUpdate: true,
      dependencies: [hasMounted, hasGeneratedTheme, containerWidth],
    },
  );

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
              className={styles.brandLogo}
            />
          </Link>
          {hasGeneratedTheme && (
            <Button
              id={"EXPORT_BUTTON"}
              size={"icon"}
              variant={"blackwhite"}
              className={styles.exportButton}
              onClick={() => {
                const exportSection = document.getElementById("export");
                if (exportSection) {
                  exportSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Download width={16} height={16} />
            </Button>
          )}
        </div>
        <h2 className={styles.title} ref={titleRef}>
          <small>rampkit</small>
        </h2>
        <nav className={styles.nav}>
          <ThemeControls
            onReset={() => {
              const topEl = document.getElementById("top");
              if (topEl) {
                topEl.scrollIntoView({ behavior: "smooth" });
                router.replace(RAMPKIT_URL);
              }
              setPaletteData(null);
            }}
            hasCustomTheme={hasGeneratedTheme}
          />
          <StatsPanel />
        </nav>
      </header>
    </div>
  );
};
