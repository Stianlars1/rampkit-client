"use client";

import dynamic from "next/dynamic";
import pageStyles from "./page.module.scss";
import styles from "@/app/typography/typography.module.scss";
import { useHasGeneratedTheme } from "@/hooks/useHasGeneratedTheme";

const TypographyTool = dynamic(() => import("./typography"), {
  ssr: false,
});

export default function Page() {
  const hasGeneratedTheme = useHasGeneratedTheme();

  return (
    <div className={pageStyles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Type Scale Generator</h1>
        <p className={styles.lead}>
          Create a fluid, accessible, token-driven typography system. Copy code
          instantly or download a ZIP.
        </p>
      </header>

      {/* Optional: Show loading state or different content based on theme availability */}
      {hasGeneratedTheme ? (
        <TypographyTool />
      ) : (
        <div>
          <TypographyTool />
          {/* You could show a message like "Generate a theme first to see custom colors" */}
        </div>
      )}
    </div>
  );
}
