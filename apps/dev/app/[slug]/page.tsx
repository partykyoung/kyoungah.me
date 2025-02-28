import fs from "fs";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import { MDXContent } from "@/mdx-components";
import { PostDetailH1 } from "@kyoungah.me/ui/build/components/post-detail";

const cwd = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const decodedSlug = /%[0-9A-F]{2}/i.test(slug) ? decodeURI(slug) : slug;

  const source = fs.readFileSync(`${cwd}/posts/${decodedSlug}.md`, {
    encoding: "utf-8",
  });
  const { data, content } = matter(source);
  const code = await compile(content, {
    outputFormat: "function-body",
  });

  return (
    <>
      <PostDetailH1 className="h1">{data.title}</PostDetailH1>
      <MDXContent code={code.value as string} />
    </>
  );
}

export function generateStaticParams() {
  const POSTS_DERECTORY = `${cwd}/posts`;

  const posts = fs
    .readdirSync(POSTS_DERECTORY, {
      encoding: "utf-8",
    })
    .map((post) => ({ slug: post.replace(".md", "") }));

  return posts;
}

export const dynamicParams = false;
