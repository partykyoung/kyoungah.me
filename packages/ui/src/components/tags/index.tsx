import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./tags.module.css";

// ----------- Tags ----------- //

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  size?: "sm" | "md";
}

function Tags({
  asChild,
  children,
  className,
  size = "md",
  ...props
}: TagsProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={clsx(
        styles.tags,
        size === "sm" ? styles["tags-sm"] : styles["tags-md"],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ----------- Tag ----------- //
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  size?: "sm" | "md";
}

function Tag({
  asChild,
  children,
  className,
  size = "md",
  ...props
}: TagProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      className={clsx(
        styles.tag,
        size === "sm" ? styles["tag-sm"] : styles["tag-md"],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Tag, Tags };
