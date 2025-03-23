import React from "react";
import type { Post } from "../types/post";
import { getPosts } from "../../api/get-posts";

function useGetPosts() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    getPosts().then((data) => {
      setPosts((prevState) => prevState.concat(data.posts));
    });
  }, []);

  return { posts };
}

export { useGetPosts };
