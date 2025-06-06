import React from "react";
import clsx from "clsx";

import styles from "./button.module.css";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps
  extends React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  > {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

function Button({
  asChild = false,
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp 
      className={clsx(styles.root, styles[variant], styles[size], className)} 
      {...props}
    >
      {children}
    </Comp>
  );
}

export type { ButtonProps };
export { Button };
