"use client";

import { Tags, Tag } from "@kyoungah.me/ui/build/components/tags";

import { useGetTags } from "../../model/hooks/use-get-tags";
import { root } from "./tags.css";

function Tagsd() {
  const { tags } = useGetTags();

  return (
    <Tags className={root}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </Tags>
  );
}

export { Tagsd as Tags };
