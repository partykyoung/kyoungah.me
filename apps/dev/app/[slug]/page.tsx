import fs from "fs";
import { PostDetailH1 } from "@kyoungah.me/ui/build/components/post-detail";
import { MDXContent } from "@/pages/post-detail";
import { getPostDetail } from "@/pages/post-detail/api/get-post-detail";

const cwd = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const slug = (await params).slug;
    const { frontmatter, code } = await getPostDetail(slug);

    return (
      <>
        <PostDetailH1 className="h1">{frontmatter.title}</PostDetailH1>
        <MDXContent code={code.value as string} />
      </>
    );
  } catch (error) {
    return <div>Error</div>;
  }
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
