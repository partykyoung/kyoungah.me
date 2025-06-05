"use client";

import { useState, useEffect } from "react";

import NextImage, { type ImageProps } from "next/image";
import { PostDetailSpan } from "@kyoungah.me/ui/build/components/post-detail";

function ClientImage({ src, ...props }: ImageProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = src as string;
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
  }, [src]);

  return (
    <figure>
      <NextImage
        src={src}
        width={dimensions.width}
        height={dimensions.height}
        {...props}
      />
      <figcaption>
        <PostDetailSpan>{props.alt}</PostDetailSpan>
      </figcaption>
    </figure>
  );
}

export { ClientImage };
