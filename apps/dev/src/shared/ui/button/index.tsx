import React from "react";

import { buttonVariants, type ButtonVariants } from "./button.css";

import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@kyoungah.me/ui/build/components/button";
import clsx from "clsx";

interface ButtonProps
  extends Omit<BaseButtonProps, "color">,
    NonNullable<ButtonVariants> {}

function Button({ className, color, size, variant, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={clsx(buttonVariants({ color, size, variant }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
export { Button };
