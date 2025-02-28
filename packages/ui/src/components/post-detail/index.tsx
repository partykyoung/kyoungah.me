import React from "react";
import clsx from "clsx";

import styles from "./post-detail.module.css";

function PostDetailH1({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={clsx(styles.h1, className)} {...props} />;
}

function PostDetailH2({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={clsx(styles.h2, className)} {...props} />;
}

function PostDetailH3({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx(styles.h3, className)} {...props} />;
}

function PostDetailH4({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={clsx(styles.h4, className)} {...props} />;
}

function PostDetailH5({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={clsx(styles.h5, className)} {...props} />;
}

function PostDetailH6({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h6 className={clsx(styles.h6, className)} {...props} />;
}

export {
  PostDetailH1,
  PostDetailH2,
  PostDetailH3,
  PostDetailH4,
  PostDetailH5,
  PostDetailH6,
};
