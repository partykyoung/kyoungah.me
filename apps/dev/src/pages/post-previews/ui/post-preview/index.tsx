import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

import {
  PostPreview as BasePostPreview,
  PostPreviewDate,
  PostPreviewTitle,
} from "@kyoungah.me/ui/build/components/post-preview";

import { postPreviewDate, postPreviewTitle } from "./post-preview.css";
import type { Post } from "../../model/types/post";

function PostPreview({
  date,
  slug,
  title,
}: Pick<Post, "date" | "slug" | "title">) {
  return (
    <Link href={slug}>
      <BasePostPreview>
        <PostPreviewDate className={postPreviewDate}>
          {dayjs(date).format("YYYY.MM.DD")}
        </PostPreviewDate>
        <PostPreviewTitle className={`body ${postPreviewTitle}`}>
          {title}
        </PostPreviewTitle>
      </BasePostPreview>
    </Link>
  );
}

export { PostPreview };
