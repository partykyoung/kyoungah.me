import clsx from "clsx";
import styles from "./circular-loader.module.css";

interface CircularLoaderProps {
  className?: string;
  thickness?: React.CSSProperties["borderWidth"];
  size?: React.CSSProperties["width"] & React.CSSProperties["height"];
}

function CircularLoader({
  className,
  size = 50,
  thickness = 4,
}: CircularLoaderProps) {
  return (
    <span
      className={clsx(styles.root, className)}
      style={{
        borderWidth: thickness,
        width: size,
        height: size,
      }}
    />
  );
}

export type { CircularLoaderProps };
export { CircularLoader };
