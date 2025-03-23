import fs from "fs";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

const cwd = process.cwd();

async function getPostDetail(slug: string) {
  const source = fs.readFileSync(`${cwd}/posts/${decodeURI(slug)}.md`, {
    encoding: "utf-8",
  });
  const { data, content } = matter(source);
  const code = await compile(content, {
    outputFormat: "function-body",
  });

  return {
    frontmatter: data,
    code,
  };
}

export { getPostDetail };
