import fs from "fs";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import rehypeExpressiveCode from "rehype-expressive-code";

const cwd = process.cwd();

const rehypeExpressiveCodeOptions = {
  themes: ["one-dark-pro"],
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
};

async function getPostDetail(slug: string) {
  const source = fs.readFileSync(`${cwd}/posts/${decodeURI(slug)}.md`, {
    encoding: "utf-8",
  });
  const { data, content } = matter(source);
  const code = await compile(content, {
    outputFormat: "function-body",
    remarkPlugins: [],
    rehypePlugins: [[rehypeExpressiveCode, rehypeExpressiveCodeOptions]],
  });

  return {
    frontmatter: data,
    code,
  };
}

export { getPostDetail };
