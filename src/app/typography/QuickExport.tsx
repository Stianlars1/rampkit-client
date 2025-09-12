"use client";

import { useMemo, useState } from "react";
import styles from "./QuickExport.module.scss";
import { emitCSS } from "@/lib/typography/emit/css";
import { emitSCSS } from "@/lib/typography/emit/scss";
import { emitDTCG } from "@/lib/typography/emit/dtcg";
import { emitReactModule } from "@/lib/typography/emit/react";
import { emitReactStyles } from "@/lib/typography/emit/reactStyles";
import { exportAllAsZip } from "@/lib/typography/exportAll";
import { CodePreview } from "@stianlarsen/react-code-preview";

export function QuickExport({
  projectName,
  tokens,
  filesForZip,
  roleMap,
}: {
  projectName: string;
  tokens: any;
  filesForZip: { path: string; contents: string }[];
  roleMap: Record<"display" | "headline" | "title" | "body" | "label", string>;
}) {
  const [tab, setTab] = useState<
    "css" | "scss" | "react-tsx" | "react-scss" | "tokens"
  >("css");
  const [copied, setCopied] = useState(false);

  const computedRoleMap: Record<
    "display" | "headline" | "title" | "body" | "label",
    string
  > = roleMap ?? {
    display: "display",
    headline: "headline",
    title: "title",
    body: "body",
    label: "label",
  };

  const cssVars = useMemo(() => {
    return codeBlock(
      emitCSS({
        family: tokens.typography.font.family.sans.value,
        roles: {
          display: tokens.typography.roles.display,
          headline: tokens.typography.roles.headline,
          title: tokens.typography.roles.title,
          body: tokens.typography.roles.body,
          label: tokens.typography.roles.label,
        },
        roleMap: computedRoleMap,
      }),
    );
  }, [tokens, computedRoleMap]);

  const scssUtils = useMemo(
    () => codeBlock(emitSCSS(computedRoleMap)),
    [computedRoleMap],
  );
  const reactTs = useMemo(() => codeBlock(emitReactModule()), []);
  const reactScss = useMemo(() => codeBlock(emitReactStyles()), []);
  const tokenJson = useMemo(() => codeBlock(emitDTCG(tokens)), [tokens]);

  const currentData = () => {
    switch (tab) {
      case "css":
        return { code: cssVars, filename: "typography.css", language: "css" };
      case "scss":
        return {
          code: scssUtils,
          filename: "typography.utilities.scss",
          language: "scss",
        };
      case "react-tsx":
        return {
          code: reactTs,
          filename: "typography.tsx",
          language: "typescript",
        };
      case "react-scss":
        return {
          code: reactScss,
          filename: "typography.module.scss",
          language: "scss",
        };
      case "tokens":
        return {
          code: tokenJson,
          filename: "typography.tokens.json",
          language: "json",
        };
      default:
        return { code: "", filename: "", language: "text" };
    }
  };

  async function onCopy() {
    const { code } = currentData();
    await navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onZip() {
    await exportAllAsZip(filesForZip, `${projectName}-typography.zip`);
  }

  const current = currentData();

  return (
    <section className={styles.quickExport}>
      <div className={styles.exportHeader}>
        <div className={styles.exportTitle}>
          <h3>Export Code</h3>
          <p className={styles.exportSubtitle}>
            Copy the generated code or download as a complete package
          </p>
        </div>
        <div className={styles.exportActions}>
          <button type="button" onClick={onCopy} className={styles.copyButton}>
            <span className={styles.copyIcon}>{copied ? "✓" : "⧉"}</span>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onZip}
            className={styles.downloadButton}
          >
            <span className={styles.downloadIcon}>↓</span>
            Download ZIP
          </button>
        </div>
      </div>

      <div className={styles.tabContainer}>
        <div className={styles.tabRow}>
          <button
            type="button"
            className={tab === "css" ? styles.tabActive : styles.tab}
            onClick={() => setTab("css")}
          >
            <span className={styles.tabIcon}>🎨</span>
            CSS Variables
          </button>
          <button
            type="button"
            className={tab === "scss" ? styles.tabActive : styles.tab}
            onClick={() => setTab("scss")}
          >
            <span className={styles.tabIcon}>⚡</span>
            SCSS Utilities
          </button>
          <button
            type="button"
            className={tab === "react-tsx" ? styles.tabActive : styles.tab}
            onClick={() => setTab("react-tsx")}
          >
            <span className={styles.tabIcon}>⚛</span>
            React Component
          </button>
          <button
            type="button"
            className={tab === "react-scss" ? styles.tabActive : styles.tab}
            onClick={() => setTab("react-scss")}
          >
            <span className={styles.tabIcon}>🎯</span>
            React Styles
          </button>
          <button
            type="button"
            className={tab === "tokens" ? styles.tabActive : styles.tab}
            onClick={() => setTab("tokens")}
          >
            <span className={styles.tabIcon}>📋</span>
            Design Tokens
          </button>
        </div>

        <div className={styles.fileInfo}>
          <span className={styles.filename}>{current.filename}</span>
          <span className={styles.language}>{current.language}</span>
        </div>
      </div>

      <CodePreview
        key={current.code}
        code={current.code}
        className={styles.codePreview}
      />
    </section>
  );
}

function codeBlock(code: string): string {
  return code.replace(/\t/g, "  ");
}
