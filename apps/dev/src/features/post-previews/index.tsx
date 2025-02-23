import * as React from "react";

import { usePosts } from "./lib/use-posts";
import { PostPreview } from "../../widgets/post-preview";

function PostPreviews() {
  const { posts } = usePosts();

  return (
    <>
      {posts.map(({ date, slug, title }, index) => (
        <PostPreview key={index} date={date} slug={slug} title={title} />
      ))}
    </>
  );
}

export { PostPreviews };
