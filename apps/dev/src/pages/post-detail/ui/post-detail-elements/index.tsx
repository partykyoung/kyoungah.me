import Image, { ImageProps } from "next/image";
import NextLink, { LinkProps } from "next/link";
import clsx from "clsx";
import * as PostDetail from "@kyoungah.me/ui/build/components/post-detail";

import * as styles from "./post-detail-elements.css";

function H1({ className, ...props }: PostDetail.PostDetailH1Props) {
  return (
    <PostDetail.PostDetailH1
      className={clsx(styles.h1, className)}
      {...props}
    />
  );
}

function H2({ className, ...props }: PostDetail.PostDetailH2Props) {
  return (
    <PostDetail.PostDetailH2
      className={clsx(styles.h2, className)}
      {...props}
    />
  );
}

function H3({ className, ...props }: PostDetail.PostDetailH3Props) {
  return (
    <PostDetail.PostDetailH3
      className={clsx(styles.h3, className)}
      {...props}
    />
  );
}

function H4({ className, ...props }: PostDetail.PostDetailH4Props) {
  return (
    <PostDetail.PostDetailH4
      className={clsx(styles.h4, className)}
      {...props}
    />
  );
}

function H5({ className, ...props }: PostDetail.PostDetailH5Props) {
  return (
    <PostDetail.PostDetailH5
      className={clsx(styles.h5, className)}
      {...props}
    />
  );
}

function H6({ className, ...props }: PostDetail.PostDetailH6Props) {
  return (
    <PostDetail.PostDetailH6
      className={clsx(styles.h6, className)}
      {...props}
    />
  );
}

function P({ className, ...props }: PostDetail.PostDetailPProps) {
  return (
    <PostDetail.PostDetailP className={clsx(styles.p, className)} {...props} />
  );
}

function Ul({ className, ...props }: PostDetail.PostDetailUlProps) {
  return (
    <PostDetail.PostDetailUl
      className={clsx(styles.ul, className)}
      {...props}
    />
  );
}

function Ol({ className, ...props }: PostDetail.PostDetailOlProps) {
  return (
    <PostDetail.PostDetailOl
      className={clsx(styles.ol, className)}
      {...props}
    />
  );
}

function Li({ className, ...props }: PostDetail.PostDetailLiProps) {
  return (
    <PostDetail.PostDetailLi
      className={clsx(styles.li, className)}
      {...props}
    />
  );
}

function Link({
  className,
  ...props
}: LinkProps &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className">) {
  return (
    <PostDetail.PostDetailLink asChild className={clsx(styles.link, className)}>
      <NextLink {...props} />
    </PostDetail.PostDetailLink>
  );
}

function Img({ alt = "", className, ...props }: ImageProps) {
  return (
    <PostDetail.PostDetailImg asChild className={clsx(styles.img, className)}>
      <Image alt={alt} {...props} />
    </PostDetail.PostDetailImg>
  );
}

export { H1, H2, H3, H4, H5, H6, P, Ul, Ol, Li, Link, Img };
