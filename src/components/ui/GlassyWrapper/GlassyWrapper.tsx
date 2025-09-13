import styles from "./GlassyWrapper.module.scss";
import { cx } from "@/lib/utils/cx";

export const GlassyWrapper = ({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div className={cx(className, styles.glassyWrapper)}>
      <h2 className={styles.glassyTitle}>{title}</h2>
      {children}
    </div>
  );
};
