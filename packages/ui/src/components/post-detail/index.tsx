import React from "react";
import clsx from "clsx";

import styles from "./post-detail.module.css";
import { Slot } from "@radix-ui/react-slot";

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

function PostDetailP({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx(styles.p, className)} {...props} />;
}

function PostDetailUl({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={clsx(styles.ul, className)} {...props} />;
}

function PostDetailOl({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className={clsx(styles.ol, className)} {...props} />;
}

function PostDetailLi({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={clsx(styles.li, className)} {...props} />;
}

interface PostDetailLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

function PostDetailLink({ asChild, className, ...props }: PostDetailLinkProps) {
  const Comp = asChild ? Slot : "a";

  return <Comp className={clsx(styles.link, className)} {...props} />;
}

function PostDetailImg({
  className,
  ...props
}: React.HTMLAttributes<HTMLImageElement>) {
  return <img className={clsx(styles.img, className)} {...props} />;
}

export {
  PostDetailH1,
  PostDetailH2,
  PostDetailH3,
  PostDetailH4,
  PostDetailH5,
  PostDetailH6,
  PostDetailP,
  PostDetailUl,
  PostDetailOl,
  PostDetailLi,
  PostDetailLink,
  PostDetailImg,
};
