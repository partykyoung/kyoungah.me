"use client";

import { useState, useEffect } from "react";

import NextImage, { type ImageProps } from "next/image";

function ClientImage({ src, ...props }: ImageProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  console.log(src);

  useEffect(() => {
    const img = new Image();
    img.src = src as string;
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
  }, [src]);

  return (
    <NextImage
      src={src}
      width={dimensions.width}
      height={dimensions.height}
      {...props}
    />
  );
}

export { ClientImage };
