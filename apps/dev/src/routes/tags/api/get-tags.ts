import { apiInstance } from "@/shared/api/api-instance";

function getTags() {
  return apiInstance<{ tags: string[] }>("/jsons/tags.json");
}

export { getTags };
