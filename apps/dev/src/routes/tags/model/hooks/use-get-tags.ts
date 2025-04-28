import React from "react";
import { getTags } from "../../api/get-tags";

function useGetTags() {
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    getTags().then((data) => {
      setTags((prevState) => prevState.concat(data.tags));
    });
  }, []);

  return { tags };
}

export { useGetTags };
