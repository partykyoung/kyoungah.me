import React, { useEffect, useState } from "react";
import type { Post } from "../types/post";
import { getPosts } from "../../api/get-posts";
import { useQuery, useQueryClient } from "@kyoungah.me/query";

function useGetPosts() {
  const [page, setPage] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["posts", page],
    queryFn: getPosts,
    enabled: page !== null,
  });

  useEffect(() => {
    const postsCache = queryClient.getQueriesData({
      type: "active",
      queryKey: ["posts"],
    });

    setPage(postsCache.length > 0 ? postsCache.length : 1);
  }, []);

  return { posts: [] };
}

export { useGetPosts };
