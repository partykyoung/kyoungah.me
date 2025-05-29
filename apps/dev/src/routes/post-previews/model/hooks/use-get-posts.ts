import React from "react";
import type { Post } from "../types/post";
import { getPosts } from "../../api/get-posts";
import { useQuery } from "@kyoungah.me/query";

function useGetPosts() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    enabled: false,
    staleTime: Infinity,
  });

  return { posts: [] };
}

export { useGetPosts };
