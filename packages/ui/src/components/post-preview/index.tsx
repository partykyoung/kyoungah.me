import clsx from "clsx";

interface PostPreviewProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {}

function PostPreview({ children, className }: PostPreviewProps) {
  return <div className={clsx(className)}>{children}</div>;
}

function PostPreviewTitle() {}

function PostPreviewThumbnail() {}

function PostPreviewDate() {}

function PostPreviewTags() {}

function PostPreviewExcerpt() {}

export {
  PostPreview,
  PostPreviewTitle,
  PostPreviewThumbnail,
  PostPreviewDate,
  PostPreviewTags,
  PostPreviewExcerpt,
};
