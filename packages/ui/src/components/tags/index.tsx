import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

import styles from "./tags.module.css";

// ----------- Tags ----------- //

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function Tags({ asChild, children, className, ...props }: TagsProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={clsx(styles.tags, className)} {...props}>
      {children}
    </Comp>
  );
}

// ----------- Tag ----------- //
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

function Tag({ asChild, children, className, ...props }: TagProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={clsx(styles.tag)} {...props}>
      {children}
    </Comp>
  );
}

export { Tag, Tags };
