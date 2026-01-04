import styles from "./page.module.scss";
import TypographyTool from "@/app/typography/typography";
import { cx } from "@/lib/utils/cx";
import Link from "next/link";
import { RampkitLogo } from "@/assets/rampkitLogo";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";

export default function Page() {
  return (
    <div className={cx(styles.wrap)}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.homeLink}>
          <RampkitLogo widthHeight={32} alt={"RampKit logo"} />
        </Link>

        <ThemeSelector buttonSize={16} />
      </nav>
      {/*      <header className={styles.header}>
        <h1 className={styles.title}>Type Scale Generator</h1>
        <p className={styles.lead}>
          Create a fluid, accessible, token-driven typography system. Copy code
          instantly or download a ZIP.
        </p>
      </header>*/}

      <TypographyTool />
    </div>
  );
}
