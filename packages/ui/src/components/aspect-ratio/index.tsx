import React from "react";
import { Slot } from "@radix-ui/react-slot";
interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  ratio?: number;
}

function AspectRatio({
  asChild,
  className,
  ratio = 100,
  style,
  ...props
}: AspectRatioProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${ratio}%`,
      }}
      {...props}
    />
  );
}

export { AspectRatio };
