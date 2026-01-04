import styles from "./Loader.module.scss";

export const Loader = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return <div className={styles.loader} style={{ width, height }} />;
};
