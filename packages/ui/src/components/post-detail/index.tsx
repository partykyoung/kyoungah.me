import React from "react";
import clsx from "clsx";

import styles from "./post-detail.module.css";
import { Slot } from "@radix-ui/react-slot";

// ----------- h1 ----------- //
interface PostDetailH1Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH1({ className, ...props }: PostDetailH1Props) {
  return <h1 className={clsx(styles.h1, className)} {...props} />;
}

// ----------- h2 ----------- //

interface PostDetailH2Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH2({ className, ...props }: PostDetailH2Props) {
  return <h2 className={clsx(styles.h2, className)} {...props} />;
}

// ----------- h3 ----------- //

interface PostDetailH3Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH3({ className, ...props }: PostDetailH3Props) {
  return <h3 className={clsx(styles.h3, className)} {...props} />;
}

// ----------- h4 ----------- //

interface PostDetailH4Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH4({ className, ...props }: PostDetailH4Props) {
  return <h4 className={clsx(styles.h4, className)} {...props} />;
}

// ----------- h5 ----------- //

interface PostDetailH5Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH5({ className, ...props }: PostDetailH5Props) {
  return <h5 className={clsx(styles.h5, className)} {...props} />;
}

// ----------- h6 ----------- //

interface PostDetailH6Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function PostDetailH6({ className, ...props }: PostDetailH6Props) {
  return <h6 className={clsx(styles.h6, className)} {...props} />;
}

// ----------- p ----------- //

interface PostDetailPProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function PostDetailP({ className, ...props }: PostDetailPProps) {
  return <p className={clsx(styles.p, className)} {...props} />;
}
// ----------- ul ----------- //

interface PostDetailUlProps extends React.HTMLAttributes<HTMLUListElement> {}

function PostDetailUl({ className, ...props }: PostDetailUlProps) {
  return <ul className={clsx(styles.ul, className)} {...props} />;
}

// ----------- ol ----------- //

interface PostDetailOlProps extends React.HTMLAttributes<HTMLOListElement> {}

function PostDetailOl({ className, ...props }: PostDetailOlProps) {
  return <ol className={clsx(styles.ol, className)} {...props} />;
}

// ----------- li ----------- //

interface PostDetailLiProps extends React.HTMLAttributes<HTMLLIElement> {}

function PostDetailLi({ className, ...props }: PostDetailLiProps) {
  return <li className={clsx(styles.li, className)} {...props} />;
}

// ----------- link ----------- //

interface PostDetailLinkProps<T> extends React.AnchorHTMLAttributes<T> {
  asChild?: boolean;
}

function PostDetailLink<T extends HTMLAnchorElement = HTMLAnchorElement>({
  asChild,
  className,
  ...props
}: PostDetailLinkProps<T>) {
  const Comp = asChild ? Slot : "a";

  return <Comp className={clsx(styles.link, className)} {...props} />;
}

// ----------- img ----------- //

interface PostDetailImgProps<T> extends React.ImgHTMLAttributes<T> {
  asChild?: boolean;
}

function PostDetailImg<T extends HTMLImageElement = HTMLImageElement>({
  asChild,
  className,
  ...props
}: PostDetailImgProps<T>) {
  const Comp = asChild ? Slot : "img";
  return <Comp className={clsx(styles.img, className)} {...props} />;
}

// ----------- figure ----------- //

interface PostDetailFigureProps extends React.HTMLAttributes<HTMLElement> {}

function PostDetailFigure({ className, ...props }: PostDetailFigureProps) {
  return <figure className={clsx(styles.figure, className)} {...props} />;
}

// ----------- figcaption ----------- //

interface PostDetailFigCaptionProps extends React.HTMLAttributes<HTMLElement> {}

function PostDetailFigCaption({
  className,
  ...props
}: PostDetailFigCaptionProps) {
  return <figcaption className={clsx(styles.caption, className)} {...props} />;
}

// ----------- span ----------- //

interface PostDetailSpanProps extends React.HTMLAttributes<HTMLSpanElement> {}

function PostDetailSpan({ className, ...props }: PostDetailSpanProps) {
  return <span className={clsx(styles.span, className)} {...props} />;
}

// ----------- image figure ----------- //

interface PostDetailImageFigureProps<T> extends React.ImgHTMLAttributes<T> {
  asChild?: boolean;
  figureClassName?: string;
  figCaptionClassName?: string;
}

function PostDetailImageFigure<T extends HTMLImageElement = HTMLImageElement>({
  asChild,
  alt,
  className,
  figureClassName,
  figCaptionClassName,
  ...props
}: PostDetailImageFigureProps<T>) {
  if (alt) {
    return (
      <PostDetailFigure>
        <PostDetailImg
          asChild={asChild}
          className={className}
          alt={alt}
          {...props}
        />
        <PostDetailFigCaption>{alt}</PostDetailFigCaption>
      </PostDetailFigure>
    );
  }

  return <PostDetailImg asChild={asChild} className={className} {...props} />;
}

export {
  type PostDetailH1Props,
  type PostDetailH2Props,
  type PostDetailH3Props,
  type PostDetailH4Props,
  type PostDetailH5Props,
  type PostDetailH6Props,
  type PostDetailPProps,
  type PostDetailUlProps,
  type PostDetailOlProps,
  type PostDetailLiProps,
  type PostDetailLinkProps,
  type PostDetailImgProps,
  type PostDetailFigureProps,
  type PostDetailFigCaptionProps,
  type PostDetailImageFigureProps,
  type PostDetailSpanProps,
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
  PostDetailFigure,
  PostDetailFigCaption,
  PostDetailSpan,
  PostDetailImageFigure,
};
