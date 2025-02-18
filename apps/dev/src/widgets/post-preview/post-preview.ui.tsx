import React from "react";
import {
  PostPreview as BasePostPreview,
  PostPreviewDate,
  PostPreviewTitle,
} from "@kyoungah.me/ui/build/components/post-preview";

import { postPreviewDate } from "./post-preview.css";
import { Post } from "../../entities/post/types";

function PostPreview({ date, title }: Pick<Post, "date" | "title">) {
  return (
    <BasePostPreview>
      <PostPreviewDate className={postPreviewDate}>{date}</PostPreviewDate>
      <PostPreviewTitle className="body">{title}</PostPreviewTitle>
    </BasePostPreview>
  );
}

export { PostPreview };
