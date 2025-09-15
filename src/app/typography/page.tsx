import pageStyles from "./page.module.scss";
import styles from "@/app/typography/typography.module.scss";
import TypographyTool from "@/app/typography/typography";
import { cx } from "@/lib/utils/cx";
import defaultStyles from "@/app/layout.module.scss";

export default function Page() {
  return (
    <div className={cx(pageStyles.wrap, defaultStyles.hero)}>
      <header className={styles.header}>
        <h1 className={styles.title}>Type Scale Generator</h1>
        <p className={styles.lead}>
          Create a fluid, accessible, token-driven typography system. Copy code
          instantly or download a ZIP.
        </p>
      </header>

      <TypographyTool />
    </div>
  );
}
