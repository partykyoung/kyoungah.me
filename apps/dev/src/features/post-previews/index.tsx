import * as React from "react";

import { usePosts } from "./lib/use-posts";
import { PostPreview } from "../../widgets/post-preview";

function PostPreviews() {
  const { posts } = usePosts();

  return (
    <>
      {posts.map(({ date, title }, index) => (
        <PostPreview key={index} date={date} title={title} />
      ))}
    </>
  );
}

export { PostPreviews };
