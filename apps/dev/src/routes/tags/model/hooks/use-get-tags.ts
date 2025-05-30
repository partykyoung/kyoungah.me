import { useQuery } from "@kyoungah.me/query";

import { getTags } from "../../api/get-tags";

function useGetTags() {
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  return { tags: data?.tags ?? [] };
}

export { useGetTags };
