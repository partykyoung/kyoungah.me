import React from "react";
import clsx from "clsx";

import styles from "./button.module.css";

interface ButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {}

function Button({ children, className }: ButtonProps) {
  return <button className={clsx(styles.root, className)}>{children}</button>;
}

export type { ButtonProps };
export { Button };
