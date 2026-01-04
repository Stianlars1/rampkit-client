"use client";
import styles from "./rampkitLogo.module.css";
import { useTheme } from "@/context/ThemeProvider";

type rampkitLogoProps = {
  widthHeight: number;
  className?: string;
  alt: string;
  variant?: "light" | "dark" | "auto";
};

export const RampkitLogo = ({
  widthHeight,
  className,
  alt,
  variant = "auto",
}: rampkitLogoProps) => {
  const { resolvedTheme } = useTheme();

  const isDark =
    variant === "auto" ? resolvedTheme === "dark" : variant === "dark";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3160 3160"
      width={widthHeight}
      height={widthHeight}
      className={`${styles.rampkitLogo} ${className || ""}`}
      role="img"
      aria-label={alt}
      fill="none"
    >
      <path
        d="M0 942.944C0 166.43 166.43 0 942.944 0H2217.06C2993.57 0 3160 166.43 3160 942.944V2217.06C3160 2993.57 2993.57 3160 2217.06 3160H942.944C166.43 3160 0 2993.57 0 2217.06V942.944Z"
        fill={isDark ? "white" : "black"}
      ></path>
      <rect
        x="1284"
        y="2182"
        width="543"
        height="543"
        rx="32"
        fill={isDark ? "black" : "white"}
      ></rect>
      <rect
        x="2207"
        y="1319"
        width="530"
        height="529"
        rx="32"
        fill={isDark ? "black" : "white"}
      ></rect>
    </svg>
  );
};
