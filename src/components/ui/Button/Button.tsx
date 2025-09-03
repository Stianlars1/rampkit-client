import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import styles from "./Button.module.scss";

type Variants =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "blackwhite";
type Sizes = "sm" | "md" | "lg" | "icon";

interface BaseProps {
  variant?: Variants;
  size?: Sizes;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps & {
    as: "link";
  };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  as = "button",
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  if (as === "link") {
    const { href, ...linkProps } = props as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}
