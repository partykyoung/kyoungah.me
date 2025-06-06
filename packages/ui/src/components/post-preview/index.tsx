import React from "react";
import clsx from "clsx";
import { AspectRatio } from "../aspect-ratio";

import styles from "./post-preview.module.css";

function PostPreview({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(styles.root, className)}>{children}</div>;
}

function PostPreviewTitle({
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={clsx(styles.title, className)}>{children}</h2>;
}

function PostPreviewThumbnail({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <AspectRatio ratio={1}>
      <img className={clsx(className)} {...props} />
    </AspectRatio>
  );
}

function PostPreviewDate({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx(styles.date, className)} {...props}>
      {children}
    </span>
  );
}

function PostPreviewExcerpt({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <p {...props}>{children}</p>;
}

export {
  PostPreview,
  PostPreviewTitle,
  PostPreviewThumbnail,
  PostPreviewDate,
  PostPreviewExcerpt,
};
