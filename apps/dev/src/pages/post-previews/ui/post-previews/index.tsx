"use client";

import * as React from "react";

import { postPreview, root } from "./post-previews.css";
import { useGetPosts } from "../../model/hooks/use-get-posts";

import { PostPreview } from "../post-preview";

function PostPreviews() {
  const { posts } = useGetPosts();

  return (
    <ul className={root}>
      {/* {posts.length === 0 && <li>포스트가 없습니다.</li>} */}
      {posts.map(({ date, slug, title }, index) => (
        <li key={index} className={postPreview}>
          <PostPreview date={date} slug={slug} title={title} />
        </li>
      ))}
    </ul>
  );
}

export { PostPreviews };
