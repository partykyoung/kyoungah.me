"use client";

import * as React from "react";

import { usePosts } from "./lib/use-posts";
import { PostPreview } from "../../widgets/post-preview";
import { postPreview, root } from "./post-previews.css";

function PostPreviews() {
  const { posts } = usePosts();

  return (
    <ul className={root}>
      {posts.map(({ date, slug, title }, index) => (
        <li key={index} className={postPreview}>
          <PostPreview date={date} slug={slug} title={title} />
        </li>
      ))}
    </ul>
  );
}

export { PostPreviews };
