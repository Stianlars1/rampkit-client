import pageStyles from "./page.module.scss";
import styles from "@/app/typography/typography.module.scss";
import TypographyTool from "@/app/typography/typography";

export default function Page() {
  return (
    <div className={pageStyles.wrap}>
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
