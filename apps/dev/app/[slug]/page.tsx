import fs from "fs";

const cwd = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { default: Post } = await import(`../../posts/${slug}.md`);

  return <Post />;
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
