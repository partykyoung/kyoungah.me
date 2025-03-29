"use client";

import dayjs from "dayjs";
import { H1 } from "../post-detail-elements";

import { root } from "./mdx-frontmatter.css";

type Props = {
  title: string;
  date: string;
  tags: string[];
};

function MdxFrontMatter({ title, date, tags }: Props) {
  return (
    <div className={root}>
      <H1>{title}</H1>
      <span>{dayjs(date).format("YYYY.MM.DD")}</span>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}

export { MdxFrontMatter };
