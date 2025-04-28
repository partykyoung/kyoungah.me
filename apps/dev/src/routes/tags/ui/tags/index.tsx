"use client";

import { useGetTags } from "../../model/hooks/use-get-tags";

function Tags() {
  const { tags } = useGetTags();

  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export { Tags };
