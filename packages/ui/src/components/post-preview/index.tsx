import clsx from "clsx";
import { AspectRatio } from "../aspect-ratio/index.js";

function PostPreview({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className)}>{children}</div>;
}

function PostPreviewTitle({
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={clsx(className)}>{children}</h2>;
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

function PostPreviewDate() {}

function PostPreviewTags() {}

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
  PostPreviewTags,
  PostPreviewExcerpt,
};
