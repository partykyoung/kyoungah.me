import { apiInstance } from "@/shared/api/api-instance";
import type { Post } from "../model/types/post";

type Posts = {
  currentPage: number;
  limit: number;
  numPages: number;
  posts: Post[];
  skip: number;
};

function getPosts() {
  return apiInstance<Posts>("/jsons/page-1.json");
}

export { getPosts };
