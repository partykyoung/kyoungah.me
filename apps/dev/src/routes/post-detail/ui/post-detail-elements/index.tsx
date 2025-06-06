import React from "react";
import { ImageProps } from "next/image";
import NextLink, { LinkProps } from "next/link";
import clsx from "clsx";
import * as PostDetail from "@kyoungah.me/ui/build/components/post-detail";
import { ClientImage } from "./client-image";
import * as styles from "./post-detail-elements.css";

function H1({ className, ...props }: PostDetail.PostDetailH1Props) {
  return <PostDetail.PostDetailH1 {...props} />;
}

function H2({ className, ...props }: PostDetail.PostDetailH2Props) {
  return <PostDetail.PostDetailH2 {...props} />;
}

function H3({ className, ...props }: PostDetail.PostDetailH3Props) {
  return <PostDetail.PostDetailH3 {...props} />;
}

function H4({ className, ...props }: PostDetail.PostDetailH4Props) {
  return <PostDetail.PostDetailH4 {...props} />;
}

function H5({ className, ...props }: PostDetail.PostDetailH5Props) {
  return <PostDetail.PostDetailH5 {...props} />;
}

function H6({ className, ...props }: PostDetail.PostDetailH6Props) {
  return <PostDetail.PostDetailH6 {...props} />;
}

function P({ className, ...props }: PostDetail.PostDetailPProps) {
  return <PostDetail.PostDetailP {...props} />;
}

function Ul({ className, ...props }: PostDetail.PostDetailUlProps) {
  return <PostDetail.PostDetailUl {...props} />;
}

function Ol({ className, ...props }: PostDetail.PostDetailOlProps) {
  return <PostDetail.PostDetailOl {...props} />;
}

function Li({ className, ...props }: PostDetail.PostDetailLiProps) {
  return <PostDetail.PostDetailLi {...props} />;
}

function Link({
  className,
  ...props
}: LinkProps &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className">) {
  return (
    <PostDetail.PostDetailLink asChild className={clsx(className)}>
      <NextLink {...props} />
    </PostDetail.PostDetailLink>
  );
}

function Img({ className, ...props }: Omit<ImageProps, "fill">) {
  return (
    <PostDetail.PostDetailImageFigure
      asChild
      alt={props.alt}
      className={clsx(className)}
    >
      <ClientImage {...props} />
    </PostDetail.PostDetailImageFigure>
  );
}

function Caption({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx(styles.caption, className)} {...props} />;
}

export { H1, H2, H3, H4, H5, H6, P, Ul, Ol, Li, Link, Img, Caption };
