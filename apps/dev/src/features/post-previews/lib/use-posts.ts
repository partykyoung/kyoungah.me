import React from "react";

import { Post } from "../../../../../dev/src/entities/post/types";
import { getPosts } from "../../../../../dev/src/entities/post/api";

function usePosts() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    getPosts().then((data) => {
      setPosts((prevState) => prevState.concat(data.posts));
    });
  }, []);

  return { posts };
}

export { usePosts };
