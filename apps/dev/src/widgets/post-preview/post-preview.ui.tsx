import React from "react";
import {
  PostPreview as BasePostPreview,
  PostPreviewDate,
  PostPreviewTitle,
} from "@kyoungah.me/ui/build/components/post-preview";

import { postPreviewDate } from "./post-preview.css";
import { Post } from "../../../../dev/src/entities/post/types";
import { Link } from "gatsby";

function PostPreview({
  date,
  slug,
  title,
}: Pick<Post, "date" | "slug" | "title">) {
  return (
    <Link to={slug}>
      <BasePostPreview>
        <PostPreviewDate className={postPreviewDate}>{date}</PostPreviewDate>
        <PostPreviewTitle className="body">{title}</PostPreviewTitle>
      </BasePostPreview>
    </Link>
  );
}

export { PostPreview };
