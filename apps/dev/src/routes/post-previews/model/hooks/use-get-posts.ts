import React from "react";
import type { Post } from "../types/post";
import { getPosts } from "../../api/get-posts";
import { useQuery } from "@kyoungah.me/query";

function useGetPosts() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const data = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    enabled: true,
    staleTime: Infinity,
  });

  React.useEffect(() => {
    console.log(data);
    // getPosts().then((data) => {
    //   setPosts((prevState) => prevState.concat(data.posts));
    // });
  }, [data]);

  return { posts };
}

export { useGetPosts };
