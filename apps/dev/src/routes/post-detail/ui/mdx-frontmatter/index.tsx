"use client";

import dayjs from "dayjs";

import { Tags, Tag } from "@kyoungah.me/ui/build/components/tags";
import { PostDetailSpan } from "@kyoungah.me/ui/build/components/post-detail";

import { H1 } from "../post-detail-elements";

import * as styles from "./mdx-frontmatter.css";

type Props = {
  title: string;
  date: string;
  tags: string[];
};

function MdxFrontMatter({ title, date, tags }: Props) {
  return (
    <div className={styles.root}>
      <H1 className={styles.title}>{title}</H1>
      <PostDetailSpan className={styles.date}>
        {dayjs(date).format("YYYY.MM.DD")}
      </PostDetailSpan>
      <Tags asChild className={styles.tags}>
        <ul>
          {tags.map((tag) => (
            <Tag key={tag} asChild className={styles.tag}>
              <li>{tag}</li>
            </Tag>
          ))}
        </ul>
      </Tags>
    </div>
  );
}

export { MdxFrontMatter };
