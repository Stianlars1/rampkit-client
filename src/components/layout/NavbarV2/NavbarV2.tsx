"use client";
import styles from "./NavbarV2.module.scss";
import layoutStyles from "../../../app/(home)/layout.module.scss";
import { cx } from "@/lib/utils/cx";
import { StatsPanel } from "@/components/ui/StatsPanel/StatsPanel";
import Link from "next/link";
import { RAMPKIT_URL, ROUTE_TYPOGRAPH } from "@/lib/utils/urls";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ThemeControls } from "@/components/ui/ThemeControls/ThemeControls";
import { usePaletteData } from "@/context/PaletteDataprovider";
import { ArrowLeft, CaseSensitive, Download } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import { RampkitLogo } from "@/components/layout/NavbarV2/rampkitLogo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const NavbarV2 = () => {
  const { theme } = useTheme();
  const { paletteData, setPaletteData } = usePaletteData();
  const hasGeneratedTheme = !!paletteData;
  const router = useRouter();
  const pathName = usePathname();
  const formattedPathname = pathName.split("?")[0].split("/")[1];
  const isTypographPage = formattedPathname === "typography";
  const isRootPage = formattedPathname === "";

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
    <header id={"top"} className={cx(styles.navbar, layoutStyles.navbar)}>
      <div className={styles.leftWrapper}>
        {!hasGeneratedTheme && (
          <Link href={RAMPKIT_URL}>
            <RampkitLogo
              widthAndHeight={42}
              className={cx(
                styles.brandLogo,
                theme === "dark" && styles.darkLogo,
              )}
            />
          </Link>
        )}

        {isTypographPage && (
          <Button
            as={"link"}
            variant={"blackwhite"}
            aria-label={"Click to go back to generating hex palettes"}
            href={RAMPKIT_URL}
            className={cx(styles.link, styles.backLink)}
          >
            <ArrowLeft />
          </Button>
        )}

        {isRootPage && (
          <Link
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

      <div className={styles.rightWrapper}>
        <StatsPanel />

        <ThemeSelector />
      </div>
    </header>
  );
};
