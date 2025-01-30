import React from "react";
import clsx from "clsx";

import styles from "./button.module.css";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  asChild?: boolean;
}

function Button({
  asChild = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={clsx(styles.root, className)} {...props}>
      {children}
    </Comp>
  );
}

export type { ButtonProps };
export { Button };
